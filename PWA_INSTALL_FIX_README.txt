TN STATE HUB - PWA INSTALL FIX

This package matches the GitHub repository layout shown in your screenshot: icon PNG files are at the repository ROOT (not inside an icons folder).

Upload/replace ALL files in this ZIP directly into the ROOT of repository TNL. Do not create an extra folder. Keep the existing GitHub Pages source as main branch / root.

Expected root files include:
index.html
manifest.webmanifest
service-worker.js
icon-192.png
icon-512.png
apple-touch-icon.png
icon.svg

After GitHub Pages finishes publishing, test these URLs:
https://shyjan0919.github.io/TNL/manifest.webmanifest
https://shyjan0919.github.io/TNL/icon-192.png
https://shyjan0919.github.io/TNL/icon-512.png

All three must load (no 404). Then Chrome DevTools > Application > Manifest should list 192x192 and 512x512 icons and no missing-icon installability error.

Service worker cache name has been bumped so the browser updates the app shell.
