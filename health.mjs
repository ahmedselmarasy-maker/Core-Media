import { json } from '../lib/cms-server.mjs';
export default {
  async fetch(request) {
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
    const loginReady = Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD?.length >= 12 && process.env.SESSION_SECRET?.length >= 32);
    const githubReady = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY && process.env.GITHUB_BRANCH);
    return json({ api: 'ok', loginReady, githubReady });
  },
};
