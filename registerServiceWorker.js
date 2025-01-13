// src/registerServiceWorker.js
export function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // New SW is available, notify the user
                  console.log("New content available, please refresh.");
                  // Add logic to show a notification or auto-refresh
                  // For example:
                  window.alert(
                    "                'New content is available and will be used when all ' +'tabs for this page are closed. See https://bit.ly/CRA-PWA.'"
                  );
                  window.location.reload(true);
                } else {
                  console.log("Content is cached for offline use.");
                }
              }
            };
          }
        };
      })
      .catch((error) => console.error("SW registration failed:", error));
  }
}
