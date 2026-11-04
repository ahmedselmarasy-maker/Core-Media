/* Public, read-only playlist discovery. Configure YOUTUBE_API_KEY on Vercel to use
   YouTube Data API v3. Without it, frontend falls back to the IFrame Player API. */
const ID_RE = /^[A-Za-z0-9_-]{10,100}$/;
const cacheHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: cacheHeaders });

export default {
  async fetch(request) {
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
    const playlistId = new URL(request.url).searchParams.get('id') || '';
    if (!ID_RE.test(playlistId)) return json({ error: 'Invalid playlist ID' }, 400);
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) return json({ error: 'YOUTUBE_API_KEY not configured' }, 503);
    let nextPage = '';
    const videos = [];
    const seen = new Set();
    try {
      for (let page = 0; page < 5; page++) {
        const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        url.searchParams.set('part', 'snippet,contentDetails');
        url.searchParams.set('playlistId', playlistId);
        url.searchParams.set('maxResults', '50');
        url.searchParams.set('key', key);
        if (nextPage) url.searchParams.set('pageToken', nextPage);
        const response = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
        if (!response.ok) return json({ error: `YouTube rejected playlist request (${response.status})` }, 502);
        const data = await response.json();
        for (const item of data.items || []) {
          const id = item?.contentDetails?.videoId || item?.snippet?.resourceId?.videoId;
          const title = String(item?.snippet?.title || '').trim();
          if (/^[A-Za-z0-9_-]{11}$/.test(id) && !seen.has(id) && !['Private video','Deleted video'].includes(title)) {
            seen.add(id); videos.push({ id, title: title || `فيديو ${videos.length + 1}` });
          }
        }
        nextPage = data.nextPageToken || '';
        if (!nextPage) break;
      }
      return json({ videos, playlistId });
    } catch (_) { return json({ error: 'Unable to read YouTube playlist' }, 502); }
  }
};
