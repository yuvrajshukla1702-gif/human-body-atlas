# Anatomy Studio on a phone

The app is a static website. It has no account system or hosted backend.

## Open it from any network

Publish the site folder to an HTTPS static host to obtain a public link. Open that link on your phone using mobile data or any Wi-Fi connection. Your phone and computer do not need to share a network. A local address such as `localhost` or `127.0.0.1` is only accessible on the device running the server.

Upload the current app files, `icons/`, `vendor/`, and the three `models/optimized-*.glb` files. The original large model files, old viewer scripts, `.git/`, and `.model-tools/` are not required. Preserve the folder structure. Hosting must serve `.js` as JavaScript, `.glb` as binary glTF, and `manifest.webmanifest` as a web app manifest. It must not return HTML for missing model or script files.

## Use it with no internet

1. Open the published HTTPS link while online.
2. Use **Download for offline** inside the app. Keep the app open until it confirms completion. This saves the study content, viewer code, and all three optimized 3D models on this device.
3. Optionally add the site to your home screen using your browser's install or share menu.
4. Disconnect, then reopen the saved app on the same device and in the same browser.

Opening a model normally also saves that model when browser storage permits. The explicit download is the reliable way to prepare the complete app. Installation alone does not download every model. A browser may remove cached files when storage is low, site data is cleared, or private browsing ends; use the in-app offline status to check readiness. Downloads may use significant mobile data, so check the displayed size before starting.

Offline access is separate from remote access: the public HTTPS link enables different networks; downloading prepares this device for no connection at all. Service workers require HTTPS, except for local previews on the same device.

## Local preview

With Node.js installed, run `node serve.mjs` from this folder and open `http://127.0.0.1:4173`. An optional port can be passed, for example `node serve.mjs 4174`. The preview server listens only on this computer. Use an HTTPS deployment for the phone workflow.

## Scope

This is a study atlas and interactive visualization, not a complete medical curriculum or a clinical tool. Available structures depend on the included licensed models. Animations and visual emphasis are illustrative; they do not simulate physiology or establish normal patient anatomy. Consult the app's sources and established course materials for detail and assessment.
