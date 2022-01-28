import {manifest, version} from '@parcel/service-worker';
import { request, gql, RequestDocument } from 'graphql-request'

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
addEventListener('fetch', e => e.waitUntil());

async function periodicSync(e) {
  if (e.tag == 'update-day') {
    const date = new Date()
    const req = await request("https://api.purplegrey.today/graphql", gql`{
      getDay(day: ${date.getDate()}, month: ${date.getMonth() + 1}, year: ${date.getFullYear()}) {
      time,
      type
      }
    }`) 
    const cache = await caches.open(version);
    cache.put("https://api.purplegrey.today/api", req)
  }
}

addEventListener('periodicsync', (e) => {
  e.waitUntil(periodicSync(e)) 
})