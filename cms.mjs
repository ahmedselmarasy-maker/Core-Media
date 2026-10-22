import { json, requireAdmin, cmsPath, readRepositoryFile, writeRepositoryFile, validateCms } from '../lib/cms-server.mjs';
export default {
  async fetch(request) {
    const denied = requireAdmin(request);
    if (denied) return denied;
    if (!['GET', 'PUT'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
    try {
      const current = await readRepositoryFile(cmsPath);
      if (request.method === 'GET') return json({ sha: current.sha, cms: JSON.parse(current.data.toString('utf8')) });
      const input = await request.json();
      if (!input || typeof input.sha !== 'string' || !input.sha || !input.cms) return json({ error: 'النسخة الحالية مطلوبة.' }, 400);
      if (input.sha !== current.sha) return json({ error: 'بيانات الموقع اتغيّرت من جلسة تانية. حدّث لوحة التحكم قبل الحفظ.' }, 409);
      const encoded = validateCms(input.cms);
      const sha = await writeRepositoryFile(cmsPath, Buffer.from(encoded), current.sha, 'Update Core Media CMS content');
      return json({ ok: true, sha, cms: JSON.parse(encoded) });
    } catch (err) {
      return json({ error: err.message || 'تعذر تحديث بيانات الموقع.' }, [400, 404, 409, 422].includes(err.status) ? err.status : 500);
    }
  },
};
