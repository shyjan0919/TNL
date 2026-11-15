const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

exports.rejectRegistration = onCall({ region: 'asia-south1' }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in before reviewing registrations.');
  const requestUid = String(request.data?.requestUid || '').trim();
  if (!requestUid) throw new HttpsError('invalid-argument', 'A registration request ID is required.');

  const reviewerUid = request.auth.uid;
  const reviewerSnap = await db.doc(`users/${reviewerUid}`).get();
  if (!reviewerSnap.exists || reviewerSnap.data().active !== true) {
    throw new HttpsError('permission-denied', 'An active employee profile is required.');
  }
  const reviewer = reviewerSnap.data();
  const requestRef = db.doc(`registrationRequests/${requestUid}`);
  const requestSnap = await requestRef.get();
  if (!requestSnap.exists) throw new HttpsError('not-found', 'Registration request was not found.');
  const applicant = requestSnap.data();

  if (applicant.status !== 'PENDING') {
    throw new HttpsError('failed-precondition', 'This registration is no longer pending.');
  }

  const isZohRejectingDom = reviewer.role === 'ZOH' && applicant.requestedRole === 'DOM';
  const isAssignedDomRejectingRom = reviewer.role === 'DOM'
    && applicant.requestedRole === 'ROM'
    && applicant.domUid === reviewerUid
    && String(applicant.requestedDivisionId || '') === String(reviewer.divisionId || '');
  if (!isZohRejectingDom && !isAssignedDomRejectingRom) {
    throw new HttpsError('permission-denied', 'You are not authorised to reject this registration.');
  }

  // Delete Auth first. If deletion fails, leave the request PENDING so the UI
  // cannot report a completed rejection while the login account still exists.
  try {
    await getAuth().deleteUser(requestUid);
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      console.error('Could not delete rejected applicant Auth account:', error);
      throw new HttpsError('internal', 'The Authentication account could not be removed. The request remains pending; please retry or contact the administrator.');
    }
  }

  const batch = db.batch();
  batch.update(requestRef, {
    status: 'REJECTED',
    reviewedAt: FieldValue.serverTimestamp(),
    reviewedBy: reviewerUid,
    authAccountDeleted: true,
    cleanupCompletedAt: FieldValue.serverTimestamp()
  });
  batch.set(db.collection('auditLogs').doc(), {
    action: 'REGISTRATION_REJECTED',
    targetUid: requestUid,
    targetEmpCode: String(applicant.empCode || ''),
    targetRole: String(applicant.requestedRole || ''),
    divisionId: String(applicant.requestedDivisionId || ''),
    actorUid: reviewerUid,
    authAccountDeleted: true,
    createdAt: FieldValue.serverTimestamp()
  });
  await batch.commit();
  return { success: true, authAccountDeleted: true, status: 'REJECTED' };
});
