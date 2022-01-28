import {manifest, version} from '@parcel/service-worker';

addEventListener('periodicsync', event => {
  if (event.tag == 'update-day') {
    event.waitUntil(() => {
      console.log("updated")
      dispatchEvent(new Event("picked"))
    });
  }
});

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}
addEventListener('install', e => e.waitUntil(install()));

async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(key => key !== version && caches.delete(key))
  );
}
addEventListener('activate', e => e.waitUntil(activate()));