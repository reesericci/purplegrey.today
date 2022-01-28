import {manifest, version} from '@parcel/service-worker';

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
addEventListener('fetch', e => e.waitUntil(activate()));

async function updateDay() {
  console.log("updating day...")
  dispatchEvent(new Event("picked"))
}

async function periodicSync(e) {
  console.log("PBGS")
  if (e.tag == 'update-day') {
    e.waitUntil(updateDay())
}

addEventListener('periodicsync', (e) => e.waitUntil(periodicSync(e)) )}