/**
 * Always converts uploaded videos to H.264/AAC MP4 for desktop Chrome/Edge.
 * Phone exports (even when uploaded from a laptop) are often HEVC and play audio-only.
 */
let ffmpeg = null;
let loading = null;

const loadFfmpeg = async (onStatus) => {
  if (ffmpeg) return ffmpeg;
  if (loading) return loading;

  loading = (async () => {
    onStatus?.("جاري تحميل محرك التحويل (مرة واحدة)...");
    const { FFmpeg } = await import("https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/+esm");
    const { toBlobURL } = await import("https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/+esm");

    const instance = new FFmpeg();
    const base = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";

    await instance.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpeg = instance;
    return ffmpeg;
  })();

  try {
    return await loading;
  } catch (err) {
    loading = null;
    throw err;
  }
};

const isVideoFile = (file) => {
  if (!file) return false;
  if (String(file.type || "").startsWith("video/")) return true;
  return /\.(mp4|mov|m4v|webm|mkv|avi)$/i.test(String(file.name || ""));
};

/**
 * @param {File} file
 * @param {{ onProgress?: (ratio: number) => void, onStatus?: (msg: string) => void }} [opts]
 * @returns {Promise<File>}
 */
export async function ensureH264Video(file, opts = {}) {
  const { onProgress, onStatus } = opts;
  if (!isVideoFile(file)) return file;

  // Already converted by us in a previous attempt this session
  if (/-web\.mp4$/i.test(String(file.name || "")) && file.type === "video/mp4") {
    return file;
  }

  const { fetchFile } = await import("https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/+esm");
  const ff = await loadFfmpeg(onStatus);

  const progressHandler = ({ progress }) => {
    if (typeof progress === "number") onProgress?.(Math.max(0, Math.min(1, progress)));
  };
  ff.on("progress", progressHandler);

  try {
    onStatus?.("جاري تحويل الفيديو لصيغة متوافقة مع اللاب (H.264)...");
    const name = String(file.name || "video.mp4");
    const inputExt = (name.match(/(\.[^.]+)$/) || [".mp4"])[0].toLowerCase();
    const safeExt = [".mp4", ".mov", ".m4v", ".webm", ".mkv", ".avi"].includes(inputExt)
      ? inputExt
      : ".mp4";
    const inputName = `input${safeExt}`;
    const outputName = "output.mp4";

    await ff.writeFile(inputName, await fetchFile(file));
    await ff.exec([
      "-i",
      inputName,
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ac",
      "2",
      "-movflags",
      "+faststart",
      outputName,
    ]);

    const data = await ff.readFile(outputName);
    try {
      await ff.deleteFile(inputName);
    } catch (_) {}
    try {
      await ff.deleteFile(outputName);
    } catch (_) {}

    const outBase = name.replace(/\.[^.]+$/, "") || "video";
    const bytes = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    const blob = new Blob([bytes], { type: "video/mp4" });
    onProgress?.(1);
    onStatus?.("تم التحويل، جاري الرفع...");
    return new File([blob], `${outBase}-web.mp4`, { type: "video/mp4", lastModified: Date.now() });
  } finally {
    try {
      ff.off("progress", progressHandler);
    } catch (_) {}
  }
}

window.cmEnsureH264Video = ensureH264Video;
