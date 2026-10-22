import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import auth from '../api/auth.mjs';
import cms from '../api/cms.mjs';
import upload from '../api/upload.mjs';

process.env.SESSION_SECRET = 'demo_session_secret_only_for_automated_testing_123456';
process.env.ADMIN_USERNAME = 'core-test';
process.env.ADMIN_PASSWORD = 'automated-test-password-strong';
process.env.GITHUB_TOKEN = 'test-token';
process.env.GITHUB_REPOSITORY = 'mock-owner/mock-repo';
process.env.GITHUB_BRANCH = 'staging-coremedia';

const doc = { version: 1, brands: [{ id: 'a', name: 'A', media: [] }], site: { hero: { badge: 'Original' } } };
const state = { files: new Map([['data/cms.json', Buffer.from(JSON.stringify(doc))]]) };
const shaFor = (bytes) => createHash('sha1').update(bytes).digest('hex');
const originalFetch = global.fetch;
global.fetch = async (url, opts = {}) => {
  const match = String(url).match(/\/contents\/(.+?)\?ref=/);
  if (!match) throw new Error(`mock received unexpected URL: ${url}`);
  const path = match[1].split('/').map(decodeURIComponent).join('/');
  if (opts.method === 'PUT') {
    const payload = JSON.parse(opts.body);
    assert.equal(payload.branch, 'staging-coremedia');
    if (state.files.has(path) && payload.sha !== shaFor(state.files.get(path))) return new Response(JSON.stringify({ message: 'SHA conflict' }), { status: 409 });
    if (!state.files.has(path) && payload.sha) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
    const contents = Buffer.from(payload.content, 'base64');
    state.files.set(path, contents);
    return Response.json({ content: { sha: shaFor(contents) } });
  }
  const bytes = state.files.get(path);
  if (!bytes) return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 });
  return Response.json({ content: bytes.toString('base64'), sha: shaFor(bytes) });
};
const request = (method, path, payload, cookie, origin = 'https://dev.example.test') => new Request(`https://dev.example.test${path}`, {
  method,
  ...(method !== 'GET' ? { headers: { origin, 'content-type': 'application/json', ...(cookie ? { cookie } : {}) } } : cookie ? { headers: { cookie } } : {}),
  ...(payload ? { body: JSON.stringify(payload) } : {}),
});

try {
  let res = await cms.fetch(request('GET', '/api/cms'));
  assert.equal(res.status, 401, 'Unauthenticated users cannot access CMS');
  res = await auth.fetch(request('POST', '/api/auth', { username: 'core-test', password: 'bad password' }));
  assert.equal(res.status, 401, 'Invalid password rejected');
  res = await auth.fetch(request('POST', '/api/auth', { username: 'core-test', password: process.env.ADMIN_PASSWORD }));
  assert.equal(res.status, 200, 'Valid password accepted');
  const cookie = res.headers.get('set-cookie').split(';')[0];
  res = await cms.fetch(request('GET', '/api/cms', null, cookie));
  assert.equal(res.status, 200);
  const first = await res.json();
  assert.equal(first.cms.brands[0].name, 'A');
  res = await cms.fetch(request('PUT', '/api/cms', { sha: first.sha, cms: { brands: [], site: first.cms.site } }, cookie));
  assert.equal(res.status, 200, 'Deletion of last project is preserved');
  let updated = await res.json();
  assert.equal(updated.cms.brands.length, 0);
  res = await cms.fetch(request('PUT', '/api/cms', { sha: first.sha, cms: first.cms }, cookie));
  assert.equal(res.status, 409, 'Old revision must not overwrite new CMS');
  res = await cms.fetch(request('PUT', '/api/cms', { sha: updated.sha, cms: updated.cms }, cookie, 'https://evil.example.test'));
  assert.equal(res.status, 403, 'Cross-origin editing blocked');
  res = await upload.fetch(request('POST', '/api/upload', { mimeType: 'video/mp4', base64: 'aaaa' }, cookie));
  assert.equal(res.status, 400, 'Direct MP4 uploads forbidden');
  res = await upload.fetch(request('POST', '/api/upload', { mimeType: 'image/png', base64: Buffer.from('fakepng').toString('base64') }, cookie));
  assert.equal(res.status, 200, 'Small images allowed');
  res = await auth.fetch(request('DELETE', '/api/auth', null, cookie));
  assert.equal(res.status, 200, 'Logout clears session');
  console.log('PASS: auth, CMS read/write, preserved empty catalog, revision conflict, CSRF, image upload, logout');
} finally { global.fetch = originalFetch; }
