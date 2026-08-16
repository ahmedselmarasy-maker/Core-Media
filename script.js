document.addEventListener("DOMContentLoaded", () => {
  // Metrics Counter Animation
  const animateCounters = () => {
    const counters = document.querySelectorAll(".cm-metric-number");
    const speed = 200;

    counters.forEach((counter) => {
      const target = parseInt(counter.innerText.replace(/\D/g, ""));
      const updateCount = () => {
        const count = parseInt(counter.innerText.replace(/\D/g, "") || "0");
        const inc = target / speed;

        if (count < target) {
          counter.innerText = (counter.innerText.includes("+") ? "+" : "") + Math.ceil(count + inc) + (counter.innerText.includes("°") ? "°" : "");
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = (counter.innerText.includes("+") ? "+" : "") + target + (counter.innerText.includes("°") ? "°" : "");
        }
      };
      updateCount();
    });
  };

  // Intersection Observer for Counters
  const metricsSection = document.querySelector(".cm-hero-metrics");
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.unobserve(entries[0].target);
      }
    }, { threshold: 0.5 });
    observer.observe(metricsSection);
  }

  // Preloader Logic
  const preloader = document.getElementById("preloader");
  const preloaderLogo = document.getElementById("preloader-logo");
  const preloaderName = document.getElementById("preloader-name");
  const preloaderTagline = document.getElementById("preloader-tagline");

  const typeWriter = (text, element, speed = 100) => {
    return new Promise((resolve) => {
      let i = 0;
      element.innerHTML = "";
      const timer = setInterval(() => {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  };

  const startPreloader = async () => {
    // Prevent scrolling while preloading
    document.body.style.overflow = "hidden";

    // Show Logo
    setTimeout(() => {
      preloaderLogo.classList.add("is-visible");
    }, 300);

    // Type "Core Media"
    await new Promise((r) => setTimeout(r, 1000));
    await typeWriter("Core Media", preloaderName, 80);

    // Type "استوديو تسويق متكامل"
    await new Promise((r) => setTimeout(r, 200));
    await typeWriter("استوديو تسويق متكامل", preloaderTagline, 50);

    // Wait and then hide preloader
    await new Promise((r) => setTimeout(r, 1000));
    
    // Physical move to header logo position
    const headerLogo = document.querySelector(".cm-logo-mark");
    if (headerLogo) {
      const headerRect = headerLogo.getBoundingClientRect();
      const preloaderRect = preloaderLogo.getBoundingClientRect();
      
      const deltaX = headerRect.left + headerRect.width / 2 - (preloaderRect.left + preloaderRect.width / 2);
      const deltaY = headerRect.top + headerRect.height / 2 - (preloaderRect.top + preloaderRect.height / 2);
      const scale = headerRect.width / preloaderRect.width;

      preloaderName.style.opacity = "0";
      preloaderTagline.style.opacity = "0";
      preloaderName.style.transition = "opacity 0.3s ease";
      preloaderTagline.style.transition = "opacity 0.3s ease";
      
      preloaderLogo.style.transition = "all 0.8s cubic-bezier(0.77, 0, 0.175, 1)";
      preloaderLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    }

    preloader.style.backgroundColor = "transparent";
    preloader.style.backdropFilter = "blur(0px)";
    preloader.classList.add("is-closing");
    
    await new Promise((r) => setTimeout(r, 800));
    preloader.classList.add("is-hidden");
    document.body.style.overflow = "";

    // Initialize AOS after preloader
    if (window.AOS) {
      AOS.refresh();
    }
  };

  const preloaderPromise = startPreloader();

  // Initialize AOS
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }

  // Scroll Progress Bar & Header Background
  const progressBar = document.querySelector(".cm-scroll-progress");
  const header = document.querySelector(".cm-header");
  if (progressBar || header) {
    window.addEventListener("scroll", () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      if (progressBar) progressBar.style.width = scrolled + "%";
      
      if (header) {
        if (winScroll > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    });
  }

  // Back to Top Button
  const backToTopBtn = document.querySelector(".cm-back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  const STORAGE_KEY = "cmPortfolioDataV1";
  const SITE_STORAGE_KEY = "cmSiteContentV1";
  const INTRO_VIDEO_DISMISSED_KEY = "cmIntroVideoDismissedV1";
  let WHATSAPP_E164 = "201019132369";
  const BRAND_TABLE = "cm_brands";
  const SITE_TABLE = "cm_site_settings";
  const DEFAULT_EGYPT_CATEGORIES = [
    { id: "restaurants", label: "مطاعم" },
    { id: "cafes", label: "كافيهات" },
    { id: "medical", label: "ميديكل" },
    { id: "other", label: "مشاريع أخرى" },
  ];
  const DEFAULT_MARKETS = [
    { id: "saudi", label: "القطاع السعودي" },
    { id: "egypt", label: "القطاع المصري" },
  ];
  let EGYPT_CATEGORIES = [...DEFAULT_EGYPT_CATEGORIES];
  let MARKET_LABELS = {
    saudi: "القطاع السعودي",
    egypt: "القطاع المصري",
  };

  const supabaseUrl = window.CM_SUPABASE_URL;
  const supabaseAnonKey = window.CM_SUPABASE_ANON_KEY;
  const hasSupabaseConfig =
    supabaseUrl &&
    supabaseAnonKey &&
    !String(supabaseUrl).includes("PASTE_YOUR_SUPABASE_URL_HERE") &&
    !String(supabaseAnonKey).includes("PASTE_YOUR_SUPABASE_ANON_KEY_HERE");
  const supabase = hasSupabaseConfig ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  const nav = document.querySelector(".cm-nav");
  const toggle = document.querySelector(".cm-nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("is-open"));
    });
  }

  const escAttr = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");

  const makeId = (name, i) =>
    `brand-${String(name || "item")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")}-${i}`;

  const isVideoPath = (path) =>
    /\.(mp4|mov|avi|webm)$/i.test(String(path || "").trim());

  const inferMediaType = (path, fallback = "design") =>
    isVideoPath(path) ? "video" : fallback;

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

  const setText = (selector, value) => {
    if (value == null || value === "") return;
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  const applySiteContent = (content) => {
    if (!content || typeof content !== "object") return;
    const hero = content.hero || {};
    setText('[data-cm="hero-badge"]', hero.badge);
    setText('[data-cm="hero-highlight"]', hero.highlight);
    setText('[data-cm="hero-subtitle"]', hero.subtitle);
    setText('[data-cm="hero-cta-primary"]', hero.ctaPrimary);
    setText('[data-cm="hero-cta-secondary"]', hero.ctaSecondary);
    if (Array.isArray(hero.metrics)) {
      hero.metrics.forEach((metric, i) => {
        setText(`[data-cm="metric-${i}-number"]`, metric.number);
        setText(`[data-cm="metric-${i}-label"]`, metric.label);
      });
    }
    const introTrigger = document.getElementById("cm-intro-video-trigger");
    if (introTrigger) {
      if (hero.introVideoUrl) introTrigger.setAttribute("data-file", hero.introVideoUrl);
      if (hero.introVideoLabel) introTrigger.textContent = hero.introVideoLabel;
    }

    const about = content.about || {};
    setText('[data-cm="about-title"]', about.title);
    setText('[data-cm="about-text"]', about.text);
    setText('[data-cm="about-philosophy-title"]', about.philosophyTitle);
    setText('[data-cm="about-philosophy-text"]', about.philosophyText);
    setText('[data-cm="about-who-title"]', about.whoTitle);
    setText('[data-cm="about-who-text"]', about.whoText);
    if (Array.isArray(about.pills)) {
      const pillsRoot = document.querySelector('[data-cm="about-pills"]');
      if (pillsRoot) {
        pillsRoot.innerHTML = about.pills
          .map(
            (pill, i) =>
              `<span data-aos="zoom-in" data-aos-delay="${(i + 1) * 100}">${escAttr(pill)}</span>`
          )
          .join("");
      }
    }

    setText('[data-cm="portfolio-title"]', content.portfolio?.title);
    setText('[data-cm="portfolio-subtitle"]', content.portfolio?.subtitle);

    const sectors = content.sectors || {};
    if (Array.isArray(sectors.egyptCategories) && sectors.egyptCategories.length) {
      EGYPT_CATEGORIES = sectors.egyptCategories
        .map((c) => ({ id: String(c.id || "").trim(), label: String(c.label || "").trim() }))
        .filter((c) => c.id && c.label);
    } else {
      EGYPT_CATEGORIES = [...DEFAULT_EGYPT_CATEGORIES];
    }
    if (Array.isArray(sectors.markets) && sectors.markets.length) {
      sectors.markets.forEach((m) => {
        if (m?.id && m?.label) MARKET_LABELS[m.id] = m.label;
      });
    } else {
      MARKET_LABELS = {
        saudi: DEFAULT_MARKETS[0].label,
        egypt: DEFAULT_MARKETS[1].label,
      };
    }
    setText('[data-cm="market-saudi"]', MARKET_LABELS.saudi);
    setText('[data-cm="market-egypt"]', MARKET_LABELS.egypt);

    const services = content.services || {};
    setText('[data-cm="services-title"]', services.title);
    setText('[data-cm="services-subtitle"]', services.subtitle);
    const servicesGrid = document.querySelector('[data-cm="services-grid"]');
    if (servicesGrid && Array.isArray(services.items) && services.items.length) {
      servicesGrid.innerHTML = services.items
        .map(
          (item, i) => `
        <article class="cm-card" data-aos="fade-up" data-aos-delay="${(i + 1) * 100}">
          <h3 class="cm-gradient-text">${escAttr(item.title || "")}</h3>
          <p>${escAttr(item.text || "")}</p>
          <ul>${(item.bullets || []).map((b) => `<li>${escAttr(b)}</li>`).join("")}</ul>
        </article>`
        )
        .join("");
    }

    const contact = content.contact || {};
    setText('[data-cm="contact-title"]', contact.title);
    setText('[data-cm="contact-text"]', contact.text);
    setText('[data-cm="contact-email"]', contact.email);
    setText('[data-cm="contact-whatsapp"]', contact.whatsappDisplay);
    if (contact.whatsappE164) WHATSAPP_E164 = String(contact.whatsappE164).replace(/\D/g, "");
    const fb = document.querySelector('[data-cm="contact-facebook"]');
    if (fb && contact.facebookUrl) fb.setAttribute("href", contact.facebookUrl);
    const waBtn = document.querySelector('[data-cm="contact-whatsapp-btn"]');
    if (waBtn && WHATSAPP_E164) waBtn.setAttribute("href", `https://wa.me/${WHATSAPP_E164}`);
  };

  const loadSiteContent = async () => {
    if (supabase) {
      try {
        const { data: row, error } = await supabase.from(SITE_TABLE).select("content").eq("id", 1).maybeSingle();
        if (!error && row?.content && typeof row.content === "object") {
          try {
            localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(row.content));
          } catch (_) {}
          return row.content;
        }
      } catch (_) {}
    }
    try {
      const raw = localStorage.getItem(SITE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (_) {}
    return null;
  };

  const sortBrands = (brands) =>
    [...brands].sort((a, b) => {
      const ao = typeof a.sortOrder === "number" ? a.sortOrder : 0;
      const bo = typeof b.sortOrder === "number" ? b.sortOrder : 0;
      if (ao !== bo) return ao - bo;
      return String(a.name || "").localeCompare(String(b.name || ""), "ar");
    });

  const parseInitialPortfolioData = () => {
    const cards = Array.from(document.querySelectorAll("#portfolio-groups .cm-portfolio-card"));
    return cards.map((card, index) => {
      const market = card.getAttribute("data-market") || "egypt";
      const name = card.querySelector(".cm-portfolio-info h3")?.textContent?.trim() || `Brand ${index + 1}`;
      const group = card.closest(".cm-portfolio-group");
      const egyptCategory = market === "egypt" ? group?.getAttribute("data-egypt-cat") || "other" : null;
      const media = Array.from(card.querySelectorAll(".cm-tag"))
        .map((tag) => {
          const file = tag.getAttribute("data-file") || "";
          const inVideoRow = tag.closest(".cm-portfolio-tags-videos");
          return {
            type: inVideoRow ? "video" : inferMediaType(file, "design"),
            file: file.trim(),
          };
        })
        .filter((m) => m.file);
      return {
        id: makeId(name, index + 1),
        name,
        market,
        egyptCategory,
        media,
      };
    });
  };

  const loadPortfolioData = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    const initial = parseInitialPortfolioData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  };

  const savePortfolioData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const loadPortfolioDataFromSupabase = async () => {
    if (!supabase) return null;
    const { data: rows, error } = await supabase.from(BRAND_TABLE).select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    const normalized = (rows || []).map(normalizeBrand);
    return sortBrands(normalized);
  };

  const mediaByType = (brand, type) =>
    (brand.media || []).filter((m) => (m.type || "design") === type && m.file);

  const renderTags = (items, prefix) =>
    items
      .map((m, i) => {
        const label = m.title || `${prefix} ${i + 1}`;
        return `<span class="cm-tag" data-file="${escAttr(m.file)}">${escAttr(label)}</span>`;
      })
      .join("");

  const buildCardHtml = (brand) => {
    const designs = mediaByType(brand, "design");
    const videos = mediaByType(brand, "video");
    const dataImages = designs.map((m) => m.file).join("|");
    const dataVideos = videos.map((m) => m.file).join("|");
    const hasDesign = designs.length > 0;
    const hasVideo = videos.length > 0;
    const category = [hasDesign ? "design" : "", hasVideo ? "video" : ""]
      .filter(Boolean)
      .join(" ");

    const cover = (brand.coverUrl || "").trim();
    const thumbHtml = cover
      ? `<img src="${escAttr(cover)}" alt="${escAttr(brand.name)}" loading="lazy" /><span class="cm-portfolio-thumb-label">${escAttr(brand.name)}</span>`
      : `<span>${escAttr(brand.name)}</span>`;

    return `<article class="cm-portfolio-card" data-category="${category}" data-market="${brand.market}" data-images="${escAttr(dataImages)}" data-videos="${escAttr(dataVideos)}" data-aos="fade-up">
      <div class="cm-portfolio-thumb ${cover ? "has-cover" : "placeholder-video"}">
        ${thumbHtml}
      </div>
      <div class="cm-portfolio-info">
        <h3 class="cm-gradient-text">${escAttr(brand.name)}</h3>
        <div class="cm-portfolio-tags">
          <div class="cm-portfolio-tags-row cm-portfolio-tags-designs">${renderTags(designs, "تصميم")}</div>
          <div class="cm-portfolio-tags-row cm-portfolio-tags-videos">${renderTags(videos, "قاطعة")}</div>
        </div>
      </div>
    </article>`;
  };

  const renderPortfolio = (data) => {
    const groupsRoot = document.getElementById("portfolio-groups");
    if (!groupsRoot) return;
    const saudiBrands = data.filter((b) => b.market === "saudi");
    const egyptBrands = data.filter((b) => b.market === "egypt");
    const egyptGroupsHtml = EGYPT_CATEGORIES.map((cat) => {
      const knownIds = new Set(EGYPT_CATEGORIES.map((c) => c.id));
      const fallbackId = EGYPT_CATEGORIES[EGYPT_CATEGORIES.length - 1]?.id || "other";
      const list = egyptBrands.filter((b) => {
        let id = b.egyptCategory || fallbackId;
        if (!knownIds.has(id)) id = fallbackId;
        return id === cat.id;
      });
      const cards = list.map(buildCardHtml).join("");
      return `<div class="cm-portfolio-group" data-egypt-cat="${escAttr(cat.id)}" data-aos="fade-up">
        <div class="cm-portfolio-group-head">
          <h3 class="cm-portfolio-group-title cm-gradient-text">${escAttr(cat.label)}</h3>
        </div>
        <div class="cm-portfolio-grid">${cards}</div>
      </div>`;
    }).join("");

    groupsRoot.innerHTML = `
      <div class="cm-portfolio-market" data-market="saudi" data-aos="fade-up">
        <div class="cm-portfolio-group">
          <div class="cm-portfolio-group-head">
            <h3 class="cm-portfolio-group-title cm-gradient-text">${escAttr(MARKET_LABELS.saudi || "القطاع السعودي")}</h3>
          </div>
          <div class="cm-portfolio-grid">${saudiBrands.map(buildCardHtml).join("")}</div>
        </div>
      </div>
      <div class="cm-portfolio-market" data-market="egypt" data-aos="fade-up">
        <div class="cm-portfolio-group-head">
          <h3 class="cm-portfolio-group-title cm-gradient-text">${escAttr(MARKET_LABELS.egypt || "القطاع المصري")}</h3>
        </div>
        <div class="cm-portfolio-filter-block cm-portfolio-sector-block cm-portfolio-egypt-subfilter-block">
          <span class="cm-portfolio-filter-label">التصنيف</span>
          <div class="cm-portfolio-filters" aria-label="تصفية القطاع المصري">
            <button type="button" class="cm-filter-btn cm-egypt-cat-btn active" data-egypt-cat="all">الكل</button>
            ${EGYPT_CATEGORIES.map(
              (cat) =>
                `<button type="button" class="cm-filter-btn cm-egypt-cat-btn" data-egypt-cat="${escAttr(cat.id)}">${escAttr(cat.label)}</button>`
            ).join("")}
          </div>
        </div>
        <div class="cm-portfolio-market-body">${egyptGroupsHtml}</div>
      </div>
    `;

    // Refresh AOS after dynamic content is added
    if (window.AOS) {
      AOS.refresh();
    }
  };

  const applyEgyptCategoryFilter = () => {
    const egyptMarket = document.querySelector('.cm-portfolio-market[data-market="egypt"]');
    if (!egyptMarket) return;
    const catBtn = document.querySelector(".cm-egypt-cat-btn.active");
    const cat = catBtn?.getAttribute("data-egypt-cat") || "all";
    egyptMarket
      .querySelectorAll(".cm-portfolio-market-body > .cm-portfolio-group")
      .forEach((group) => {
        const groupCat = group.getAttribute("data-egypt-cat");
        const show = cat === "all" || cat === groupCat;
        group.style.display = show ? "" : "none";
      });
  };

  const applyPortfolioFilters = () => {
    const market =
      document.querySelector(".cm-portfolio-filters [data-market].active")?.getAttribute("data-market") ||
      "all";
    document.querySelectorAll(".cm-portfolio-market").forEach((marketBlock) => {
      const blockMarket = marketBlock.getAttribute("data-market") || "";
      marketBlock.style.display = market === "all" || market === blockMarket ? "" : "none";
    });
    applyEgyptCategoryFilter();
  };

  const bindFilterEvents = () => {
    document.querySelectorAll(".cm-portfolio-filters [data-market]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cm-portfolio-filters [data-market]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyPortfolioFilters();
      });
    });
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".cm-egypt-cat-btn");
      if (!btn) return;
      document.querySelectorAll(".cm-egypt-cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyEgyptCategoryFilter();
    });
  };

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value.trim() || "";
      const brand = document.getElementById("brand")?.value.trim() || "";
      const message = document.getElementById("message")?.value.trim() || "";
      const lines = [
        "مرحباً Core Media،",
        "",
        `الاسم: ${name}`,
        brand ? `البراند / الشركة: ${brand}` : "",
        message ? "" : "",
        message ? "تفاصيل المشروع:" : "",
        message || "",
      ].filter(Boolean);
      window.open(
        `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

  const lightbox = document.getElementById("cm-lightbox");
  const lightboxTitle = lightbox?.querySelector(".cm-lightbox-title");
  const lightboxText = lightbox?.querySelector(".cm-lightbox-text");
  const closeBtn = lightbox?.querySelector(".cm-lightbox-close");
  const backdrop = lightbox?.querySelector(".cm-lightbox-backdrop");
  const introVideoTrigger = document.getElementById("cm-intro-video-trigger");
  const getIntroVideoPath = () => (introVideoTrigger?.getAttribute("data-file") || "").trim();
  let introVideoOpen = false;
  const videoProtectionAttrs =
    'preload="auto" playsinline webkit-playsinline controls controlslist="nodownload noplaybackrate" disablepictureinpicture disableremoteplayback';

  const videoFallbackHtml =
    '<p class="cm-lightbox-video-fallback">الصوت شغال والصورة مش ظاهرة — غالبًا الملف نفسه بصيغة HEVC (حتى لو اترفح من اللاب). من لوحة الإدارة: احذف القاطعة وارفعها تاني واستنى رسالة التحويل لـ H.264.</p>';

  const buildVideoHtml = (src, extraAttrs = "") =>
    `<div class="cm-lightbox-media-frame cm-lightbox-media-frame-video">
      <video class="cm-lightbox-media cm-lightbox-video" ${videoProtectionAttrs} ${extraAttrs}>
        <source src="${escAttr(src)}" type="video/mp4" />
      </video>
      ${videoFallbackHtml}
    </div>`;

  const enhanceLightboxVideos = () => {
    if (!lightbox) return;
    lightbox.querySelectorAll("video.cm-lightbox-video").forEach((video) => {
      const frame = video.closest(".cm-lightbox-media-frame-video");
      const fallback = frame?.querySelector(".cm-lightbox-video-fallback");
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      const showFallback = () => {
        if (fallback) fallback.classList.add("is-visible");
      };

      const applySize = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
          video.style.minHeight = "0";
          if (fallback) fallback.classList.remove("is-visible");
        }
      };

      const checkTrack = () => {
        // Desktop often plays audio-only for HEVC; videoWidth stays 0.
        // Wait a tick so late metadata isn't treated as failure.
        window.setTimeout(() => {
          if (!video.isConnected) return;
          if (video.readyState >= 2 && (!video.videoWidth || !video.videoHeight)) {
            showFallback();
          } else if (video.videoWidth > 0) {
            applySize();
            if (fallback) fallback.classList.remove("is-visible");
          }
        }, 400);
      };

      video.addEventListener("loadedmetadata", applySize);
      video.addEventListener("loadeddata", checkTrack);
      video.addEventListener("playing", checkTrack);
      video.addEventListener("error", showFallback);

      // Nudge Chrome to decode/paint the first frame on desktop
      const kick = () => {
        try {
          const t = video.currentTime;
          if (t === 0 && video.readyState >= 1) {
            video.currentTime = 0.001;
          }
        } catch (_) {}
      };
      video.addEventListener("loadedmetadata", kick, { once: true });

      if (video.readyState >= 1) {
        applySize();
        checkTrack();
      }
    });
  };

  const buildMediaContent = (card) => {
    const images = (card.getAttribute("data-images") || "").split("|").filter(Boolean);
    const videos = (card.getAttribute("data-videos") || "").split("|").filter(Boolean);
    const parts = [];
    images.forEach((src) => {
      parts.push(
        `<img src="${escAttr(src)}" alt="" class="cm-lightbox-media cm-lightbox-image" decoding="async" draggable="false" loading="eager" />`
      );
    });
    videos.forEach((src, i) => {
      parts.push(buildVideoHtml(src, i === 0 ? "autoplay" : ""));
    });
    return parts.length ? `<div class="cm-lightbox-gallery">${parts.join("")}</div>` : "";
  };

  const openLightbox = (title, mediaHtml, options = {}) => {
    if (!(lightbox && lightboxTitle && lightboxText)) return;
    const description =
      options.description || "استعرض الوسائط الخاصة بهذا البراند.";
    lightbox.classList.remove("is-intro-open");
    if (options.lightboxClass) {
      lightbox.classList.add(options.lightboxClass);
    }
    lightboxTitle.textContent = title || "مشروع";
    lightboxText.innerHTML = `${mediaHtml}<span class="cm-lightbox-desc">${description}</span>`;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    enhanceLightboxVideos();
  };

  const openSingleMedia = (filePath, title) => {
    const mediaHtml = isVideoPath(filePath)
      ? buildVideoHtml(filePath, "autoplay")
      : `<img src="${escAttr(filePath)}" alt="" class="cm-lightbox-media cm-lightbox-image" decoding="async" draggable="false" loading="eager" />`;
    openLightbox(title, mediaHtml);
  };

  const closeLightbox = (reason = "manual") => {
    if (!lightbox) return;
    lightbox.querySelectorAll("video").forEach((v) => v.pause());
    lightbox.classList.remove("is-open");
    lightbox.classList.remove("is-intro-open");
    document.body.style.overflow = "";
    introVideoOpen = false;
  };

  const openCompanyIntro = ({ autoOpen = false } = {}) => {
    const introVideoPath = getIntroVideoPath();
    if (!introVideoPath) return;

    openLightbox(
      introVideoTrigger?.textContent?.trim() || "Video.Core",
      buildVideoHtml(introVideoPath, autoOpen ? "autoplay muted" : "autoplay").replace(
        'cm-lightbox-media-frame-video"',
        'cm-lightbox-media-frame-video cm-intro-video-frame"'
      ).replace(
        'cm-lightbox-video"',
        'cm-lightbox-video cm-intro-video"'
      ),
      { description: autoOpen ? "فيديو تعريفي - سيتم تفعيل الصوت تلقائياً." : "فيديو تعريفي لشركة Core Media." }
    );
    
    lightbox?.classList.add("is-intro-open");
    introVideoOpen = true;
    
    const introVideoEl = lightbox?.querySelector(".cm-intro-video");
    if (introVideoEl) {
      introVideoEl.addEventListener(
        "ended",
        () => {
          closeLightbox("ended");
        },
        { once: true }
      );

      // Try to play
      const playPromise = introVideoEl.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (autoOpen) {
            // Success! Try to unmute after a short delay
            setTimeout(() => {
              introVideoEl.muted = false;
              introVideoEl.volume = 1;
            }, 100);
          }
        }).catch((error) => {
          console.log("Autoplay blocked or failed:", error);
          if (autoOpen) {
            // If autoplay fails, we keep the lightbox open but maybe show a play button overlay or update text
            const desc = lightbox.querySelector(".cm-lightbox-desc");
            if (desc) desc.textContent = "انقر لتشغيل الفيديو التعريفي.";
          }
        });
      }
    }
  };

  if (lightbox) {
    lightbox.addEventListener("contextmenu", (e) => {
      if (e.target?.closest(".cm-lightbox-media")) e.preventDefault();
    });
    lightbox.addEventListener(
      "dragstart",
      (e) => {
        if (e.target?.closest(".cm-lightbox-media")) e.preventDefault();
      },
      true
    );
  }
  if (closeBtn) closeBtn.addEventListener("click", () => closeLightbox("manual"));
  if (backdrop) backdrop.addEventListener("click", () => closeLightbox("manual"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("is-open")) closeLightbox("manual");
  });

  if (introVideoTrigger) {
    introVideoTrigger.addEventListener("click", () => openCompanyIntro({ autoOpen: false }));
  }

  const portfolioRoot = document.getElementById("portfolio-groups");
  if (portfolioRoot) {
    portfolioRoot.addEventListener("click", (e) => {
      const tag = e.target.closest(".cm-tag");
      if (tag) {
        e.stopPropagation();
        const filePath = tag.getAttribute("data-file");
        if (!filePath) return;
        const card = tag.closest(".cm-portfolio-card");
        const title = card?.querySelector(".cm-portfolio-info h3")?.textContent || "مشروع";
        openSingleMedia(filePath, title);
        return;
      }
      const card = e.target.closest(".cm-portfolio-card");
      if (!card) return;
      const title = card.querySelector(".cm-portfolio-info h3")?.textContent || "مشروع";
      openLightbox(title, buildMediaContent(card));
    });
  }

  (async () => {
    const siteContent = await loadSiteContent();
    if (siteContent) applySiteContent(siteContent);

    let data = null;
    if (supabase) {
      try {
        data = await loadPortfolioDataFromSupabase();
      } catch (_) {
        data = null;
      }
    }
    if (!Array.isArray(data) || !data.length) {
      data = loadPortfolioData();
      savePortfolioData(data);
    }
    renderPortfolio(data);
    bindFilterEvents();
    applyPortfolioFilters();
  })();

});

