document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "cmPortfolioDataV2";
  const SITE_STORAGE_KEY = "cmSiteContentV1";
  const loginHintEl = document.getElementById("admin-login-hint");

  // Never resurrect the deleted, Git LFS-hosted default company video.
  // This only filters that exact legacy filename; YouTube and other uploads still work.
  const cleanIntroVideoUrl = (value) => {
    const url = String(value || "").trim();
    let decoded = url;
    try { decoded = decodeURIComponent(url); } catch (_) {}
    const baseName = decoded.split(/[?#]/)[0].split(/[\\/]/).pop()
      .replace(/\s+/g, "").toLocaleLowerCase();
    return baseName === "فيديوالشركة.mp4" ? "" : url;
  };

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
      introVideoUrl: "",
      introVideoLabel: "Video.Core",
      quote: "“بنحوّل أفكارك لمحتوى يلفت النظر ويسيب أثر.”",
      quoteCaption: "إبداع في كل تفصيلة.. ونتائج تصنع الفرق.",
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
      guide: {
        eyebrow: "BEYOND CONTENT",
        heading: "اختار مجالك،",
        highlight: "واكتشف شغلنا فيه.",
        description: "كل مجال ليه قصته. اختار القسم المناسب لنشاطك وشوف أعمال Core Media المصممة لقطاعك.",
        linksLabel: "أو تعرّف علينا أكثر",
        accentColor: "#e4911f",
        backgroundColor: "#061523",
      },
      projectCategories: {},
      egyptCategories: [
        { id: "restaurants", label: "مطاعم", enLabel: "Restaurants", icon: "restaurants" },
        { id: "cafes", label: "كافيهات", enLabel: "Cafés", icon: "cafes" },
        { id: "medical", label: "طبي", enLabel: "Medical", icon: "medical" },
        { id: "education", label: "تعليم ومدرسين", enLabel: "Education", icon: "education" },
        { id: "other", label: "مشاريع أخرى", enLabel: "Other Projects", icon: "other" },
      ],
    },
  };

  // CMS saves to GitHub through secured Vercel functions. No Supabase client.
  const fetchCmsApi = async (path, options = {}) => {
    let response;
    try {
      response = await fetch(path, { credentials: "same-origin", cache: "no-store", ...options });
    } catch (_) {
      throw new Error("تعذر الاتصال بخدمة لوحة التحكم. افتح الموقع عبر رابط Vercel الأساسي وتحقق من الاتصال.");
    }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 404 && !result.error) {
        throw new Error(`خدمة ${path} غير موجودة (404). تأكد أن ملفات api مرفوعة داخل مجلد api على فرع main ثم أعد النشر.`);
      }
      if (response.status === 503 && !result.error) {
        throw new Error("خدمة الإدارة غير جاهزة (503). راجع Environment Variables في Vercel لبيئة Production.");
      }
      if (response.status >= 500 && !result.error) {
        throw new Error(`خطأ من خادم لوحة التحكم (${response.status}). راجع Vercel Functions Logs.`);
      }
      throw new Error(result.error || `خطأ HTTP ${response.status} في ${path}`);
    }
    if (response.headers.get("content-type")?.includes("text/html") || !response.headers.get("content-type")?.includes("json")) {
      throw new Error(`رد غير صحيح من ${path}: غالبًا تم توجيه API إلى صفحة الموقع. راجع مجلد api وإعدادات Vercel.`);
    }
    return result;
  };
  let cmsSha = null;
  if (loginHintEl) loginHintEl.textContent = "الإدارة محفوظة في GitHub عبر Vercel — بدون Supabase.";

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
  const mediaOrientationInput = document.getElementById("media-orientation");
  const mediaOrientationGroup = document.getElementById("media-orientation-group");
  const mediaTitleInput = document.getElementById("media-title");
  const mediaFileInput = document.getElementById("media-file");
  const mediaUploadInput = document.getElementById("media-upload");
  const addMediaBtn = document.getElementById("add-media");
  const mediaListEl = document.getElementById("media-list");
  const cleanupStorageOrphansBtn = document.getElementById("cleanup-storage-orphans");
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
  const assignCategorySelect = document.getElementById("assign-category");
  const assignSearchInput = document.getElementById("assign-search");
  const projectChecklist = document.getElementById("category-project-checklist");
  const assignStatus = document.getElementById("assign-status");
  const saveCategoryProjectsBtn = document.getElementById("save-category-projects");

  const CATEGORY_ICONS = [
    ["restaurants", "مطاعم"], ["cafes", "كافيهات"], ["medical", "طبي"],
    ["education", "تعليم"], ["other", "نجوم / عام"], ["beauty", "تجميل"],
    ["retail", "متاجر"], ["realestate", "عقارات"], ["fitness", "رياضة"],
    ["tech", "تقنية"], ["cars", "سيارات"], ["law", "قانون"],
    ["events", "فعاليات"], ["hotel", "فنادق"],
  ];

  let data = [];
  let site = structuredClone(DEFAULT_SITE);
  let activeUploadXhr = null;
  let uploadCancelledByUser = false;

  const escAttr = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");

  const isYouTubeUrl = (value) => Boolean(window.cmYouTube?.parse(value));
  const isVideoPath = (path) => isYouTubeUrl(path) || /\.(mp4|mov|avi|webm)(?:[?#].*)?$/i.test(String(path || "").trim());
  const cleanVideoLink = (value) => window.cmYouTube?.canonical(value) || String(value || "").trim();
  const mediaOrientation = (value) => ["auto", "portrait", "landscape"].includes(value) ? value : "auto";
  const updateMediaOrientationVisibility = () => {
    mediaOrientationGroup?.classList.toggle("hidden", mediaTypeInput.value !== "video");
  };
  mediaTypeInput?.addEventListener("change", updateMediaOrientationVisibility);
  updateMediaOrientationVisibility();
  const inferMediaType = (path, fallback = "design") => (isVideoPath(path) ? "video" : fallback);
  const isUuid = (value) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || "").trim()
    );
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
    orientation: mediaOrientation(m?.orientation),
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

  // One atomic JSON document stores BOTH project changes and site settings.
  // A GitHub blob SHA guards against overwriting newer edits from another admin session.
  const savePortfolioCache = (brands) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sortBrands(Array.isArray(brands) ? brands : []))); } catch (_) {}
  };
  const loadCms = async () => {
    const result = await fetchCmsApi("/api/cms");
    cmsSha = result.sha;
    const doc = result.cms;
    data = sortBrands((Array.isArray(doc?.brands) ? doc.brands : []).map(normalizeBrand));
    site = deepMerge(structuredClone(DEFAULT_SITE), doc?.site && typeof doc.site === "object" ? doc.site : {});
    savePortfolioCache(data);
  };
  const writeCms = async (brands = data, settings = site) => {
    if (!cmsSha) throw new Error("البيانات غير جاهزة؛ سجّل دخولك مجددًا.");
    const result = await fetchCmsApi("/api/cms", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: cmsSha, cms: { brands, site: settings } }),
    });
    cmsSha = result.sha;
    savePortfolioCache(brands);
    return result;
  };
  const upsertBrand = async (brand) => {
    const saved = normalizeBrand({
      id: brand.id || crypto.randomUUID(),
      name: brand.name, market: brand.market, egypt_category: brand.egyptCategory || "other",
      media: Array.isArray(brand.media) ? brand.media.map(normalizeMediaItem) : [],
      cover_url: brand.coverUrl || "",
      sort_order: Number.isFinite(brand.sortOrder) ? brand.sortOrder : 0,
    });
    const next = data.some((item) => item.id === saved.id)
      ? data.map((item) => item.id === saved.id ? saved : item)
      : [...data, saved];
    await writeCms(sortBrands(next), site);
    return saved;
  };
  const removeUnreferencedStorageObjects = async () => ({ deletedCount: 0, failedCount: 0, skippedCount: 0 });
  const deleteBrand = async (id) => {
    const next = data.filter((item) => item.id !== id);
    if (next.length === data.length) throw new Error("المشروع غير موجود.");
    await writeCms(next, site);
    // Media files are never deleted implicitly; they might be referenced by another project.
    return { deletedCount: 0, failedCount: 0, skippedCount: 0 };
  };
  const loadFromDb = async () => { await loadCms(); return data; };
  const loadSiteFromDb = async () => site;
  const saveSiteToDb = async (nextSite) => { await writeCms(data, nextSite); };
  const assertIsAdmin = async () => {
    const result = await fetchCmsApi("/api/auth");
    if (!result.authenticated) throw new Error("يرجى تسجيل الدخول إلى لوحة التحكم.");
    return result;
  };
  const ensureAuthUi = async () => {
    if (!(loginCard && appCard)) return;
    let authenticated = false;
    try {
      const state = await fetchCmsApi("/api/auth");
      authenticated = Boolean(state.authenticated);
      if (!authenticated && loginHintEl) {
        if (state.loginReady === false) {
          loginHintEl.textContent = "بيانات الدخول غير مضبوطة على Vercel Production: ADMIN_USERNAME وADMIN_PASSWORD وSESSION_SECRET.";
        } else if (state.githubReady === false) {
          loginHintEl.textContent = "ربط GitHub غير مكتمل على Vercel Production: GITHUB_TOKEN وGITHUB_REPOSITORY وGITHUB_BRANCH.";
        } else {
          loginHintEl.textContent = "اكتب اسم المستخدم وكلمة المرور المحددين في Vercel Production.";
        }
      }
    } catch (err) {
      if (loginHintEl) loginHintEl.textContent = err?.message || "تعذر الاتصال بخدمة الإدارة.";
    }
    loginCard.classList.toggle("hidden", authenticated);
    appCard.classList.toggle("hidden", !authenticated);
  };
  const prepareUploadFile = async (file) => {
    if (file && !String(file.type || "").startsWith("image/")) throw new Error("رفع الفيديوهات يكون على YouTube؛ ألصق الرابط في لوحة التحكم.");
    return file;
  };
  const uploadToStorage = async (file) => {
    await assertIsAdmin();
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("مسموح رفع صور JPG وPNG وWebP فقط. الفيديوهات تُرفع إلى يوتيوب.");
    if (file.size > 2_000_000) throw new Error("اضغط الصورة لتكون أقل من 2MB ثم حاول مرة أخرى.");
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
      reader.onerror = () => reject(new Error("تعذرت قراءة الصورة."));
      reader.readAsDataURL(file);
    });
    const result = await fetchCmsApi("/api/upload", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mimeType: file.type, base64 }),
    });
    return { objectPath: result.url.slice(1), publicUrl: result.url };
  };

  const getSectors = () => {
    const sectors = site.sectors || DEFAULT_SITE.sectors;
    const markets = Array.isArray(sectors.markets) && sectors.markets.length
      ? sectors.markets
      : DEFAULT_SITE.sectors.markets;
    const defaultEnLabels = Object.fromEntries(
      DEFAULT_SITE.sectors.egyptCategories.map((item) => [item.id, item.enLabel])
    );
    const egyptCategories =
      Array.isArray(sectors.egyptCategories) && sectors.egyptCategories.length
        ? sectors.egyptCategories.map((item) => ({
            ...item,
            label: (item.id === "medical" && ["ميديكل", "ميديكال"].includes(String(item.label || "").trim()))
              ? "طبي" : item.label,
            enLabel: String(item.enLabel ?? defaultEnLabels[item.id] ?? ""),
          }))
        : DEFAULT_SITE.sectors.egyptCategories.map((item) => ({ ...item }));
    // Upgrade only the original four default categories, preserving custom category lists.
    if (egyptCategories.map((c) => c.id).join(",") === "restaurants,cafes,medical,other") {
      egyptCategories.splice(3, 0, { id: "education", label: "تعليم ومدرسين", enLabel: "Education" });
    }
    return { ...sectors, markets, egyptCategories,
      projectCategories: sectors.projectCategories && typeof sectors.projectCategories === "object" && !Array.isArray(sectors.projectCategories)
        ? sectors.projectCategories : {},
      guide: { ...DEFAULT_SITE.sectors.guide, ...(sectors.guide || {}) },
    };
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

    brandEgyptCategoryInput.disabled = false;
  };

  const assignedCategoriesFor = (brand) => {
    const saved = getSectors().projectCategories;
    // The map is the source of truth for new multi-category assignments.
    if (Object.prototype.hasOwnProperty.call(saved, brand.id) && Array.isArray(saved[brand.id])) {
      return saved[brand.id];
    }
    return [brand.egyptCategory || "other"];
  };

  const marketText = (brand) => {
    const labels = assignedCategoriesFor(brand).map(categoryLabel).join("، ") || "بدون قسم";
    return `${marketLabel(brand.market)} - ${labels}`;
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
    brandEgyptCategoryInput.disabled = false;
    mediaListEl.innerHTML = "";
    mediaFileInput.value = "";
    mediaTitleInput.value = "";
    mediaTypeInput.value = "design";
    if (mediaOrientationInput) mediaOrientationInput.value = "auto";
    updateMediaOrientationVisibility();
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
      const youtubeVideo = window.cmYouTube?.parse(m.file);
      const previewHtml = youtubeVideo
        ? youtubeVideo.kind === "playlist"
          ? `<span class="cm-admin-playlist-thumb">▶ قائمة يوتيوب</span>`
          : `<img src="${escAttr(window.cmYouTube.thumbnail(m.file))}" alt="معاينة يوتيوب" loading="lazy" /><i data-lucide="play-circle" class="cm-media-play-icon"></i>`
        : isVideo
          ? `<video src="${escAttr(m.file)}" muted preload="metadata"></video><i data-lucide="play-circle" class="cm-media-play-icon"></i>`
          : `<img src="${escAttr(m.file)}" alt="preview" />`;

      li.innerHTML = `
        <div class="cm-media-preview">${previewHtml}</div>
        <div class="cm-media-info">
          <span class="cm-media-badge">${isVideo ? "قاطعة" : "تصميم"}</span>
          <input class="cm-media-title-input" data-index="${i}" value="${escAttr(m.title || "")}" placeholder="${escAttr(mediaLabel(m, i))}" />
          <span class="cm-media-file" title="${escAttr(m.file)}">${escAttr(youtubeVideo ? `${youtubeVideo.kind === "playlist" ? "YouTube Playlist" : "YouTube"} · ${youtubeVideo.id}` : m.file.split("/").pop())}</span>
          ${isVideo ? `<div class="cm-media-video-controls">
            <label>اتجاه الفيديو
              <select class="cm-media-orientation-select" data-index="${i}">
                <option value="auto" ${mediaOrientation(m.orientation) === "auto" ? "selected" : ""}>تلقائي</option>
                <option value="portrait" ${mediaOrientation(m.orientation) === "portrait" ? "selected" : ""}>رأسي 9:16</option>
                <option value="landscape" ${mediaOrientation(m.orientation) === "landscape" ? "selected" : ""}>أفقي 16:9</option>
              </select>
            </label>
            <label>استبدل هذا الفيديو برابط YouTube
              <input class="cm-media-replacement-input" dir="ltr" type="text" placeholder="https://youtube.com/playlist?list=..." />
            </label>
            <button class="cm-btn cm-btn-outline cm-btn-sm cm-replace-youtube" type="button">حفظ رابط يوتيوب بدل الفيديو</button>
          </div>` : ""}
        </div>
        <div class="cm-media-actions">
          <button class="cm-icon-btn" type="button" data-move="up" data-index="${i}" title="أعلى"><i data-lucide="arrow-up"></i></button>
          <button class="cm-icon-btn" type="button" data-move="down" data-index="${i}" title="أسفل"><i data-lucide="arrow-down"></i></button>
          <button class="cm-btn cm-btn-outline cm-btn-sm cm-delete-media" type="button" data-index="${i}">
            <i data-lucide="trash-2"></i> <span>حذف</span>
          </button>
        </div>
      `;

      li.querySelector(".cm-media-orientation-select")?.addEventListener("change", async (event) => {
        const previousMedia = brand.media.map((item) => ({ ...item }));
        brand.media[i].orientation = mediaOrientation(event.target.value);
        try {
          await persistBrandMedia(brand);
          showToast("تم حفظ اتجاه الفيديو", "success");
        } catch (error) {
          brand.media = previousMedia;
          renderMediaList();
          showToast(error?.message || "تعذر حفظ اتجاه الفيديو", "error");
        }
      });

      li.querySelector(".cm-replace-youtube")?.addEventListener("click", async () => {
        const field = li.querySelector(".cm-media-replacement-input");
        const link = field?.value?.trim() || "";
        const video = window.cmYouTube?.parse(link);
        if (!video) {
          showToast("الصق رابط YouTube صحيحًا (فيديو أو Shorts أو Playlist).", "error");
          return;
        }
        const previousMedia = brand.media.map((item) => ({ ...item }));
        const oldLink = brand.media[i]?.file || "";
        brand.media[i].file = cleanVideoLink(link);
        brand.media[i].type = "video";
        try {
          await persistBrandMedia(brand);
          showToast("تم استبدال الفيديو برابط يوتيوب. الملفات القديمة لم تُحذف من التخزين.", "success");
        } catch (error) {
          brand.media = previousMedia;
          renderMediaList();
          showToast(error?.message || "تعذر حفظ الرابط، ولا يزال الفيديو السابق مستخدمًا.", "error");
        }
      });

      li.querySelector(".cm-media-title-input")?.addEventListener("change", async (e) => {
        const previousTitle = brand.media[i]?.title || "";
        brand.media[i].title = e.target.value.trim();
        try {
          await persistBrandMedia(brand);
          showToast("تم تحديث العنوان", "success");
        } catch (err) {
          brand.media[i].title = previousTitle;
          renderMediaList();
          showToast(err?.message || "تعذر حفظ العنوان؛ أُعيد العنوان السابق.", "error");
        }
      });

      li.querySelectorAll("[data-move]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const idx = Number(btn.getAttribute("data-index"));
          const dir = btn.getAttribute("data-move");
          const swapWith = dir === "up" ? idx - 1 : idx + 1;
          if (swapWith < 0 || swapWith >= brand.media.length) return;
          const previousMedia = brand.media.map((item) => ({ ...item }));
          const tmp = brand.media[idx];
          brand.media[idx] = brand.media[swapWith];
          brand.media[swapWith] = tmp;
          try {
            await persistBrandMedia(brand);
          } catch (err) {
            brand.media = previousMedia;
            renderMediaList();
            showToast(err?.message || "تعذر حفظ الترتيب؛ أُعيد الترتيب السابق.", "error");
          }
        });
      });

      li.querySelector(".cm-delete-media")?.addEventListener("click", async () => {
        if (!window.confirm("هل تريد حذف العنصر من المشروع؟ لن نحذف الملفات المستضافة خارجيًا.")) return;
        const previousMedia = brand.media.map((item) => ({ ...item }));
        const removedMedia = brand.media[i];
        brand.media.splice(i, 1);
        try {
          await persistBrandMedia(brand);
          showToast("تم حذف العنصر من بيانات المشروع. الملف الأصلي لم يُحذف من استضافته.", "success");
        } catch (err) {
          brand.media = previousMedia;
          renderMediaList();
          showToast(err?.message || "تعذر حفظ التعديل؛ أُعيد العنصر إلى القائمة.", "error");
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
    brandEgyptCategoryInput.disabled = false;
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
    brandEgyptCategoryInput.disabled = false;
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
      egyptCategory: brandEgyptCategoryInput.value || "other",
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
          const previousCategory = current.egyptCategory || "other";
          current.name = payload.name;
          current.market = payload.market;
          current.egyptCategory = payload.egyptCategory;
          current.coverUrl = payload.coverUrl;
          current.media = Array.isArray(current.media) ? current.media : [];
          const saved = await upsertBrand(current);
          data = sortBrands(data.map((b) => (b.id === saved.id ? saved : b)));
          // Changing a project's main section in the brand form is a deliberate
          // move to this section; clear any older multi-category overrides.
          if (previousCategory !== payload.egyptCategory) {
            const overrides = { ...getSectors().projectCategories };
            overrides[saved.id] = [payload.egyptCategory];
            site.sectors = { ...getSectors(), projectCategories: overrides };
            await saveSiteToDb(site);
            renderCategoryProjectChecklist();
          }
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
        renderCategoryProjectChecklist();
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
    const previousMedia = (Array.isArray(brand.media) ? brand.media : []).map((item) => ({ ...item }));
    const uploadedPublicUrls = [];
    let mediaSaved = false;
    try {
      await assertIsAdmin();
      brand.media = Array.isArray(brand.media) ? brand.media : [];
      const files = Array.from(mediaUploadInput?.files || []);
      const typedPath = (mediaFileInput?.value || "").trim();
      const customTitle = (mediaTitleInput?.value || "").trim();
      const selectedType = mediaTypeInput.value || "design";
      const selectedOrientation = mediaOrientation(mediaOrientationInput?.value);
      if (files.length && typedPath) throw new Error("استخدم رابطًا أو ملفات للرفع، وليس الاثنين معًا.");
      if (typedPath && /(?:youtube|youtu\.be)/i.test(typedPath) && !isYouTubeUrl(typedPath)) {
        throw new Error("رابط YouTube غير صالح؛ انسخ رابط المشاركة من الفيديو.");
      }

      const pushItem = (filePath, type, title) => {
        brand.media.push({
          type: isYouTubeUrl(filePath) ? "video" : (type || inferMediaType(filePath, selectedType)),
          file: cleanVideoLink(filePath),
          title: title || "",
          orientation: selectedOrientation,
        });
      };

      if (files.length) {
        uploadCancelledByUser = false;
        addMediaBtn.disabled = true;
        uploadProgressEl?.classList.remove("hidden");
        cancelUploadBtn?.classList.remove("hidden");
        for (let i = 0; i < files.length; i += 1) {
          const original = files[i];
          const preferVideo = selectedType === "video" || isVideoPath(original.name);
          if (uploadProgressTitleEl) {
            uploadProgressTitleEl.textContent = `تحضير الملف ${i + 1} من ${files.length}...`;
          }
          const file = await prepareUploadFile(original, preferVideo);
          if (uploadProgressTitleEl) {
            uploadProgressTitleEl.textContent = `جاري رفع الملف ${i + 1} من ${files.length}...`;
          }
          const { publicUrl } = await uploadToStorage(file, brand.id);
          if (!publicUrl) continue;
          uploadedPublicUrls.push(publicUrl);
          const type = preferVideo || isVideoPath(file.name) ? "video" : "design";
          const title = files.length === 1 ? customTitle : "";
          pushItem(publicUrl, type, title);
        }
      } else if (typedPath) {
        pushItem(typedPath, selectedType, customTitle);
      } else {
        showToast("اكتب رابط/مسار أو اختر ملف للرفع.", "info");
        return;
      }

      await persistBrandMedia(brand);
      mediaSaved = true;
      mediaFileInput.value = "";
      mediaTitleInput.value = "";
      if (mediaUploadInput) mediaUploadInput.value = "";
      showToast("تمت إضافة الوسائط بنجاح", "success");
    } catch (err) {
      if (!mediaSaved) {
        brand.media = previousMedia;
        renderMediaList();
        if (uploadedPublicUrls.length) await removeUnreferencedStorageObjects(uploadedPublicUrls);
      }
      showToast(err?.message || "تعذر إضافة الوسائط؛ لم يُعتمد التعديل.", "error");
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
    if (!window.confirm(`هل أنت متأكد من حذف براند "${brand.name}"؟ سيتم أيضًا محاولة حذف ملفات التخزين المرتبطة به إذا لم تعد مستخدمة في مشروع آخر أو إعدادات الموقع.`)) return;
    try {
      await assertIsAdmin();
      const cleanup = await deleteBrand(brand.id);
      data = data.filter((b) => b.id !== brand.id);
      const overrides = { ...getSectors().projectCategories };
      if (Object.prototype.hasOwnProperty.call(overrides, brand.id)) {
        delete overrides[brand.id];
        site.sectors = { ...getSectors(), projectCategories: overrides };
        await saveSiteToDb(site);
      }
      renderCategoryProjectChecklist();
      showToast("تم حذف المشروع من بيانات الموقع. الملفات الخارجية لم تُحذف.", "success");
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
    document.getElementById("intro-video-url").value = cleanIntroVideoUrl(h.introVideoUrl);
    document.getElementById("hero-quote").value = h.quote ?? DEFAULT_SITE.hero.quote;
    document.getElementById("hero-quote-caption").value = h.quoteCaption ?? DEFAULT_SITE.hero.quoteCaption;

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
    const guide = getSectors().guide;
    document.getElementById("guide-eyebrow").value = guide.eyebrow || "";
    document.getElementById("guide-heading").value = guide.heading || "";
    document.getElementById("guide-highlight").value = guide.highlight || "";
    document.getElementById("guide-description").value = guide.description || "";
    document.getElementById("guide-links-label").value = guide.linksLabel || "";
    document.getElementById("guide-accent").value = /^#[0-9a-f]{6}$/i.test(guide.accentColor) ? guide.accentColor : "#e4911f";
    document.getElementById("guide-background").value = /^#[0-9a-f]{6}$/i.test(guide.backgroundColor) ? guide.backgroundColor : "#061523";
    renderCategoriesEditor();
    populateBrandSelects();
    renderCategoryAssignmentSelect();

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
        <div class="cm-form-row">
          <div class="cm-form-group">
            <label>الاسم بالعربي</label>
            <input data-field="label" value="${escAttr(item.label || "")}" placeholder="مثلاً: مطاعم" />
          </div>
          <div class="cm-form-group">
            <label>الاسم بالإنجليزي (يظهر بالبرتقالي تحت العربي)</label>
            <input data-field="enLabel" value="${escAttr(item.enLabel || "")}" placeholder="Restaurants" dir="ltr" lang="en" />
          </div>
        </div>
        <div class="cm-form-row">
          <div class="cm-form-group">
            <label>الأيقونة</label>
            <select data-field="icon">${CATEGORY_ICONS.map(([id,label]) => `<option value="${id}" ${(item.icon || item.id) === id ? "selected" : ""}>${label}</option>`).join("")}</select>
          </div>
          <div class="cm-form-group">
            <label>الظهور للزوار</label>
            <select data-field="visible"><option value="yes" ${item.visible !== false ? "selected" : ""}>ظاهر</option><option value="no" ${item.visible === false ? "selected" : ""}>مخفي</option></select>
          </div>
        </div>
        <div class="cm-form-group">
          <label>وصف القسم عند فتحه</label>
          <textarea data-field="description" rows="2" placeholder="نبذة مخصصة تظهر أعلى مشاريع القسم">${escAttr(item.description || "")}</textarea>
        </div>
        <div class="cm-form-row">
          <div class="cm-form-group"><label>جملة صغيرة على كارت القسم</label><input data-field="tagline" value="${escAttr(item.tagline || "")}" placeholder="استكشف مشاريعنا" /></div>
          <div class="cm-form-group"><label>صورة القسم (رابط أو مسار)</label><input data-field="coverUrl" value="${escAttr(item.coverUrl || "")}" placeholder="https://..." /></div>
        </div>
        <div class="cm-form-group"><label>أو ارفع صورة للقسم</label><input type="file" accept="image/png,image/jpeg,image/webp" data-category-cover-upload /></div>
        <div class="cm-form-group"><label>المعرّف الداخلي (ثابت)</label><input data-field="id" value="${escAttr(item.id || "")}" readonly /></div>
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
          if (brand.egyptCategory === removed.id) {
            brand.egyptCategory = fallback;
            brand._categoryNeedsSync = true;
          }
        });
        list.splice(idx, 1);
        const projectCategories = { ...getSectors().projectCategories };
        Object.keys(projectCategories).forEach((brandId) => {
          if (Array.isArray(projectCategories[brandId])) {
            projectCategories[brandId] = projectCategories[brandId].filter((id) => id !== removed.id);
          }
        });
        site.sectors = { ...getSectors(), egyptCategories: list, projectCategories };
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
      items.push({
        id, label,
        enLabel: el.querySelector('[data-field="enLabel"]')?.value?.trim() || "",
        icon: el.querySelector('[data-field="icon"]')?.value || "other",
        visible: el.querySelector('[data-field="visible"]')?.value !== "no",
        description: el.querySelector('[data-field="description"]')?.value?.trim() || "",
        tagline: el.querySelector('[data-field="tagline"]')?.value?.trim() || "",
        coverUrl: el.querySelector('[data-field="coverUrl"]')?.value?.trim() || "",
      });
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

  // Category memberships live in cm_site_settings (JSON), so one existing project
  // may appear in several visitor sections without duplicating media or changing SQL.
  const renderCategoryAssignmentSelect = () => {
    if (!assignCategorySelect) return;
    const current = assignCategorySelect.value;
    const cats = getSectors().egyptCategories;
    assignCategorySelect.innerHTML = cats
      .map((cat) => `<option value="${escAttr(cat.id)}">${escAttr(cat.label)}</option>`)
      .join("");
    if (cats.some((cat) => cat.id === current)) assignCategorySelect.value = current;
    renderCategoryProjectChecklist();
  };

  const renderCategoryProjectChecklist = () => {
    if (!projectChecklist || !assignCategorySelect) return;
    const catId = assignCategorySelect.value;
    const brands = [...data].sort((a, b) => String(a.name).localeCompare(String(b.name), "ar"));
    projectChecklist.innerHTML = brands.length
      ? brands.map((brand) => {
          const isChecked = assignedCategoriesFor(brand).includes(catId);
          const selectedLabels = assignedCategoriesFor(brand).map(categoryLabel).join("، ") || "بدون قسم";
          return `<label class="cm-category-project-item" data-search="${escAttr((brand.name + ' ' + marketText(brand)).toLowerCase())}">
            <input type="checkbox" data-project-id="${escAttr(brand.id)}" ${isChecked ? "checked" : ""} />
            <span class="cm-category-project-detail"><strong>${escAttr(brand.name)}</strong><small>${escAttr(marketLabel(brand.market))} · ${escAttr(selectedLabels)}</small></span>
            <span class="cm-project-media-count">${(brand.media || []).length} ملف</span>
          </label>`;
        }).join("")
      : `<p class="cm-admin-note cm-admin-pad">لا توجد مشاريع محفوظة في قاعدة البيانات حاليًا. أضف مشروعًا جديدًا من قسم إدارة البراندات؛ لن يتم استيراد محتوى قديم تلقائيًا.</p>`;
    filterAssignmentList();
  };

  const filterAssignmentList = () => {
    const term = (assignSearchInput?.value || "").toLowerCase().trim();
    let visibleCount = 0;
    projectChecklist?.querySelectorAll(".cm-category-project-item").forEach((item) => {
      const matches = !term || (item.dataset.search || "").includes(term);
      item.classList.toggle("hidden", !matches);
      if (matches) visibleCount++;
    });
    const totalSelected = projectChecklist?.querySelectorAll('input[data-project-id]:checked').length || 0;
    if (assignStatus) assignStatus.textContent = `المشاريع المحددة داخل القسم: ${totalSelected} — نتائج البحث: ${visibleCount} من ${data.length}`;
  };
  assignCategorySelect?.addEventListener("change", renderCategoryProjectChecklist);
  assignSearchInput?.addEventListener("input", filterAssignmentList);
  projectChecklist?.addEventListener("change", filterAssignmentList);

  saveCategoryProjectsBtn?.addEventListener("click", async () => {
    try {
      await assertIsAdmin();
      const categoryId = assignCategorySelect?.value;
      if (!getSectors().egyptCategories.some((cat) => cat.id === categoryId)) throw new Error("اختر قسمًا صحيحًا أولاً");
      const assignments = { ...getSectors().projectCategories };
      // Apply the complete checkbox state (including rows hidden by search):
      // checking adds membership; unchecking removes only this section.
      projectChecklist.querySelectorAll('input[data-project-id]').forEach((input) => {
        const brand = data.find((item) => item.id === input.getAttribute("data-project-id"));
        if (!brand) return;
        const current = assignedCategoriesFor(brand).filter((id) => id !== categoryId);
        if (input.checked) current.push(categoryId);
        assignments[brand.id] = [...new Set(current)];
      });
      site.sectors = { ...getSectors(), projectCategories: assignments };
      await persistSite("تم حفظ مشاريع القسم. هتظهر للزوار من غير إعادة رفع الملفات.");
      renderCategoryProjectChecklist();
      renderBrandList();
    } catch (error) {
      showToast(error?.message || "تعذر حفظ المشاريع داخل القسم", "error");
    }
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
      // Upload new cover images before persisting the corresponding category metadata.
      const categoryRows = [...categoriesEditor.querySelectorAll(".cm-service-editor-item")];
      for (let i = 0; i < categoryRows.length; i += 1) {
        const file = categoryRows[i].querySelector("[data-category-cover-upload]")?.files?.[0];
        if (file && egyptCategories[i]) {
          if (!file.type.startsWith("image/")) throw new Error("اختار صورة للقسم، مش فيديو");
          const { publicUrl } = await uploadToStorage(file, `category-${egyptCategories[i].id}`);
          egyptCategories[i].coverUrl = publicUrl || egyptCategories[i].coverUrl;
        }
      }
      const guide = {
        eyebrow: document.getElementById("guide-eyebrow").value.trim(),
        heading: document.getElementById("guide-heading").value.trim(),
        highlight: document.getElementById("guide-highlight").value.trim(),
        description: document.getElementById("guide-description").value.trim(),
        linksLabel: document.getElementById("guide-links-label").value.trim(),
        accentColor: document.getElementById("guide-accent").value,
        backgroundColor: document.getElementById("guide-background").value,
      };
      site.sectors = {
        ...getSectors(),
        guide,
        markets: [
          { id: "saudi", label: saudiLabel },
          { id: "egypt", label: egyptLabel },
        ],
        egyptCategories,
      };

      // Persist remapped brand categories if any were moved during delete
      for (const brand of data) {
        if (!egyptCategories.some((c) => c.id === brand.egyptCategory)) {
          brand.egyptCategory = egyptCategories[0]?.id || "other";
          brand._categoryNeedsSync = true;
        }
        if (brand._categoryNeedsSync) {
          await upsertBrand(brand);
          delete brand._categoryNeedsSync;
        }
      }

      await persistSite("تم حفظ تصميم الأقسام ونصوصها وصورها");
      renderCategoriesEditor();
      renderCategoryAssignmentSelect();
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
      let introUrl = cleanIntroVideoUrl(document.getElementById("intro-video-url").value);
      if (/(?:youtube|youtu\.be)/i.test(introUrl) && !window.cmYouTube?.parse(introUrl)) {
        throw new Error("رابط YouTube الخاص بالفيديو التعريفي غير صالح.");
      }
      if (window.cmYouTube?.parse(introUrl)) introUrl = cleanVideoLink(introUrl);
      const fileRaw = introVideoUpload?.files?.[0] || null;
      if (fileRaw) {
        uploadProgressEl?.classList.remove("hidden");
        const file = await prepareUploadFile(fileRaw, true);
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
        quote: document.getElementById("hero-quote").value.trim(),
        quoteCaption: document.getElementById("hero-quote-caption").value.trim(),
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

  // Old Supabase cleanup is intentionally disabled during migration.
  if (cleanupStorageOrphansBtn) {
    cleanupStorageOrphansBtn.disabled = true;
    cleanupStorageOrphansBtn.textContent = "تنظيف Supabase القديم منفصل عن لوحة الإدارة الجديدة";
  }

  const bootstrapAdminData = async () => {
    await loadCms();
    renderBrandList();
    updateDashboardStats();
    fillSiteForms();
    clearForm();
  };

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    (async () => {
      try {
        const username = document.getElementById("admin-email")?.value?.trim() || "";
        const password = document.getElementById("admin-pass")?.value || "";
        await fetchCmsApi("/api/auth", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        await ensureAuthUi();
        await bootstrapAdminData();
        showToast("تم تسجيل الدخول بنجاح", "success");
      } catch (err) {
        const message = err?.message || "تعذر تسجيل الدخول.";
        if (loginHintEl) loginHintEl.textContent = message;
        loginCard?.classList.remove("hidden");
        appCard?.classList.add("hidden");
        showToast(message, "error");
      }
    })();
  });
  logoutBtn.addEventListener("click", async () => {
    try { await fetchCmsApi("/api/auth", { method: "DELETE" }); }
    finally { window.location.reload(); }
  });
  (async () => {
    await ensureAuthUi();
    try {
      const authenticated = Boolean((await fetchCmsApi("/api/auth")).authenticated);
      if (!authenticated) return;
      await bootstrapAdminData();
    } catch (err) {
      if (loginHintEl) loginHintEl.textContent = err?.message || "";
      loginCard?.classList.remove("hidden");
      appCard?.classList.add("hidden");
    }
  })();
});
