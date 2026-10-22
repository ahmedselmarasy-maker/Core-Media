/* Core Media shared helpers. Validate video links before building an embed. */
(function () {
  "use strict";
  const ID = /^[A-Za-z0-9_-]{11}$/;
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
      return ID.test(id) ? { id, short } : null;
    } catch (_) {
      return null;
    }
  };
  const canonical = (value) => {
    const item = parse(value);
    if (!item) return null;
    return item.short
      ? `https://www.youtube.com/shorts/${item.id}`
      : `https://www.youtube.com/watch?v=${item.id}`;
  };
  const thumbnail = (value) => {
    const item = parse(value);
    return item ? `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg` : "";
  };
  const embed = (value, { autoplay = false, mute = false } = {}) => {
    const item = parse(value);
    if (!item) return "";
    const params = new URLSearchParams({ playsinline: "1", rel: "0" });
    if (autoplay) params.set("autoplay", "1");
    if (mute) params.set("mute", "1");
    return `https://www.youtube-nocookie.com/embed/${item.id}?${params.toString()}`;
  };
  window.cmYouTube = Object.freeze({ parse, canonical, thumbnail, embed });
})();
