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
addEventListener('fetch', e=> e.waitUntil(activate()))