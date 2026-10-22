/* Core Media shared helpers. Validate video links before building an embed. */
(function () {
  "use strict";
  const ID = /^[A-Za-z0-9_-]{11}$/;
  const PLAYLIST_ID = /^[A-Za-z0-9_-]{10,100}$/;
  const allowedHosts = new Set([
    "youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com",
    "youtube-nocookie.com", "www.youtube-nocookie.com", "youtu.be", "www.youtu.be"
  ]);

  const parse = (value) => {
    let input = String(value || "").trim();
    if (!input) return null;
    if (/^(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(input)) input = "https://" + input;
    try {
      const url = new URL(input);
      if (!/^https?:$/.test(url.protocol) || !allowedHosts.has(url.hostname.toLowerCase())) return null;
      const host = url.hostname.toLowerCase();
      const parts = url.pathname.split("/").filter(Boolean);
      // Playlist pages (and videoseries embeds) are playable as one gallery item.
      // Do not treat a playlist URL as an ordinary 11-character video ID.
      const isPlaylistPage = parts[0] === "playlist" ||
        (parts[0] === "embed" && parts[1] === "videoseries") ||
        (parts[0] === "watch" && !url.searchParams.get("v") && url.searchParams.has("list"));
      if (isPlaylistPage) {
        const list = url.searchParams.get("list") || "";
        return PLAYLIST_ID.test(list) ? { id: list, playlistId: list, kind: "playlist", short: false } : null;
      }
      let id = "";
      let short = false;
      if (host === "youtu.be" || host === "www.youtu.be") {
        id = parts[0] || "";
      } else if (parts[0] === "watch") {
        id = url.searchParams.get("v") || "";
      } else if (["shorts", "embed", "live", "v"].includes(parts[0])) {
        id = parts[1] || "";
        short = parts[0] === "shorts";
      }
      return ID.test(id) ? { id, short, kind: "video" } : null;
    } catch (_) {
      return null;
    }
  };
  const canonical = (value) => {
    const item = parse(value);
    if (!item) return null;
    if (item.kind === "playlist") return `https://www.youtube.com/playlist?list=${item.playlistId}`;
    return item.short
      ? `https://www.youtube.com/shorts/${item.id}`
      : `https://www.youtube.com/watch?v=${item.id}`;
  };
  const thumbnail = (value) => {
    const item = parse(value);
    return item && item.kind !== "playlist" ? `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg` : "";
  };
  const embed = (value, { autoplay = false, mute = false } = {}) => {
    const item = parse(value);
    if (!item) return "";
    const params = new URLSearchParams({ playsinline: "1", rel: "0" });
    if (autoplay) params.set("autoplay", "1");
    if (mute) params.set("mute", "1");
    if (item.kind === "playlist") {
      params.set("list", item.playlistId);
      return `https://www.youtube-nocookie.com/embed/videoseries?${params.toString()}`;
    }
    return `https://www.youtube-nocookie.com/embed/${item.id}?${params.toString()}`;
  };
  window.cmYouTube = Object.freeze({ parse, canonical, thumbnail, embed });
})();
