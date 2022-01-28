import {manifest, version} from '@parcel/service-worker';


async function registerPeriodicSync() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.periodicSync.register('update-day', {
      minInterval: 1 * 60 * 60 * 1000,
    });
  } catch {
    console.log('Periodic Sync could not be registered!');
  }
}

addEventListener('periodicsync', event => {
  if (event.tag == 'update-day') {
    event.waitUntil(() => {
      dispatchEvent(new Event("picked"))
    });
  }
});

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
  await registerPeriodicSync()
}
addEventListener('install', e => e.waitUntil(install()));

async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(key => key !== version && caches.delete(key))
  );
}
addEventListener('activate', e => e.waitUntil(activate()));