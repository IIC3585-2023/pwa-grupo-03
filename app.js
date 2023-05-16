window.addEventListener('load', () => {
  registerSW();
});

// Register the Service Worker
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./serviceWorker.js');
      console.log('Service worker registered! 😎', reg);
    }
    catch (e) {
      console.log('SW registration failed');
    }
  }
}