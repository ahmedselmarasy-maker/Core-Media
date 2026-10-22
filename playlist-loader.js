/* Core Media: expand an actual YouTube playlist into individual portfolio video cards.
   Preferred: /api/playlist (YouTube Data API when YOUTUBE_API_KEY is configured).
   Key-free fallback: official YouTube IFrame Player API getPlaylist(). */
(function () {
  'use strict';
  const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
  const LIST_ID = /^[A-Za-z0-9_-]{10,100}$/;
  const cache = new Map();
  let iframeApiPromise = null;

  function iframeAPI() {
    if (window.YT && typeof window.YT.Player === 'function') return Promise.resolve(window.YT);
    if (iframeApiPromise) return iframeApiPromise;
    iframeApiPromise = new Promise((resolve, reject) => {
      const priorCallback = window.onYouTubeIframeAPIReady;
      const timeout = window.setTimeout(() => reject(new Error('YouTube Player API timeout')), 16000);
      window.onYouTubeIframeAPIReady = () => {
        window.clearTimeout(timeout);
        if (typeof priorCallback === 'function') priorCallback();
        if (window.YT && typeof window.YT.Player === 'function') resolve(window.YT);
        else reject(new Error('YouTube API not ready'));
      };
      if (!document.querySelector('script[data-cm-youtube-api]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.dataset.cmYoutubeApi = '1';
        script.onerror = () => { window.clearTimeout(timeout); reject(new Error('YouTube API was blocked')); };
        document.head.appendChild(script);
      }
    }).catch(err => { iframeApiPromise = null; throw err; });
    return iframeApiPromise;
  }

  async function fromServer(listId) {
    const response = await fetch(`/api/playlist?id=${encodeURIComponent(listId)}`, { cache: 'default' });
    if (!response.ok) throw new Error(`Playlist API ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.videos)) throw new Error('Invalid playlist response');
    const videos = data.videos.filter(video => VIDEO_ID.test(video?.id)).slice(0, 250);
    if (!videos.length) throw new Error('Playlist contains no accessible videos');
    return videos;
  }

  async function fromIframe(listId) {
    const YT = await iframeAPI();
    return new Promise((resolve, reject) => {
      const holder = document.createElement('div');
      holder.style.cssText = 'position:fixed;left:-5000px;top:0;width:320px;height:180px;pointer-events:none;opacity:0;overflow:hidden;';
      const playerNode = document.createElement('div');
      holder.appendChild(playerNode);
      document.body.appendChild(holder);
      let player;
      let ended = false;
      let interval;
      let timeout;
      const done = (error, videos) => {
        if (ended) return;
        ended = true;
        window.clearInterval(interval);
        window.clearTimeout(timeout);
        try { player?.destroy(); } catch (_) {}
        holder.remove();
        if (error) reject(error);
        else resolve(videos);
      };
      const inspect = () => {
        try {
          const ids = player?.getPlaylist?.();
          if (Array.isArray(ids) && ids.length > 0) {
            const valid = [...new Set(ids.filter(id => VIDEO_ID.test(id)))].slice(0, 250);
            if (valid.length) done(null, valid.map((id, index) => ({ id, title: `فيديو ${index + 1}` })));
          }
        } catch (_) {}
      };
      timeout = window.setTimeout(() => done(new Error('تعذر قراءة فيديوهات قائمة يوتيوب؛ تحقق من الرابط والسماح بالتضمين.')), 22000);
      interval = window.setInterval(inspect, 500);
      try {
        player = new YT.Player(playerNode, {
          width: '320', height: '180',
          playerVars: { autoplay: 0, playsinline: 1, origin: window.location.origin, listType: 'playlist', list: listId },
          events: {
            onReady(event) {
              try { event.target.mute(); event.target.cuePlaylist({ listType: 'playlist', list: listId }); } catch (_) {}
              window.setTimeout(inspect, 700);
            },
            onStateChange: inspect,
            onError(event) { done(new Error(`YouTube refused playlist (${event.data})`)); },
          }
        });
      } catch (error) { done(error); }
    });
  }

  async function getVideos(url) {
    const item = window.cmYouTube?.parse(url);
    if (!item || item.kind !== 'playlist' || !LIST_ID.test(item.playlistId)) throw new Error('Invalid playlist URL');
    const id = item.playlistId;
    if (cache.has(id)) return cache.get(id);
    const promise = (async () => {
      try { return await fromServer(id); }
      catch (_) { return await fromIframe(id); }
    })();
    cache.set(id, promise);
    try { return await promise; }
    catch (error) { cache.delete(id); throw error; }
  }

  function asPortfolioBrands(sourceBrand, sourceMedia, videos) {
    const seen = new Set();
    return videos.filter(video => {
      if (!VIDEO_ID.test(video?.id) || seen.has(video.id)) return false;
      seen.add(video.id);
      return true;
    }).map((video, index) => ({
      id: `${sourceBrand.id}-yt-${video.id}`,
      name: video.title && !/^video\s*\d+$/i.test(video.title) && !/^فيديو\s*\d+$/.test(video.title)
        ? String(video.title) : `${sourceBrand.name} · فيديو ${index + 1}`,
      market: sourceBrand.market,
      egyptCategory: sourceBrand.egyptCategory,
      media: [{ type: 'video', file: `https://www.youtube.com/watch?v=${video.id}`, title: video.title || `فيديو ${index + 1}`, orientation: sourceMedia.orientation || 'auto' }],
      coverUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      sortOrder: (Number(sourceBrand.sortOrder) || 0) + index / 10000,
    }));
  }

  window.cmPlaylistLoader = Object.freeze({ getVideos, asPortfolioBrands });
})();
