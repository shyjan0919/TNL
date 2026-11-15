TN STATE HUB — PHASE 1 / REGISTRATION UPDATE
===========================================

This package updates the existing Phase 1 Milestone 5 project. It does not modify Phase 2.

REGISTRATION FLOW
1. DOM registers first with Employee Code, Full Name, Division Name (free text), Mobile Number and password.
2. Login ID is generated automatically as <EmployeeCode>@tnhub.in. No email field is requested.
3. ZOH approves the DOM. The approved DOM profile is written to users/{uid}; a minimal public approvedDomDirectory/{uid} record is created for registration dropdowns.
4. ROM registration is enabled only when at least one approved DOM is available.
5. ROM selects a Division and then a DOM filtered to that division. Region Name is not requested.
6. ZOH approves the ROM. Approval rechecks that the selected DOM is still active and belongs to the selected division. The ROM profile receives divisionId, divisionName, domUid, domEmpCode and regionId=employeeCode.

LOGIN AND RECOVERY
- Login screen accepts Employee Code; the app converts it to <EmployeeCode>@tnhub.in for Firebase Authentication.
- This generated address is a Firebase login identifier, not a mailbox. Email-based password reset is removed. Password recovery must be handled by an administrator through a secure Firebase Admin/Console process. Do not promise that a ZOH client-side button can reset another user's password.

FIRESTORE RULES
- Publish the included firestore.rules in Firebase Console > Firestore Database > Rules.
- approvedDomDirectory is intentionally a minimal public read directory so unauthenticated ROM applicants can see only approved DOM names, employee codes and divisions. ZOH alone can write it.
- registration requests remain self-create/self-read and ZOH-reviewed. Users remain ZOH-provisioned only.
- Existing ZOH profile and login are preserved.

DEPLOYMENT
1. Back up your current Phase 1 files.
2. Replace index.html with the included index.html.
3. Publish firestore.rules.
4. Confirm Firebase Authentication Email/Password is enabled.
5. Test with a temporary DOM account: register, sign out, sign in as ZOH, approve DOM, confirm approved DOM appears in directory.
6. Test ROM registration: select division, select a DOM in that division, submit, sign out, approve as ZOH, confirm ROM profile mapping.
7. Test employee-code login for DOM and ROM.

IMPORTANT
- Existing Phase 1 test accounts created with email addresses continue to have their old Firebase login email. The login field accepts either an employee code (converted to <empCode>@tnhub.in) or a full email address. This preserves an existing ZOH account that was originally created with a different email. Do not delete the existing ZOH account.
- Firebase email/password auth does not verify that an employee code belongs to a real employee. ZOH must verify identity during approval.
- Test rules and flows before real users register.


INSTALLABLE MOBILE APP (PWA)
----------------------------
This project now includes a Web App Manifest, app icon, and Service Worker.

DEPLOYMENT
1. Upload the complete contents of this ZIP to the root of your GitHub Pages repository (keep the icons folder).
2. Enable GitHub Pages and open the published site using its HTTPS address.
3. Open the site in Chrome on Android.
4. Tap the browser menu (three dots) and choose “Install app” or “Add to Home screen”.
5. Confirm installation. TN State HUB will appear on the phone like an app and open in standalone mode.

IMPORTANT
- The app shell can be opened from cache after it has been loaded once.
- Firebase login, approvals, and live Firestore data require an internet connection. This is not a fully offline banking/business app.
- Installability requires HTTPS (GitHub Pages provides HTTPS).
- After publishing an update, close and reopen the app; the Service Worker will refresh the app shell.


APP ICON UPDATE
The approved TN State HUB navy-and-gold emblem is now used for Android PWA icons and the iPhone Apple touch icon. After deploying, close/remove the previously installed home-screen app and add it again to refresh its icon. The service-worker cache version has been updated.


DESIGN UPDATE – LIGHT THEME
- The ZOH dashboard now uses the approved white, royal navy and gold mobile-first theme.
- The approved TN State HUB artwork is used for PWA and iPhone Home Screen icon assets.
- Service worker cache was incremented to v3 so browsers can refresh the updated shell.
- After deployment, refresh the website; on installed devices, close and reopen the app. If an old icon remains, remove the old Home Screen shortcut and add it again from Safari/Chrome.
