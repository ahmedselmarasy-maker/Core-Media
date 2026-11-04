import { json, secureCompare, createSessionCookie, expiredCookie, isAuthenticated, checkOrigin } from '../lib/cms-server.mjs';
export default {
  async fetch(request) {
    try {
      if (request.method === 'GET') return json({
        authenticated: isAuthenticated(request),
        loginReady: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD?.length >= 12 && process.env.SESSION_SECRET?.length >= 32),
        githubReady: Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && process.env.GITHUB_BRANCH),
      });
      if (request.method === 'DELETE') return json({ ok: true }, 200, { 'Set-Cookie': expiredCookie(request) });
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
      if (!checkOrigin(request)) return json({ error: 'Origin غير مسموح.' }, 403);
      if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32 || !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) return json({ error: 'إعدادات دخول الإدارة على Vercel غير مكتملة.' }, 503);
      const body = await request.json();
      const valid = secureCompare(body?.username, process.env.ADMIN_USERNAME) && secureCompare(body?.password, process.env.ADMIN_PASSWORD);
      if (!valid) return json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, 401);
      return json({ ok: true }, 200, { 'Set-Cookie': createSessionCookie(request, process.env.ADMIN_USERNAME) });
    } catch (_) { return json({ error: 'تعذر تسجيل الدخول.' }, 400); }
  },
};
