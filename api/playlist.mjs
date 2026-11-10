/* Public, read-only playlist discovery.
   Prefer YouTube Data API when configured; otherwise read the public playlist page.
   No media files or private account data are stored by this endpoint. */
const ID_RE = /^[A-Za-z0-9_-]{10,100}$/;
const VIDEO_RE = /^[A-Za-z0-9_-]{11}$/;
const cacheHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=0, s-maxage=1800, stale-while-revalidate=86400',
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: cacheHeaders });

function parseInitialData(html) {
  const marker = 'var ytInitialData = ';
  const markerAt = html.indexOf(marker);
  if (markerAt < 0) throw new Error('YouTube playlist data was not found');
  const start = html.indexOf('{', markerAt + marker.length);
  if (start < 0) throw new Error('YouTube playlist data is incomplete');

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < html.length; i += 1) {
    const char = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return JSON.parse(html.slice(start, i + 1));
    }
  }
  throw new Error('YouTube playlist data could not be parsed');
}

function cleanTitle(value) {
  return String(value || '')
    .replace(/,\\s*No views\\s*-\\s*play Short$/i, '')
    .replace(/\\s*-\\s*play Short$/i, '')
    .trim();
}

function rendererTitle(renderer) {
  const title = renderer?.title;
  if (typeof title?.simpleText === 'string') return cleanTitle(title.simpleText);
  if (Array.isArray(title?.runs)) return cleanTitle(title.runs.map((run) => run?.text || '').join(''));
  return cleanTitle(renderer?.accessibilityText);
}

function collectPlaylistVideos(data, playlistId) {
  const videos = [];
  const seen = new Set();
  const add = (id, title) => {
    if (!VIDEO_RE.test(String(id || '')) || seen.has(id)) return;
    seen.add(id);
    videos.push({ id, title: cleanTitle(title) || `فيديو ${videos.length + 1}` });
  };

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }

    // Current YouTube playlist pages render many Shorts through this model.
    const shorts = node.shortsLockupViewModel;
    if (shorts) {
      const findReel = (value) => {
        if (!value || typeof value !== 'object') return;
        if (Array.isArray(value)) {
          for (const item of value) findReel(item);
          return;
        }
        const endpoint = value.reelWatchEndpoint;
        if (endpoint?.playlistId === playlistId) add(endpoint.videoId, shorts.accessibilityText);
        for (const child of Object.values(value)) findReel(child);
      };
      findReel(shorts);
    }

    // Compatibility with standard video playlist renderers.
    for (const key of ['playlistVideoRenderer', 'playlistPanelVideoRenderer']) {
      const renderer = node[key];
      if (!renderer) continue;
      const endpoint = renderer.navigationEndpoint?.watchEndpoint;
      if (!endpoint?.playlistId || endpoint.playlistId === playlistId) {
        add(renderer.videoId, rendererTitle(renderer));
      }
    }

    for (const child of Object.values(node)) visit(child);
  };

  visit(data);
  return videos.slice(0, 250);
}

async function fromPublicPlaylistPage(playlistId) {
  const response = await fetch(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CoreMediaPortfolio/1.0)',
      'Accept-Language': 'ar,en;q=0.9',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`YouTube playlist page returned ${response.status}`);
  const html = await response.text();
  const data = parseInitialData(html);
  const videos = collectPlaylistVideos(data, playlistId);
  if (!videos.length) throw new Error('No public videos were found in this playlist');
  return videos;
}

async function fromYouTubeApi(playlistId, key) {
  let nextPage = '';
  const videos = [];
  const seen = new Set();
  for (let page = 0; page < 5; page += 1) {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', key);
    if (nextPage) url.searchParams.set('pageToken', nextPage);
    const response = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`YouTube Data API returned ${response.status}`);
    const data = await response.json();
    for (const item of data.items || []) {
      const id = item?.contentDetails?.videoId || item?.snippet?.resourceId?.videoId;
      const title = String(item?.snippet?.title || '').trim();
      if (VIDEO_RE.test(String(id || '')) && !seen.has(id) && !['Private video', 'Deleted video'].includes(title)) {
        seen.add(id);
        videos.push({ id, title: title || `فيديو ${videos.length + 1}` });
      }
    }
    nextPage = data.nextPageToken || '';
    if (!nextPage) break;
  }
  if (!videos.length) throw new Error('No public videos were found in this playlist');
  return videos;
}

export default {
  async fetch(request) {
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
    const playlistId = new URL(request.url).searchParams.get('id') || '';
    if (!ID_RE.test(playlistId)) return json({ error: 'Invalid playlist ID' }, 400);

    try {
      const key = process.env.YOUTUBE_API_KEY;
      let videos;
      if (key) {
        try {
          videos = await fromYouTubeApi(playlistId, key);
        } catch (_) {
          videos = await fromPublicPlaylistPage(playlistId);
        }
      } else {
        videos = await fromPublicPlaylistPage(playlistId);
      }
      return json({ videos, playlistId });
    } catch (error) {
      return json({ error: error?.message || 'Unable to read YouTube playlist' }, 502);
    }
  },
};
