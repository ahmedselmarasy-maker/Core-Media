import { randomUUID } from 'node:crypto';
import { json, requireAdmin, writeRepositoryFile } from '../lib/cms-server.mjs';
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
export default {
  async fetch(request) {
    const denied = requireAdmin(request);
    if (denied) return denied;
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    try {
      const { mimeType, base64 } = await request.json();
      if (!ALLOWED[mimeType] || typeof base64 !== 'string') return json({ error: 'مسموح بصور JPG وPNG وWebP فقط. الفيديوهات على يوتيوب.' }, 400);
      if (base64.length > 2_800_000) return json({ error: 'الصورة كبيرة. اضغطها إلى أقل من 2MB.' }, 413);
      const bytes = Buffer.from(base64, 'base64');
      if (!bytes.length || bytes.length > 2_000_000) return json({ error: 'الصورة يجب أن تكون أقل من 2MB.' }, 413);
      const path = `media/${randomUUID()}${ALLOWED[mimeType]}`;
      await writeRepositoryFile(path, bytes, null, 'Upload Core Media image');
      return json({ ok: true, url: `/${path}` });
    } catch (err) { return json({ error: err.message || 'تعذر رفع الصورة.' }, 500); }
  },
};
