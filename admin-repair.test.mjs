import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import auth from '../api/auth.mjs';
import cms from '../api/cms.mjs';
import health from '../api/health.mjs';

const req = (method, path, data, cookie = null) => new Request(`https://coremedia.example.test${path}`, {
  method,
  headers: { ...(cookie ? { cookie } : {}), ...(data ? { 'content-type': 'application/json', origin: 'https://coremedia.example.test' } : {}) },
  ...(data ? { body: JSON.stringify(data) } : {}),
});
const keys = ['SESSION_SECRET','ADMIN_USERNAME','ADMIN_PASSWORD','GITHUB_TOKEN','GITHUB_REPOSITORY','GITHUB_BRANCH'];
const envSaved = Object.fromEntries(keys.map(k=>[k,process.env[k]]));
const originalFetch = global.fetch;
const test = async()=>{
  for (const key of keys) delete process.env[key];
  let r=await health.fetch(req('GET','/api/health'));
  assert.deepEqual(await r.json(), {api:'ok',loginReady:false,githubReady:false});
  r=await auth.fetch(req('POST','/api/auth',{username:'abc',password:'123'}));
  assert.equal(r.status,503);
  process.env.SESSION_SECRET='a_random_secret_at_least_32_bytes_long_for_tests';
  process.env.ADMIN_USERNAME='core-admin-test';
  process.env.ADMIN_PASSWORD='strong-test-password';
  process.env.GITHUB_TOKEN='test-token';
  process.env.GITHUB_REPOSITORY='test/repo';
  process.env.GITHUB_BRANCH='main';
  r=await health.fetch(req('GET','/api/health'));
  assert.deepEqual(await r.json(), {api:'ok',loginReady:true,githubReady:true});
  r=await auth.fetch(req('POST','/api/auth',{username:'core-admin-test',password:'strong-test-password'}));
  assert.equal(r.status,200);
  const cookie=r.headers.get('set-cookie').split(';')[0];
  r=await auth.fetch(req('GET','/api/auth',null,cookie));
  const status=await r.json();assert.equal(status.authenticated,true);
  const fileBytes=Buffer.from(JSON.stringify({site:{hero:{title:'preserved'}},brands:[{id:'old-1',name:'Old project',media:[]}]}));
  const files=new Map([['cms.json',fileBytes]]);
  const sha=(bytes)=>createHash('sha1').update(bytes).digest('hex');
  global.fetch=async (url, options={})=>{
    const path=decodeURIComponent(String(url).match(/\/contents\/([^?]+)/)[1]);
    const method=options.method||'GET';
    if(method==='PUT') {
      const p=JSON.parse(options.body);
      if(files.has(path)) assert.equal(p.sha,sha(files.get(path)));
      if(!files.has(path)) assert.equal(p.sha,undefined);
      const bytes=Buffer.from(p.content,'base64'); files.set(path,bytes);
      return Response.json({content:{sha:sha(bytes)}});
    }
    const bytes=files.get(path);
    return bytes ? Response.json({content:bytes.toString('base64'),sha:sha(bytes)}) : Response.json({message:'Not Found'},{status:404});
  };
  r=await cms.fetch(req('GET','/api/cms',null,cookie));
  assert.equal(r.status,200);
  const orig=await r.json(); assert.equal(orig.cms.brands[0].name,'Old project');
  r=await cms.fetch(req('PUT','/api/cms',{sha:orig.sha,cms:orig.cms},cookie));
  assert.equal(r.status,200);
  assert.equal(files.has('data/cms.json'),true);
  assert.equal(files.has('cms.json'),true);
  r=await cms.fetch(req('GET','/api/cms',null,cookie));
  assert.equal(r.status,200);
  assert.equal((await r.json()).cms.brands[0].name,'Old project');
  console.log('PASS: missing env diagnostics, login cookie, Github CMS root fallback and first-save migration');
};
try {await test()} finally {global.fetch=originalFetch;for(const key of keys){if(envSaved[key]===undefined)delete process.env[key];else process.env[key]=envSaved[key]}}
