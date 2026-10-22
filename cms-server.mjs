import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';

const encoder = new TextEncoder();
const MAX_CMS_BYTES = 2_500_000;

export const json = (data, status = 200, extraHeaders = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
});

const base64url = (v) => Buffer.from(v).toString('base64url');
const hmac = (v) => createHmac('sha256', String(process.env.SESSION_SECRET || '')).update(v).digest('base64url');
const COOKIE = 'coremedia_admin_session';

export function secureCompare(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function createSessionCookie(request, username) {
  const exp = Date.now() + 7 * 24 * 3600 * 1000;
  const payload = base64url(JSON.stringify({ sub: username, exp, nonce: randomUUID() }));
  const token = `${payload}.${hmac(payload)}`;
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=604800${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
export function expiredCookie(request) {
  return `${COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
export function isAuthenticated(request) {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return false;
  const cookies = request.headers.get('cookie') || '';
  const raw = cookies.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const token = raw.slice(COOKIE.length + 1);
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !secureCompare(signature, hmac(payload))) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded.exp > Date.now() && secureCompare(decoded.sub, process.env.ADMIN_USERNAME);
  } catch (_) { return false; }
}
export function checkOrigin(request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
export function requireAdmin(request) {
  if (!isAuthenticated(request)) return json({ error: 'يرجى تسجيل الدخول إلى لوحة التحكم.' }, 401);
  if (!checkOrigin(request)) return json({ error: 'Origin غير مسموح.' }, 403);
  return null;
}
function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH;
  if (!token || !repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo || '') || !branch) {
    throw new Error('يرجى ضبط GITHUB_TOKEN و GITHUB_REPOSITORY و GITHUB_BRANCH في إعدادات Vercel.');
  }
  return { token, repo, branch };
}
async function githubCall(path, method = 'GET', body) {
  const { token, repo, branch } = githubConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'CoreMedia-CMS', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });
  let result;
  try { result = await res.json(); } catch (_) { result = {}; }
  if (!res.ok) {
    const err = new Error(res.status === 404 ? 'ملف البيانات غير موجود في فرع GitHub المحدد.' : `GitHub: ${result.message || res.status}`);
    err.status = res.status;
    throw err;
  }
  return result;
}
export async function readRepositoryFile(path) {
  const file = await githubCall(path);
  if (typeof file.content !== 'string' || !file.sha) throw new Error('استجابة GitHub غير صالحة.');
  const bytes = Buffer.from(file.content.replace(/\s/g, ''), 'base64');
  return { data: bytes, sha: file.sha };
}
export async function writeRepositoryFile(path, bytes, oldSha, message) {
  const { branch } = githubConfig();
  const body = { branch, message, content: Buffer.from(bytes).toString('base64') };
  if (oldSha) body.sha = oldSha;
  const result = await githubCall(path, 'PUT', body);
  return result.content?.sha || null;
}
export const cmsPath = 'data/cms.json';
export function validateCms(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('تنسيق بيانات الموقع غير صالح.');
  if (!Array.isArray(input.brands) || !input.site || typeof input.site !== 'object' || Array.isArray(input.site)) throw new Error('مطلوب brands و site بصيغة صحيحة.');
  if (input.brands.length > 2000) throw new Error('عدد المشروعات تجاوز الحد المسموح.');
  for (const brand of input.brands) {
    if (!brand || typeof brand.id !== 'string' || !brand.id || typeof brand.name !== 'string' || brand.name.length > 300 || !Array.isArray(brand.media) || brand.media.length > 1000) throw new Error('يوجد مشروع ببيانات غير صالحة.');
    for (const media of brand.media) {
      if (!media || typeof media.file !== 'string' || media.file.length > 3000) throw new Error('رابط فيديو أو تصميم غير صالح.');
    }
  }
  const encoded = JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), brands: input.brands, site: input.site }, null, 2) + '\n';
  if (Buffer.byteLength(encoded) > MAX_CMS_BYTES) throw new Error('حجم ملف البيانات تجاوز الحد المسموح.');
  return encoded;
}
