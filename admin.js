document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "cmPortfolioDataV1";
  const SITE_STORAGE_KEY = "cmSiteContentV1";
  const BRAND_TABLE = "cm_brands";
  const SITE_TABLE = "cm_site_settings";
  const ADMIN_TABLE = "cm_admins";
  const DEFAULT_BUCKET = "cm-portfolio";
  const supabaseUrl = window.CM_SUPABASE_URL;
  const supabaseAnonKey = window.CM_SUPABASE_ANON_KEY;
  const bucketName = window.CM_SUPABASE_BUCKET || DEFAULT_BUCKET;
  const loginHintEl = document.getElementById("admin-login-hint");

  const DEFAULT_SITE = {
    hero: {
      badge: "تسويق • محتوى • إعلام",
      highlight: "تجربة تسويق متكاملة",
      subtitle:
        "نساعد العلامات التجارية والشركات الناشئة وصناع المحتوى على بناء منظومات تسويقية قوية، من الاستراتيجية وصناعة المحتوى إلى شراء الإعلانات والإنتاج الإبداعي.",
      ctaPrimary: "احجز مكالمة استراتيجية",
      ctaSecondary: "شاهد أعمالنا",
      metrics: [
        { number: "+50", label: "علامة تجارية" },
        { number: "+200", label: "حملة" },
        { number: "360°", label: "تسويق" },
      ],
      introVideoUrl: "فيديو  الشركة  .mp4",
      introVideoLabel: "Video.Core",
    },
    about: {
      title: "من نحن",
      text: "Core Media هو استوديو تسويق متكامل يجمع الاستراتيجية والإبداع والإعلام في مكان واحد. نتعاون مع العلامات التجارية والشركات الناشئة والأعمال المعتمدة على المحتوى لتصميم حملات تؤثر في الناس وتحقق نتائج ملموسة.",
      pills: [
        "استراتيجية مبنية على البيانات",
        "محتوى يقوده السرد",
        "هوية بصرية قوية",
        "إعلام قائم على الأداء",
      ],
      philosophyTitle: "فلسفتنا",
      philosophyText:
        "كل علامة تجارية لديها قصة أساسية، ومهمتنا تحويلها إلى صور ورسائل وإعلام لا يمكن لجمهورك تجاهله.",
      whoTitle: "من نعمل معه",
      whoText:
        "علامات تجارية راسخة، شركات ناشئة طموحة، وصناع محتوى وأعمال تبحث عن تسويق متكامل وليس منشورات عشوائية.",
    },
    portfolio: {
      title: "أعمالنا",
      subtitle: "نماذج من شراكات النجاح التي بنيناها مع علامات تجارية في مختلف القطاعات.",
    },
    services: {
      title: "الخدمات",
      subtitle: "باقة تسويقية كاملة تحت سقف واحد: استراتيجية ومحتوى وتصميم وإعلام يعملون بتناغم.",
      items: [
        {
          title: "الاستراتيجية التسويقية",
          text: "أبحاث، وتموضع، وخطط تسويق متكاملة مصممة حسب علامتك التجارية وجمهورك وأهدافك.",
          bullets: ["أبحاث السوق والجمهور", "تموضع العلامة التجارية", "استراتيجية الإطلاق والحملات"],
        },
        {
          title: "صناعة المحتوى",
          text: "محتوى يعكس صوت علامتك التجارية ويتحدث بلغة جمهورك عبر مختلف المنصات.",
          bullets: ["محتوى السوشيال والرقمي", "كتابة السكربتات والنصوص", "محتوى تحريري وطويل"],
        },
        {
          title: "الهوية البصرية",
          text: "أنظمة بصرية متسقة ولافتة تجعل علامتك التجارية معروفة من أول نظرة.",
          bullets: ["تصميم الشعار ونظام الهوية", "دليل استخدام العلامة", "حِزم السوشيال والحملات"],
        },
        {
          title: "تخطيط الحملات",
          text: "من الفكرة الكبرى إلى جدول تنفيذ تفصيلي على القنوات الرقمية والتقليدية.",
          bullets: ["تحديد القنوات والميزانيات", "إدارة وتنفيذ الحملات", "تقارير الأداء والتحسين"],
        },
        {
          title: "التصميم والفيديو",
          text: "إنتاج مرئي يخطف الأنظار، من الفيديوهات القصيرة إلى التصاميم الإعلانية عالية الجودة.",
          bullets: ["مونتاج وتحرير الفيديو", "الموشن جرافيكس", "تصوير المنتجات والخدمات"],
        },
        {
          title: "شراء الإعلانات",
          text: "إدارة ميزانياتك الإعلانية بذكاء لضمان الوصول لأفضل جمهور بأقل تكلفة.",
          bullets: ["إعلانات ميتا (فيسبوك وإنستجرام)", "إعلانات جوجل ويوتيوب", "إعلانات تيك توك وسناب شات"],
        },
      ],
    },
    contact: {
      title: "لنبدأ رحلتك التسويقية",
      text: "نحن هنا لمساعدتك في بناء حضور رقمي قوي ومؤثر. تواصل معنا لمناقشة مشروعك القادم.",
      email: "core.media.333@gmail.com",
      whatsappDisplay: "01019132369",
      whatsappE164: "201019132369",
      facebookUrl: "https://www.facebook.com/share/1bM3zcFksr/",
    },
    sectors: {
      markets: [
        { id: "saudi", label: "القطاع السعودي" },
        { id: "egypt", label: "القطاع المصري" },
      ],
      egyptCategories: [
        { id: "restaurants", label: "مطاعم" },
        { id: "cafes", label: "كافيهات" },
        { id: "medical", label: "ميديكل" },
        { id: "other", label: "مشاريع أخرى" },
      ],
    },
  };

  const hasSupabaseConfig =
    supabaseUrl &&
    supabaseAnonKey &&
    !String(supabaseUrl).includes("PASTE_YOUR_SUPABASE_URL_HERE") &&
    !String(supabaseAnonKey).includes("PASTE_YOUR_SUPABASE_ANON_KEY_HERE");

  if (!hasSupabaseConfig && loginHintEl) {
    loginHintEl.textContent =
      "تنبيه: لم يتم إعداد Supabase بعد. افتح ملف supabase-config.js وضع Project URL + anon key.";
  }

  const supabase = hasSupabaseConfig ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

  const loginCard = document.getElementById("admin-login-card");
  const appCard = document.getElementById("admin-app-card");
  const loginForm = document.getElementById("admin-login-form");
  const logoutBtn = document.getElementById("admin-logout-sidebar");
  const globalSearchInput = document.getElementById("global-search");

  const statTotalBrands = document.getElementById("stat-total-brands");
  const statTotalDesigns = document.getElementById("stat-total-designs");
  const statTotalVideos = document.getElementById("stat-total-videos");
  const recentBrandsListEl = document.getElementById("recent-brands-list");
  const navItems = document.querySelectorAll(".cm-nav-item[data-view]");
  const views = document.querySelectorAll(".cm-view");
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.querySelector(".cm-app-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  const brandForm = document.getElementById("brand-form");
  const brandIdInput = document.getElementById("brand-id");
  const brandNameInput = document.getElementById("brand-name");
  const brandMarketInput = document.getElementById("brand-market");
  const brandEgyptCategoryInput = document.getElementById("brand-egypt-category");
  const brandCoverUrlInput = document.getElementById("brand-cover-url");
  const brandCoverUploadInput = document.getElementById("brand-cover-upload");
  const brandCoverPreviewWrap = document.getElementById("brand-cover-preview-wrap");
  const brandCoverPreview = document.getElementById("brand-cover-preview");
  const brandCoverClearBtn = document.getElementById("brand-cover-clear");
  const brandResetBtn = document.getElementById("brand-reset");
  const brandDeleteBtn = document.getElementById("brand-delete");

  const mediaTypeInput = document.getElementById("media-type");
  const mediaTitleInput = document.getElementById("media-title");
  const mediaFileInput = document.getElementById("media-file");
  const mediaUploadInput = document.getElementById("media-upload");
  const addMediaBtn = document.getElementById("add-media");
  const mediaListEl = document.getElementById("media-list");
  const brandListEl = document.getElementById("brand-list");
  const brandSearchInput = document.getElementById("brand-search");
  const uploadProgressEl = document.getElementById("upload-progress");
  const uploadProgressTitleEl = document.getElementById("upload-progress-title");
  const uploadProgressTextEl = document.getElementById("upload-progress-text");
  const uploadProgressFillEl = document.getElementById("upload-progress-fill");
  const cancelUploadBtn = document.getElementById("cancel-upload");

  const heroForm = document.getElementById("hero-form");
  const aboutForm = document.getElementById("about-form");
  const servicesForm = document.getElementById("services-form");
  const contactFormSettings = document.getElementById("contact-form-settings");
  const sectorsForm = document.getElementById("sectors-form");
  const servicesEditor = document.getElementById("services-editor");
  const categoriesEditor = document.getElementById("categories-editor");
  const addServiceBtn = document.getElementById("add-service");
  const addCategoryBtn = document.getElementById("add-category");
  const introVideoUpload = document.getElementById("intro-video-upload");

  let data = [];
  let site = structuredClone(DEFAULT_SITE);
  let activeUploadXhr = null;
  let uploadCancelledByUser = false;

  const escAttr = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");

  const isVideoPath = (path) => /\.(mp4|mov|avi|webm)$/i.test(String(path || "").trim());
  const inferMediaType = (path, fallback = "design") => (isVideoPath(path) ? "video" : fallback);
  const isUuid = (value) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || "").trim()
    );
  const makeLocalId = (name, i) =>
    `brand-${String(name || "item")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")}-${i}`;

  const deepMerge = (base, patch) => {
    if (!patch || typeof patch !== "object") return structuredClone(base);
    const out = structuredClone(base);
    Object.keys(patch).forEach((key) => {
      if (patch[key] && typeof patch[key] === "object" && !Array.isArray(patch[key])) {
        out[key] = deepMerge(out[key] || {}, patch[key]);
      } else if (patch[key] !== undefined) {
        out[key] = patch[key];
      }
    });
    return out;
  };

  const showToast = (message, type = "info") => {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `cm-toast ${type}`;
    const iconName = type === "success" ? "check-circle" : type === "error" ? "alert-circle" : "info";
    toast.innerHTML = `<i data-lucide="${iconName}"></i><span>${escAttr(message)}</span>`;
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const setSidebarOpen = (open) => {
    sidebar?.classList.toggle("active", open);
    sidebarOverlay?.classList.toggle("active", open);
  };

  const switchView = (viewId) => {
    views.forEach((v) => v.classList.remove("active"));
    navItems.forEach((n) => n.classList.remove("active"));
    document.getElementById(`view-${viewId}`)?.classList.add("active");
    document.querySelector(`.cm-nav-item[data-view="${viewId}"]`)?.classList.add("active");
    setSidebarOpen(false);
  };

  navItems.forEach((item) => {
    item.addEventListener("click", () => switchView(item.getAttribute("data-view")));
  });

  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.getAttribute("data-goto")));
  });

  menuToggle?.addEventListener("click", () => setSidebarOpen(!sidebar?.classList.contains("active")));
  sidebarOverlay?.addEventListener("click", () => setSidebarOpen(false));

  const normalizeMediaItem = (m) => ({
    type: m?.type === "video" || isVideoPath(m?.file) ? "video" : "design",
    file: String(m?.file || "").trim(),
    title: String(m?.title || "").trim(),
  });

  const normalizeBrand = (row) => ({
    id: row.id,
    name: row.name,
    market: row.market,
    egyptCategory: row.egypt_category ?? row.egyptCategory ?? null,
    media: (Array.isArray(row.media) ? row.media : []).map(normalizeMediaItem).filter((m) => m.file),
    coverUrl: row.cover_url ?? row.coverUrl ?? "",
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
  });

  const sortBrands = (brands) =>
    [...brands].sort((a, b) => {
      const ao = typeof a.sortOrder === "number" ? a.sortOrder : 0;
      const bo = typeof b.sortOrder === "number" ? b.sortOrder : 0;
      if (ao !== bo) return ao - bo;
      return String(a.name || "").localeCompare(String(b.name || ""), "ar");
    });

  const loadFromDb = async () => {
    if (!supabase) return [];
    const { data: rows, error } = await supabase.from(BRAND_TABLE).select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    return sortBrands((rows || []).map(normalizeBrand));
  };

  const readLocalBackupData = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const upsertBrand = async (brand) => {
    if (!supabase) throw new Error("Supabase not configured");
    const basePayload = {
      id: isUuid(brand.id) ? brand.id : undefined,
      name: brand.name,
      market: brand.market,
      egypt_category:
        brand.market === "egypt"
          ? brand.egyptCategory || getSectors().egyptCategories[0]?.id || "other"
          : null,
      media: Array.isArray(brand.media) ? brand.media.map(normalizeMediaItem) : [],
      sort_order: typeof brand.sortOrder === "number" ? brand.sortOrder : 0,
      updated_at: new Date().toISOString(),
    };

    let { data: row, error } = await supabase
      .from(BRAND_TABLE)
      .upsert({ ...basePayload, cover_url: brand.coverUrl || null })
      .select("*")
      .single();

    // Older DBs without cover_url yet — save without it, then ask admin to migrate
    if (error && /cover_url/i.test(String(error.message || ""))) {
      ({ data: row, error } = await supabase.from(BRAND_TABLE).upsert(basePayload).select("*").single());
      if (!error) {
        showToast(
          "تم الحفظ، لكن غلاف البراند يحتاج تشغيل supabase-migrate.sql في Supabase",
          "info"
        );
      }
    }

    if (error) throw error;
    return normalizeBrand(row);
  };

  const deleteBrand = async (id) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from(BRAND_TABLE).delete().eq("id", id);
    if (error) throw error;
  };

  const loadSiteFromDb = async () => {
    if (!supabase) return null;
    const { data: row, error } = await supabase.from(SITE_TABLE).select("content").eq("id", 1).maybeSingle();
    if (error) throw error;
    if (!row?.content || typeof row.content !== "object") return null;
    return deepMerge(DEFAULT_SITE, row.content);
  };

  const saveSiteToDb = async (nextSite) => {
    if (!supabase) throw new Error("Supabase not configured");
    const payload = {
      id: 1,
      content: nextSite,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from(SITE_TABLE).upsert(payload);
    if (error) throw error;
    try {
      localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(nextSite));
    } catch (_) {}
  };

  const loadSiteLocal = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(SITE_STORAGE_KEY) || "null");
      if (parsed && typeof parsed === "object") return deepMerge(DEFAULT_SITE, parsed);
    } catch (_) {}
    return structuredClone(DEFAULT_SITE);
  };

  const migrateLocalDataToDb = async () => {
    const backup = readLocalBackupData();
    if (!backup.length) return [];
    const migrated = [];
    for (let i = 0; i < backup.length; i += 1) {
      const item = backup[i] || {};
      const saved = await upsertBrand({
        id: item.id || null,
        name: item.name || `Brand ${i + 1}`,
        market: item.market === "saudi" ? "saudi" : "egypt",
        egyptCategory: item.market === "egypt" ? item.egyptCategory || "other" : null,
        media: Array.isArray(item.media) ? item.media : [],
        coverUrl: item.coverUrl || "",
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : i,
      });
      migrated.push(saved);
    }
    return sortBrands(migrated);
  };

  const parseBrandsFromIndexHtml = async () => {
    const res = await fetch("index.html", { cache: "no-store" });
    if (!res.ok) return [];
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const cards = Array.from(doc.querySelectorAll("#portfolio-groups .cm-portfolio-card"));
    return cards.map((card, index) => {
      const market = card.getAttribute("data-market") === "saudi" ? "saudi" : "egypt";
      const name = card.querySelector(".cm-portfolio-info h3")?.textContent?.trim() || `Brand ${index + 1}`;
      const group = card.closest(".cm-portfolio-group");
      const egyptCategory = market === "egypt" ? group?.getAttribute("data-egypt-cat") || "other" : null;
      const media = Array.from(card.querySelectorAll(".cm-tag"))
        .map((tag) => {
          const file = (tag.getAttribute("data-file") || "").trim();
          if (!file) return null;
          const inVideoRow = tag.closest(".cm-portfolio-tags-videos");
          const title = (tag.textContent || "").trim();
          return {
            type: inVideoRow ? "video" : inferMediaType(file, "design"),
            file,
            title: /^(تصميم|فيديو|قاطعة)\s*\d+$/i.test(title) ? "" : title,
          };
        })
        .filter(Boolean);
      return {
        id: makeLocalId(name, index + 1),
        name,
        market,
        egyptCategory,
        media,
        coverUrl: "",
        sortOrder: index,
      };
    });
  };

  const migrateIndexHtmlDataToDb = async () => {
    const parsed = await parseBrandsFromIndexHtml();
    if (!parsed.length) return [];
    const migrated = [];
    for (let i = 0; i < parsed.length; i += 1) {
      migrated.push(await upsertBrand(parsed[i]));
    }
    return sortBrands(migrated);
  };

  const assertIsAdmin = async () => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data: sessionRes } = await supabase.auth.getSession();
    const user = sessionRes?.session?.user;
    if (!user) throw new Error("Not authenticated");
    const { data: adminRow, error } = await supabase
      .from(ADMIN_TABLE)
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!adminRow) {
      throw new Error("هذا المستخدم غير مُصرح له كأدمن. أضف user_id داخل جدول cm_admins في Supabase.");
    }
    return user;
  };

  const ensureAuthUi = async () => {
    if (!(loginCard && appCard)) return;
    if (!supabase) {
      loginCard.classList.remove("hidden");
      appCard.classList.add("hidden");
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const authed = Boolean(sess?.session);
    loginCard.classList.toggle("hidden", authed);
    appCard.classList.toggle("hidden", !authed);
  };

  const uploadToStorage = async (file, folder = "site") => {
    if (!supabase) throw new Error("Supabase not configured");
    if (!file) throw new Error("No file selected");
    const safeName = String(file.name || "file").replace(/[^\w.\-]+/g, "_");
    const ext = safeName.includes(".") ? safeName.split(".").pop() : "";
    const stamp = Date.now();
    const objectPath = `${folder}/${stamp}${ext ? "." + ext : ""}-${safeName}`;

    const { data: sess } = await supabase.auth.getSession();
    const accessToken = sess?.session?.access_token;
    if (!accessToken) throw new Error("Not authenticated");

    const storageUrl = String(supabaseUrl || "").replace(/\/+$/, "");
    const objectUrl = `${storageUrl}/storage/v1/object/${encodeURI(bucketName)}/${objectPath
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      activeUploadXhr = xhr;
      xhr.open("POST", objectUrl, true);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      xhr.setRequestHeader("apikey", String(supabaseAnonKey || ""));
      xhr.setRequestHeader("x-upsert", "false");
      xhr.setRequestHeader("cache-control", "3600");
      if (file.type) xhr.setRequestHeader("content-type", file.type);

      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        const total = evt.total || 0;
        const loaded = evt.loaded || 0;
        const pct = total ? Math.min(100, Math.max(0, (loaded / total) * 100)) : 0;
        if (uploadProgressEl) uploadProgressEl.classList.remove("hidden");
        if (uploadProgressTitleEl) uploadProgressTitleEl.textContent = "جاري رفع الملف...";
        if (uploadProgressFillEl) uploadProgressFillEl.style.width = `${pct.toFixed(2)}%`;
        if (uploadProgressTextEl) {
          const mb = (n) => (n / (1024 * 1024)).toFixed(2);
          uploadProgressTextEl.textContent = `${mb(loaded)} MB / ${mb(total)} MB`;
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) return resolve();
        let msg = `Upload failed (${xhr.status})`;
        try {
          const parsed = JSON.parse(xhr.responseText || "{}");
          msg = parsed?.message || parsed?.error_description || parsed?.error || msg;
        } catch (_) {}
        reject(new Error(msg));
      };
      xhr.onerror = () => reject(new Error("Network error أثناء الرفع"));
      xhr.onabort = () => reject(new Error("تم إلغاء الرفع"));
      xhr.onloadend = () => {
        activeUploadXhr = null;
      };
      xhr.send(file);
    });

    const { data: pub } = supabase.storage.from(bucketName).getPublicUrl(objectPath);
    return { objectPath, publicUrl: pub?.publicUrl || "" };
  };

  const getSectors = () => {
    const sectors = site.sectors || DEFAULT_SITE.sectors;
    const markets = Array.isArray(sectors.markets) && sectors.markets.length
      ? sectors.markets
      : DEFAULT_SITE.sectors.markets;
    const egyptCategories =
      Array.isArray(sectors.egyptCategories) && sectors.egyptCategories.length
        ? sectors.egyptCategories
        : DEFAULT_SITE.sectors.egyptCategories;
    return { markets, egyptCategories };
  };

  const marketLabel = (marketId) => {
    const found = getSectors().markets.find((m) => m.id === marketId);
    if (found?.label) return found.label;
    return marketId === "saudi" ? "القطاع السعودي" : "القطاع المصري";
  };

  const categoryLabel = (catId) => {
    const found = getSectors().egyptCategories.find((c) => c.id === catId);
    return found?.label || catId || "تصنيف";
  };

  const makeCategoryId = (label) => {
    const slug = String(label || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");
    return slug || `cat-${Date.now()}`;
  };

  const populateBrandSelects = () => {
    const { markets, egyptCategories } = getSectors();
    const currentMarket = brandMarketInput.value;
    const currentCat = brandEgyptCategoryInput.value;

    brandMarketInput.innerHTML = markets
      .map((m) => `<option value="${escAttr(m.id)}">${escAttr(m.label)}</option>`)
      .join("");
    if (markets.some((m) => m.id === currentMarket)) brandMarketInput.value = currentMarket;
    else brandMarketInput.value = markets[0]?.id || "egypt";

    brandEgyptCategoryInput.innerHTML = egyptCategories
      .map((c) => `<option value="${escAttr(c.id)}">${escAttr(c.label)}</option>`)
      .join("");
    if (egyptCategories.some((c) => c.id === currentCat)) brandEgyptCategoryInput.value = currentCat;
    else brandEgyptCategoryInput.value = egyptCategories[0]?.id || "other";

    brandEgyptCategoryInput.disabled = brandMarketInput.value !== "egypt";
  };

  const marketText = (brand) => {
    if (brand.market === "saudi") return marketLabel("saudi");
    return `${marketLabel("egypt")} - ${categoryLabel(brand.egyptCategory || "other")}`;
  };

  const mediaLabel = (m, i) => {
    if (m.title) return m.title;
    return m.type === "video" ? `قاطعة ${i + 1}` : `تصميم ${i + 1}`;
  };

  const selectedBrand = () => data.find((b) => b.id === brandIdInput.value) || null;

  const updateCoverPreview = (url) => {
    const src = (url || "").trim();
    if (!src) {
      brandCoverPreviewWrap?.classList.add("hidden");
      if (brandCoverPreview) brandCoverPreview.removeAttribute("src");
      return;
    }
    if (brandCoverPreview) brandCoverPreview.src = src;
    brandCoverPreviewWrap?.classList.remove("hidden");
  };

  const clearForm = () => {
    brandIdInput.value = "";
    brandForm.reset();
    brandEgyptCategoryInput.disabled = brandMarketInput.value !== "egypt";
    mediaListEl.innerHTML = "";
    mediaFileInput.value = "";
    mediaTitleInput.value = "";
    mediaTypeInput.value = "design";
    if (mediaUploadInput) mediaUploadInput.value = "";
    if (brandCoverUploadInput) brandCoverUploadInput.value = "";
    updateCoverPreview("");
    brandDeleteBtn?.classList.add("hidden");
  };

  const updateDashboardStats = () => {
    if (!statTotalBrands) return;
    let totalDesigns = 0;
    let totalVideos = 0;
    data.forEach((brand) => {
      (brand.media || []).forEach((m) => {
        if (m.type === "video") totalVideos += 1;
        else totalDesigns += 1;
      });
    });
    statTotalBrands.textContent = String(data.length);
    statTotalDesigns.textContent = String(totalDesigns);
    statTotalVideos.textContent = String(totalVideos);
    renderRecentActivity();
  };

  const renderRecentActivity = () => {
    if (!recentBrandsListEl) return;
    const recent = [...data].slice(0, 5);
    if (!recent.length) {
      recentBrandsListEl.innerHTML = "<p class='cm-admin-note' style='padding: 1rem;'>لا توجد بيانات حالياً.</p>";
      return;
    }
    recentBrandsListEl.innerHTML = recent
      .map(
        (brand) => `
      <div class="cm-recent-item">
        <div class="cm-recent-info">
          <strong>${escAttr(brand.name)}</strong>
          <div class="cm-admin-brand-meta">${escAttr(marketText(brand))}</div>
        </div>
        <div class="cm-recent-badge">${brand.media?.length || 0} عنصر</div>
      </div>`
      )
      .join("");
  };

  const persistBrandMedia = async (brand) => {
    await assertIsAdmin();
    const saved = await upsertBrand(brand);
    data = sortBrands(data.map((b) => (b.id === saved.id ? saved : b)));
    renderMediaList();
    renderBrandList();
    updateDashboardStats();
    return saved;
  };

  const renderMediaList = () => {
    const brand = selectedBrand();
    mediaListEl.innerHTML = "";
    if (!brand) return;
    const media = Array.isArray(brand.media) ? brand.media : [];
    if (!media.length) {
      mediaListEl.innerHTML = "<p class='cm-admin-note'>لا توجد وسائط لهذا البراند. أضف تصاميم أو قاطعات.</p>";
      return;
    }

    media.forEach((m, i) => {
      const li = document.createElement("li");
      li.className = "cm-media-item";
      const isVideo = m.type === "video";
      const previewHtml = isVideo
        ? `<video src="${escAttr(m.file)}" muted></video><i data-lucide="play-circle" class="cm-media-play-icon"></i>`
        : `<img src="${escAttr(m.file)}" alt="preview" />`;

      li.innerHTML = `
        <div class="cm-media-preview">${previewHtml}</div>
        <div class="cm-media-info">
          <span class="cm-media-badge">${isVideo ? "قاطعة" : "تصميم"}</span>
          <input class="cm-media-title-input" data-index="${i}" value="${escAttr(m.title || "")}" placeholder="${escAttr(mediaLabel(m, i))}" />
          <span class="cm-media-file" title="${escAttr(m.file)}">${escAttr(m.file.split("/").pop())}</span>
        </div>
        <div class="cm-media-actions">
          <button class="cm-icon-btn" type="button" data-move="up" data-index="${i}" title="أعلى"><i data-lucide="arrow-up"></i></button>
          <button class="cm-icon-btn" type="button" data-move="down" data-index="${i}" title="أسفل"><i data-lucide="arrow-down"></i></button>
          <button class="cm-btn cm-btn-outline cm-btn-sm cm-delete-media" type="button" data-index="${i}">
            <i data-lucide="trash-2"></i> <span>حذف</span>
          </button>
        </div>
      `;

      li.querySelector(".cm-media-title-input")?.addEventListener("change", async (e) => {
        brand.media[i].title = e.target.value.trim();
        try {
          await persistBrandMedia(brand);
          showToast("تم تحديث العنوان", "success");
        } catch (err) {
          showToast(err?.message || "تعذر حفظ العنوان.", "error");
        }
      });

      li.querySelectorAll("[data-move]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const idx = Number(btn.getAttribute("data-index"));
          const dir = btn.getAttribute("data-move");
          const swapWith = dir === "up" ? idx - 1 : idx + 1;
          if (swapWith < 0 || swapWith >= brand.media.length) return;
          const tmp = brand.media[idx];
          brand.media[idx] = brand.media[swapWith];
          brand.media[swapWith] = tmp;
          try {
            await persistBrandMedia(brand);
          } catch (err) {
            showToast(err?.message || "تعذر إعادة الترتيب.", "error");
          }
        });
      });

      li.querySelector(".cm-delete-media")?.addEventListener("click", async () => {
        if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
        brand.media.splice(i, 1);
        try {
          await persistBrandMedia(brand);
          showToast("تم حذف العنصر بنجاح", "success");
        } catch (err) {
          showToast(err?.message || "تعذر حفظ التعديل.", "error");
        }
      });

      mediaListEl.appendChild(li);
    });

    if (window.lucide) window.lucide.createIcons();
  };

  const fillBrandForm = (brand) => {
    brandIdInput.value = brand.id;
    brandNameInput.value = brand.name || "";
    brandMarketInput.value = brand.market || "egypt";
    brandEgyptCategoryInput.value = brand.egyptCategory || "other";
    brandEgyptCategoryInput.disabled = brandMarketInput.value !== "egypt";
    brandCoverUrlInput.value = brand.coverUrl || "";
    updateCoverPreview(brand.coverUrl || "");
    brandDeleteBtn?.classList.remove("hidden");
    renderMediaList();
  };

  const renderBrandList = () => {
    brandListEl.innerHTML = "";
    const searchTerm = (brandSearchInput?.value || "").toLowerCase().trim();
    const globalSearchTerm = (globalSearchInput?.value || "").toLowerCase().trim();
    const term = globalSearchTerm || searchTerm;
    const filtered = data.filter(
      (b) => b.name.toLowerCase().includes(term) || marketText(b).toLowerCase().includes(term)
    );

    if (!filtered.length) {
      brandListEl.innerHTML = "<p class='cm-admin-note'>لا توجد نتائج بحث.</p>";
      return;
    }

    filtered.forEach((brand) => {
      const isActive = brandIdInput.value === brand.id;
      const designs = (brand.media || []).filter((m) => m.type !== "video").length;
      const cuts = (brand.media || []).filter((m) => m.type === "video").length;
      const row = document.createElement("div");
      row.className = `cm-admin-brand-item ${isActive ? "active" : ""}`;
      row.innerHTML = `
        <div class="cm-brand-info-mini">
          <strong>${escAttr(brand.name)}</strong>
          <div class="cm-admin-brand-meta">${escAttr(marketText(brand))}</div>
          <div class="cm-admin-brand-meta">${designs} تصميم · ${cuts} قاطعة</div>
        </div>
        <i data-lucide="chevron-left"></i>
      `;
      row.addEventListener("click", () => {
        fillBrandForm(brand);
        document.querySelectorAll(".cm-admin-brand-item").forEach((el) => el.classList.remove("active"));
        row.classList.add("active");
      });
      brandListEl.appendChild(row);
    });
    if (window.lucide) window.lucide.createIcons();
  };

  brandSearchInput?.addEventListener("input", renderBrandList);
  globalSearchInput?.addEventListener("input", () => {
    switchView("brands");
    renderBrandList();
  });

  brandMarketInput.addEventListener("change", () => {
    brandEgyptCategoryInput.disabled = brandMarketInput.value !== "egypt";
  });

  brandCoverUrlInput?.addEventListener("input", () => updateCoverPreview(brandCoverUrlInput.value));
  brandCoverClearBtn?.addEventListener("click", () => {
    brandCoverUrlInput.value = "";
    if (brandCoverUploadInput) brandCoverUploadInput.value = "";
    updateCoverPreview("");
  });

  brandForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = brandNameInput.value.trim();
    if (!name) return;
    const payload = {
      name,
      market: brandMarketInput.value,
      egyptCategory: brandMarketInput.value === "egypt" ? brandEgyptCategoryInput.value : null,
      coverUrl: (brandCoverUrlInput.value || "").trim(),
    };
    const current = selectedBrand();
    (async () => {
      try {
        await assertIsAdmin();
        const coverFile = brandCoverUploadInput?.files?.[0] || null;
        if (coverFile) {
          const folder = current?.id || "covers";
          const { publicUrl } = await uploadToStorage(coverFile, folder);
          payload.coverUrl = publicUrl || payload.coverUrl;
          brandCoverUrlInput.value = payload.coverUrl;
          updateCoverPreview(payload.coverUrl);
          brandCoverUploadInput.value = "";
        }

        if (current) {
          current.name = payload.name;
          current.market = payload.market;
          current.egyptCategory = payload.egyptCategory;
          current.coverUrl = payload.coverUrl;
          current.media = Array.isArray(current.media) ? current.media : [];
          const saved = await upsertBrand(current);
          data = sortBrands(data.map((b) => (b.id === saved.id ? saved : b)));
        } else {
          const saved = await upsertBrand({
            id: null,
            ...payload,
            media: [],
            sortOrder: data.length,
          });
          data = sortBrands([saved, ...data]);
          brandIdInput.value = saved.id;
          brandDeleteBtn?.classList.remove("hidden");
        }
        renderBrandList();
        renderMediaList();
        updateDashboardStats();
        showToast("تم حفظ البراند بنجاح", "success");
      } catch (err) {
        showToast(err?.message || "تعذر حفظ البراند.", "error");
      }
    })();
  });

  addMediaBtn.addEventListener("click", async () => {
    const brand = selectedBrand();
    if (!brand) {
      showToast("احفظ البراند أولاً ثم أضف الوسائط.", "info");
      return;
    }
    try {
      await assertIsAdmin();
      brand.media = Array.isArray(brand.media) ? brand.media : [];
      const files = Array.from(mediaUploadInput?.files || []);
      const typedPath = (mediaFileInput?.value || "").trim();
      const customTitle = (mediaTitleInput?.value || "").trim();
      const selectedType = mediaTypeInput.value || "design";

      const pushItem = (filePath, type, title) => {
        brand.media.push({
          type: type || inferMediaType(filePath, selectedType),
          file: filePath,
          title: title || "",
        });
      };

      if (files.length) {
        uploadCancelledByUser = false;
        addMediaBtn.disabled = true;
        uploadProgressEl?.classList.remove("hidden");
        cancelUploadBtn?.classList.remove("hidden");
        for (let i = 0; i < files.length; i += 1) {
          const file = files[i];
          if (uploadProgressTitleEl) {
            uploadProgressTitleEl.textContent = `جاري رفع الملف ${i + 1} من ${files.length}...`;
          }
          const { publicUrl } = await uploadToStorage(file, brand.id);
          if (!publicUrl) continue;
          const type = selectedType === "video" || isVideoPath(file.name) ? "video" : "design";
          const title = files.length === 1 ? customTitle : "";
          pushItem(publicUrl, type, title);
        }
      } else if (typedPath) {
        pushItem(typedPath, selectedType, customTitle);
      } else {
        showToast("اكتب رابط/مسار أو اختر ملف للرفع.", "info");
        return;
      }

      mediaFileInput.value = "";
      mediaTitleInput.value = "";
      if (mediaUploadInput) mediaUploadInput.value = "";
      await persistBrandMedia(brand);
      showToast("تمت إضافة الوسائط بنجاح", "success");
    } catch (err) {
      showToast(err?.message || "تعذر إضافة الوسائط.", "error");
    } finally {
      addMediaBtn.disabled = false;
      cancelUploadBtn?.classList.add("hidden");
      if (uploadProgressTitleEl) {
        uploadProgressTitleEl.textContent = uploadCancelledByUser ? "تم إلغاء الرفع." : "تم.";
      }
      if (uploadProgressEl) window.setTimeout(() => uploadProgressEl.classList.add("hidden"), 1200);
    }
  });

  cancelUploadBtn?.addEventListener("click", () => {
    if (!activeUploadXhr) return;
    uploadCancelledByUser = true;
    if (uploadProgressTitleEl) uploadProgressTitleEl.textContent = "جاري إلغاء الرفع...";
    activeUploadXhr.abort();
  });

  brandResetBtn.addEventListener("click", clearForm);

  brandDeleteBtn?.addEventListener("click", async () => {
    const brand = selectedBrand();
    if (!brand?.id) return;
    if (!window.confirm(`هل أنت متأكد من حذف براند "${brand.name}"؟`)) return;
    try {
      await assertIsAdmin();
      await deleteBrand(brand.id);
      data = data.filter((b) => b.id !== brand.id);
      showToast("تم حذف البراند بنجاح", "success");
      clearForm();
      renderBrandList();
      updateDashboardStats();
    } catch (err) {
      showToast(err?.message || "تعذر حذف البراند.", "error");
    }
  });

  const fillSiteForms = () => {
    const h = site.hero || {};
    document.getElementById("hero-badge").value = h.badge || "";
    document.getElementById("hero-highlight").value = h.highlight || "";
    document.getElementById("hero-subtitle").value = h.subtitle || "";
    document.getElementById("hero-cta-primary").value = h.ctaPrimary || "";
    document.getElementById("hero-cta-secondary").value = h.ctaSecondary || "";
    const metrics = Array.isArray(h.metrics) ? h.metrics : [];
    for (let i = 0; i < 3; i += 1) {
      document.getElementById(`metric${i + 1}-number`).value = metrics[i]?.number || "";
      document.getElementById(`metric${i + 1}-label`).value = metrics[i]?.label || "";
    }
    document.getElementById("intro-video-label").value = h.introVideoLabel || "";
    document.getElementById("intro-video-url").value = h.introVideoUrl || "";

    const a = site.about || {};
    document.getElementById("about-title").value = a.title || "";
    document.getElementById("about-text").value = a.text || "";
    document.getElementById("about-pills").value = (a.pills || []).join("\n");
    document.getElementById("about-philosophy-title").value = a.philosophyTitle || "";
    document.getElementById("about-philosophy-text").value = a.philosophyText || "";
    document.getElementById("about-who-title").value = a.whoTitle || "";
    document.getElementById("about-who-text").value = a.whoText || "";
    document.getElementById("portfolio-title").value = site.portfolio?.title || "";
    document.getElementById("portfolio-subtitle").value = site.portfolio?.subtitle || "";

    document.getElementById("services-title").value = site.services?.title || "";
    document.getElementById("services-subtitle").value = site.services?.subtitle || "";
    renderServicesEditor();

    const { markets } = getSectors();
    document.getElementById("market-saudi-label").value =
      markets.find((m) => m.id === "saudi")?.label || "القطاع السعودي";
    document.getElementById("market-egypt-label").value =
      markets.find((m) => m.id === "egypt")?.label || "القطاع المصري";
    renderCategoriesEditor();
    populateBrandSelects();

    const c = site.contact || {};
    document.getElementById("contact-title").value = c.title || "";
    document.getElementById("contact-text").value = c.text || "";
    document.getElementById("contact-email").value = c.email || "";
    document.getElementById("contact-whatsapp-display").value = c.whatsappDisplay || "";
    document.getElementById("contact-whatsapp-e164").value = c.whatsappE164 || "";
    document.getElementById("contact-facebook").value = c.facebookUrl || "";
  };

  const renderCategoriesEditor = () => {
    if (!categoriesEditor) return;
    const cats = getSectors().egyptCategories;
    categoriesEditor.innerHTML = cats
      .map(
        (item, i) => `
      <div class="cm-service-editor-item" data-index="${i}">
        <div class="cm-service-editor-head">
          <strong>تصنيف ${i + 1}</strong>
          <div class="cm-media-actions" style="padding:0;">
            <button type="button" class="cm-icon-btn" data-move="up" data-index="${i}" title="أعلى"><i data-lucide="arrow-up"></i></button>
            <button type="button" class="cm-icon-btn" data-move="down" data-index="${i}" title="أسفل"><i data-lucide="arrow-down"></i></button>
            <button type="button" class="cm-btn cm-btn-outline cm-btn-sm cm-remove-category" data-index="${i}">
              <i data-lucide="trash-2"></i> حذف
            </button>
          </div>
        </div>
        <div class="cm-form-group">
          <label>الاسم الظاهر</label>
          <input data-field="label" value="${escAttr(item.label || "")}" placeholder="مثلاً: مطاعم" />
        </div>
        <div class="cm-form-group">
          <label>المعرّف الداخلي</label>
          <input data-field="id" value="${escAttr(item.id || "")}" readonly />
        </div>
      </div>`
      )
      .join("");

    categoriesEditor.querySelectorAll(".cm-remove-category").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-index"));
        const list = collectCategoriesFromEditor();
        if (list.length <= 1) {
          showToast("لازم يبقى تصنيف واحد على الأقل.", "info");
          return;
        }
        const removed = list[idx];
        const fallback = list.find((_, i) => i !== idx)?.id;
        if (!window.confirm(`حذف تصنيف "${removed.label}"؟ البراندات التابعة هتتنقل لتصنيف آخر.`)) return;
        data.forEach((brand) => {
          if (brand.market === "egypt" && brand.egyptCategory === removed.id) {
            brand.egyptCategory = fallback;
          }
        });
        list.splice(idx, 1);
        site.sectors = { ...getSectors(), egyptCategories: list };
        renderCategoriesEditor();
        populateBrandSelects();
      });
    });

    categoriesEditor.querySelectorAll("[data-move]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-index"));
        const dir = btn.getAttribute("data-move");
        const list = collectCategoriesFromEditor();
        const swapWith = dir === "up" ? idx - 1 : idx + 1;
        if (swapWith < 0 || swapWith >= list.length) return;
        const tmp = list[idx];
        list[idx] = list[swapWith];
        list[swapWith] = tmp;
        site.sectors = { ...getSectors(), egyptCategories: list };
        renderCategoriesEditor();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  };

  const collectCategoriesFromEditor = () => {
    const items = [];
    categoriesEditor?.querySelectorAll(".cm-service-editor-item").forEach((el) => {
      const label = el.querySelector('[data-field="label"]')?.value?.trim() || "";
      const id = el.querySelector('[data-field="id"]')?.value?.trim() || makeCategoryId(label);
      if (!label) return;
      items.push({ id, label });
    });
    return items.length ? items : DEFAULT_SITE.sectors.egyptCategories;
  };

  const renderServicesEditor = () => {
    if (!servicesEditor) return;
    const items = Array.isArray(site.services?.items) ? site.services.items : [];
    servicesEditor.innerHTML = items
      .map(
        (item, i) => `
      <div class="cm-service-editor-item" data-index="${i}">
        <div class="cm-service-editor-head">
          <strong>خدمة ${i + 1}</strong>
          <button type="button" class="cm-btn cm-btn-outline cm-btn-sm cm-remove-service" data-index="${i}">
            <i data-lucide="trash-2"></i> حذف
          </button>
        </div>
        <div class="cm-form-group">
          <label>العنوان</label>
          <input data-field="title" value="${escAttr(item.title || "")}" />
        </div>
        <div class="cm-form-group">
          <label>الوصف</label>
          <textarea data-field="text" rows="2">${escAttr(item.text || "")}</textarea>
        </div>
        <div class="cm-form-group">
          <label>النقاط (كل سطر نقطة)</label>
          <textarea data-field="bullets" rows="3">${escAttr((item.bullets || []).join("\n"))}</textarea>
        </div>
      </div>`
      )
      .join("");

    servicesEditor.querySelectorAll(".cm-remove-service").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-index"));
        site.services.items.splice(idx, 1);
        renderServicesEditor();
      });
    });
    if (window.lucide) window.lucide.createIcons();
  };

  const collectServicesFromEditor = () => {
    const items = [];
    servicesEditor?.querySelectorAll(".cm-service-editor-item").forEach((el) => {
      items.push({
        title: el.querySelector('[data-field="title"]')?.value?.trim() || "",
        text: el.querySelector('[data-field="text"]')?.value?.trim() || "",
        bullets: String(el.querySelector('[data-field="bullets"]')?.value || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    });
    return items;
  };

  addServiceBtn?.addEventListener("click", () => {
    if (!site.services) site.services = { title: "", subtitle: "", items: [] };
    if (!Array.isArray(site.services.items)) site.services.items = [];
    site.services.items.push({ title: "خدمة جديدة", text: "", bullets: [] });
    renderServicesEditor();
  });

  addCategoryBtn?.addEventListener("click", () => {
    const list = collectCategoriesFromEditor();
    const label = `تصنيف ${list.length + 1}`;
    list.push({ id: makeCategoryId(`cat-${Date.now()}`), label });
    site.sectors = { ...getSectors(), egyptCategories: list };
    renderCategoriesEditor();
  });

  const persistSite = async (message = "تم حفظ المحتوى") => {
    await assertIsAdmin();
    await saveSiteToDb(site);
    showToast(message, "success");
  };

  sectorsForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const egyptCategories = collectCategoriesFromEditor();
      const saudiLabel =
        document.getElementById("market-saudi-label")?.value?.trim() || "القطاع السعودي";
      const egyptLabel =
        document.getElementById("market-egypt-label")?.value?.trim() || "القطاع المصري";
      site.sectors = {
        markets: [
          { id: "saudi", label: saudiLabel },
          { id: "egypt", label: egyptLabel },
        ],
        egyptCategories,
      };

      // Persist remapped brand categories if any were moved during delete
      for (const brand of data) {
        if (brand.market !== "egypt") continue;
        if (!egyptCategories.some((c) => c.id === brand.egyptCategory)) {
          brand.egyptCategory = egyptCategories[0]?.id || "other";
          await upsertBrand(brand);
        }
      }

      await persistSite("تم حفظ القطاعات والتصنيفات");
      populateBrandSelects();
      renderBrandList();
      updateDashboardStats();
    } catch (err) {
      showToast(err?.message || "تعذر حفظ القطاعات.", "error");
    }
  });

  heroForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      let introUrl = document.getElementById("intro-video-url").value.trim();
      const file = introVideoUpload?.files?.[0] || null;
      if (file) {
        uploadProgressEl?.classList.remove("hidden");
        const { publicUrl } = await uploadToStorage(file, "intro");
        introUrl = publicUrl || introUrl;
        document.getElementById("intro-video-url").value = introUrl;
        introVideoUpload.value = "";
        uploadProgressEl?.classList.add("hidden");
      }
      site.hero = {
        ...site.hero,
        badge: document.getElementById("hero-badge").value.trim(),
        highlight: document.getElementById("hero-highlight").value.trim(),
        subtitle: document.getElementById("hero-subtitle").value.trim(),
        ctaPrimary: document.getElementById("hero-cta-primary").value.trim(),
        ctaSecondary: document.getElementById("hero-cta-secondary").value.trim(),
        metrics: [1, 2, 3].map((i) => ({
          number: document.getElementById(`metric${i}-number`).value.trim(),
          label: document.getElementById(`metric${i}-label`).value.trim(),
        })),
        introVideoUrl: introUrl,
        introVideoLabel: document.getElementById("intro-video-label").value.trim(),
      };
      await persistSite("تم حفظ الصفحة الرئيسية");
    } catch (err) {
      showToast(err?.message || "تعذر الحفظ.", "error");
      uploadProgressEl?.classList.add("hidden");
    }
  });

  aboutForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      site.about = {
        title: document.getElementById("about-title").value.trim(),
        text: document.getElementById("about-text").value.trim(),
        pills: document
          .getElementById("about-pills")
          .value.split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        philosophyTitle: document.getElementById("about-philosophy-title").value.trim(),
        philosophyText: document.getElementById("about-philosophy-text").value.trim(),
        whoTitle: document.getElementById("about-who-title").value.trim(),
        whoText: document.getElementById("about-who-text").value.trim(),
      };
      site.portfolio = {
        title: document.getElementById("portfolio-title").value.trim(),
        subtitle: document.getElementById("portfolio-subtitle").value.trim(),
      };
      await persistSite("تم حفظ قسم من نحن");
    } catch (err) {
      showToast(err?.message || "تعذر الحفظ.", "error");
    }
  });

  servicesForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      site.services = {
        title: document.getElementById("services-title").value.trim(),
        subtitle: document.getElementById("services-subtitle").value.trim(),
        items: collectServicesFromEditor(),
      };
      await persistSite("تم حفظ الخدمات");
    } catch (err) {
      showToast(err?.message || "تعذر الحفظ.", "error");
    }
  });

  contactFormSettings?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      site.contact = {
        title: document.getElementById("contact-title").value.trim(),
        text: document.getElementById("contact-text").value.trim(),
        email: document.getElementById("contact-email").value.trim(),
        whatsappDisplay: document.getElementById("contact-whatsapp-display").value.trim(),
        whatsappE164: document.getElementById("contact-whatsapp-e164").value.trim().replace(/\D/g, ""),
        facebookUrl: document.getElementById("contact-facebook").value.trim(),
      };
      await persistSite("تم حفظ إعدادات التواصل");
    } catch (err) {
      showToast(err?.message || "تعذر الحفظ.", "error");
    }
  });

  const bootstrapAdminData = async () => {
    data = await loadFromDb();
    if (!data.length) data = await migrateLocalDataToDb();
    if (!data.length) data = await migrateIndexHtmlDataToDb();

    try {
      const fromDb = await loadSiteFromDb();
      site = fromDb || loadSiteLocal();
      if (!fromDb) await saveSiteToDb(site);
    } catch (_) {
      site = loadSiteLocal();
    }

    renderBrandList();
    updateDashboardStats();
    fillSiteForms();
    clearForm();
  };

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    (async () => {
      try {
        if (!supabase) {
          window.alert("Supabase غير مُعد. حدّث supabase-config.js أولاً.");
          return;
        }
        const email = document.getElementById("admin-email")?.value?.trim() || "";
        const password = document.getElementById("admin-pass")?.value || "";
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await ensureAuthUi();
        await assertIsAdmin();
        await bootstrapAdminData();
        showToast("مرحباً بك مجدداً!", "success");
      } catch (err) {
        showToast(err?.message || "تعذر تسجيل الدخول.", "error");
      }
    })();
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      if (supabase) await supabase.auth.signOut();
    } finally {
      window.location.reload();
    }
  });

  (async () => {
    await ensureAuthUi();
    if (!supabase) return;
    try {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess?.session) return;
      await assertIsAdmin();
      await bootstrapAdminData();
    } catch (err) {
      if (loginHintEl) loginHintEl.textContent = err?.message || "";
      loginCard?.classList.remove("hidden");
      appCard?.classList.add("hidden");
    }
  })();
});
