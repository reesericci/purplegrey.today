import {manifest, version} from '@parcel/service-worker';
import { responsePathAsArray } from 'graphql';
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
    fetch('https://api.purplegrey.today/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `{
          getDay(day: ${date.getDate()}, month: ${date.getMonth() + 1}, year: ${date.getFullYear()}) {
          time,
          type
          }
        }`,
        variables: {
          type: 'post'
        }
      }),
      headers: {
          'content-type': 'application/json'
      }
    }).then(async (res) => {
        const cache = await caches.open(version);
        cache.put("https://api.purplegrey.today/api", res)
    });
  }
}

addEventListener('periodicsync', (e) => {
  e.waitUntil(periodicSync(e)) 
})