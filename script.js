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
  const preloaderLogoStage = document.getElementById("preloader-logo-stage");
  const preloaderName = document.getElementById("preloader-name");
  const preloaderTagline = document.getElementById("preloader-tagline");

  // A camera, not a decorative circle: the original glass and bezel are separate image layers.
  // Only the shutter blades are generated in SVG, perfectly clipped inside the real lens rim.
  const playCoreLensV3 = () => {
    const blades = document.getElementById("cm-lens-shutter-blades");
    const glass = document.querySelector(".cm-lens-glass");
    const glow = document.querySelector(".cm-lens-capture-glow");
    if (!blades || !glass || !glow) return;
    const NS = "http://www.w3.org/2000/svg";
    const leaves = Array.from({ length: 7 }, (_, i) => {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("fill", ["#081019", "#0d1721", "#111d28", "#0a1420"][i % 4]);
      path.setAttribute("stroke", "#344456");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("stroke-linejoin", "round");
      blades.appendChild(path);
      return path;
    });
    const ease = (n) => { const t = Math.max(0, Math.min(1, n)); return t * t * (3 - 2 * t); };
    const pt = (r, angle) => [195 + r * Math.cos(angle), 195 + r * Math.sin(angle)];
    const xy = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
    // Exposed to local preview/test harnesses, no external libraries or image sprites required.
    const render = (t) => {
      let amount = 0;
      if (t >= .31 && t < .75) amount = ease((t - .31) / .44);
      else if (t >= .75 && t < .86) amount = 1;
      else if (t >= .86 && t < 1.30) amount = 1 - ease((t - .86) / .44);
      const radius = 140 - amount * 126;
      const twist = amount * .25;
      leaves.forEach((leaf, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 7;
        const b = -Math.PI / 2 + ((i + 1) * Math.PI * 2) / 7;
        const p0 = pt(154, a);
        const p1 = pt(154, b);
        const q0 = pt(radius, a + twist);
        const q1 = pt(radius, b + twist);
        leaf.setAttribute("d", `M ${xy(p0)} L ${xy(p1)} L ${xy(q1)} L ${xy(q0)} Z`);
      });
      blades.style.opacity = amount < .001 ? "0" : "1";
      const focus = Math.sin(Math.PI * ease(Math.min(1, t / .53)));
      glass.style.transform = `rotate(${(2.2 * focus).toFixed(3)}deg) scale(${(1 + .043 * focus).toFixed(4)})`;
      const flash = t >= 1.23 && t <= 1.58 ? Math.pow(Math.sin(Math.PI * (t - 1.23) / .35), 2) : 0;
      glow.style.opacity = (flash * .85).toFixed(3);
    };
    window.__coreLensV3Frame = render;
    let start;
    const frame = (now) => {
      if (start === undefined) start = now;
      const t = Math.min(1.7, (now - start) / 1000);
      render(t);
      if (t < 1.7 && !document.getElementById("preloader")?.classList.contains("is-hidden")) requestAnimationFrame(frame);
      else { render(1.7); delete window.__coreLensV3Frame; }
    };
    requestAnimationFrame(frame);
  };

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

    // True layered optical assembly: mechanical 7-leaf SVG shutter, optical focus and exposure flash.
    if (preloaderLogoStage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(playCoreLensV3, 660);
    }

    // Type "Core Media"
    await new Promise((r) => setTimeout(r, 1000));
    await typeWriter("Core Media", preloaderName, 80);

    // Type "استوديو تسويق متكامل"
    await new Promise((r) => setTimeout(r, 200));
    await typeWriter("MEDIA & PRODUCTION", preloaderTagline, 55);

    // Wait and then hide preloader
    await new Promise((r) => setTimeout(r, 1000));
    
    // Fly toward the brand logo on the full-screen category guide (not the old home page).
    const headerLogo = document.querySelector(".cm-gateway-logo-img") || document.querySelector(".cm-logo-mark");
    if (headerLogo) {
      const headerRect = headerLogo.getBoundingClientRect();
      const preloaderRect = (preloaderLogoStage || preloaderLogo).getBoundingClientRect();
      
      const deltaX = headerRect.left + headerRect.width / 2 - (preloaderRect.left + preloaderRect.width / 2);
      const deltaY = headerRect.top + headerRect.height / 2 - (preloaderRect.top + preloaderRect.height / 2);
      const scale = headerRect.width / preloaderRect.width;

      preloaderName.style.opacity = "0";
      preloaderTagline.style.opacity = "0";
      preloaderName.style.transition = "opacity 0.3s ease";
      preloaderTagline.style.transition = "opacity 0.3s ease";
      
      const flyingLogo = preloaderLogoStage || preloaderLogo;
      flyingLogo.style.transition = "transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)";
      flyingLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
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

  const INTRO_VIDEO_DISMISSED_KEY = "cmIntroVideoDismissedV1";
  let WHATSAPP_E164 = "201019132369";
  // English subtitles are configurable from the Admin Panel; defaults cover old saved categories.
  const DEFAULT_EN_CATEGORY_LABELS = {
    restaurants: "Restaurants",
    cafes: "Cafés",
    medical: "Medical",
    education: "Education",
    other: "Other Projects",
  };
  const DEFAULT_EGYPT_CATEGORIES = [
    { id: "restaurants", label: "مطاعم", enLabel: "Restaurants" },
    { id: "cafes", label: "كافيهات", enLabel: "Cafés" },
    { id: "medical", label: "طبي", enLabel: "Medical" },
    { id: "education", label: "تعليم ومدرسين", enLabel: "Education" },
    { id: "other", label: "مشاريع أخرى", enLabel: "Other Projects" },
  ];
  const DEFAULT_MARKETS = [
    { id: "saudi", label: "القطاع السعودي" },
    { id: "egypt", label: "القطاع المصري" },
  ];
  let EGYPT_CATEGORIES = [...DEFAULT_EGYPT_CATEGORIES];
  let projectCategories = {}; // Saved multi-category memberships keyed by existing project ID.
  let MARKET_LABELS = {
    saudi: "القطاع السعودي",
    egypt: "القطاع المصري",
  };

  // GitHub-backed static CMS snapshot, published by Vercel on every saved commit.
  // This response must be authoritative, including when brands is [].
  const loadPublicCms = async () => {
    // The original GitHub web upload accidentally flattened data/cms.json to /cms.json.
    // Prefer the canonical path used by the admin CMS, but recover the imported 26 projects
    // from the root-level snapshot rather than showing empty sections.
    for (const path of ["data/cms.json", "cms.json"]) {
      try {
        const response = await fetch(path, { cache: "no-store" });
        if (!response.ok) continue;
        const document = await response.json();
        if (Array.isArray(document.brands)) return document;
      } catch (error) {
        console.warn(`Failed to load Core Media CMS from ${path}`, error);
      }
    }
    throw new Error("تعذر تحميل بيانات المشروعات من data/cms.json أو cms.json");
  };

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
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;");


  const isVideoPath = (path) =>
    Boolean(window.cmYouTube?.parse(path)) || /\.(mp4|mov|avi|webm)(?:[?#].*)?$/i.test(String(path || "").trim());

  const inferMediaType = (path, fallback = "design") =>
    isVideoPath(path) ? "video" : fallback;

  const normalizeMediaItem = (m) => ({
    type: m?.type === "video" || isVideoPath(m?.file) ? "video" : "design",
    file: String(m?.file || "").trim(),
    title: String(m?.title || "").trim(),
    orientation: ["portrait", "landscape"].includes(m?.orientation) ? m.orientation : "auto",
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

  const applySiteContent = (content) => {
    if (!content || typeof content !== "object") return;
    const hero = content.hero || {};
    setText('[data-cm="hero-badge"]', hero.badge);
    setText('[data-cm="hero-highlight"]', hero.highlight);
    setText('[data-cm="hero-subtitle"]', hero.subtitle);
    setText('[data-cm="hero-cta-primary"]', hero.ctaPrimary);
    setText('[data-cm="hero-cta-secondary"]', hero.ctaSecondary);
    setText('[data-cm="hero-quote"]', hero.quote);
    setText('[data-cm="hero-quote-caption"]', hero.quoteCaption);
    if (Array.isArray(hero.metrics)) {
      hero.metrics.forEach((metric, i) => {
        setText(`[data-cm="metric-${i}-number"]`, metric.number);
        setText(`[data-cm="metric-${i}-label"]`, metric.label);
      });
    }
    const introTrigger = document.getElementById("cm-intro-video-trigger");
    if (introTrigger) {
      const videoUrl = cleanIntroVideoUrl(hero.introVideoUrl);
      introTrigger.hidden = !videoUrl;
      if (videoUrl) introTrigger.setAttribute("data-file", videoUrl);
      else introTrigger.removeAttribute("data-file");
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
    const guide = sectors.guide || {};
    setText('[data-cm="guide-eyebrow"]', guide.eyebrow);
    setText('[data-cm="guide-heading"]', guide.heading);
    setText('[data-cm="guide-highlight"]', guide.highlight);
    setText('[data-cm="guide-description"]', guide.description);
    setText('[data-cm="guide-links-label"]', guide.linksLabel);
    if (/^#[0-9a-f]{6}$/i.test(guide.accentColor || "")) {
      document.documentElement.style.setProperty("--cm-guide-accent", guide.accentColor);
    }
    if (/^#[0-9a-f]{6}$/i.test(guide.backgroundColor || "")) {
      document.documentElement.style.setProperty("--cm-guide-bg", guide.backgroundColor);
    }
    projectCategories = sectors.projectCategories && typeof sectors.projectCategories === "object" && !Array.isArray(sectors.projectCategories)
      ? sectors.projectCategories : {};
    if (Array.isArray(sectors.egyptCategories) && sectors.egyptCategories.length) {
      EGYPT_CATEGORIES = sectors.egyptCategories
        .map((c) => ({
          id: String(c.id || "").trim(),
          label: (String(c.id || "").trim() === "medical" && ["ميديكل", "ميديكال"].includes(String(c.label || "").trim()))
            ? "طبي" : String(c.label || "").trim(),
          // Old site settings have no enLabel; use safe defaults without changing the database.
          enLabel: String(c.enLabel ?? DEFAULT_EN_CATEGORY_LABELS[c.id] ?? "").trim(),
          icon: String(c.icon || c.id || "other"),
          visible: c.visible !== false,
          description: String(c.description || ""),
          tagline: String(c.tagline || ""),
          coverUrl: String(c.coverUrl || ""),
        }))
        .filter((c) => c.id && c.label);
    } else {
      EGYPT_CATEGORIES = [...DEFAULT_EGYPT_CATEGORIES];
    }
    // Upgrade older default sets to show the Education category without overriding customized lists.
    if (EGYPT_CATEGORIES.map((c) => c.id).join(",") === "restaurants,cafes,medical,other") {
      EGYPT_CATEGORIES.splice(3, 0, { id: "education", label: "تعليم ومدرسين", enLabel: "Education" });
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

  const sortBrands = (brands) =>
    [...brands].sort((a, b) => {
      const ao = typeof a.sortOrder === "number" ? a.sortOrder : 0;
      const bo = typeof b.sortOrder === "number" ? b.sortOrder : 0;
      if (ao !== bo) return ao - bo;
      return String(a.name || "").localeCompare(String(b.name || ""), "ar");
    });

  const mediaByType = (brand, type) =>
    (brand.media || []).filter((m) => (m.type || "design") === type && m.file);

  const renderTags = (items, prefix) =>
    items
      .map((m, i) => {
        const label = m.title || `${prefix} ${i + 1}`;
        const orientation = m.orientation || "auto";
        return `<span class="cm-tag" data-file="${escAttr(m.file)}" data-orientation="${escAttr(orientation)}">${escAttr(label)}</span>`;
      })
      .join("");

  const buildCardHtml = (brand) => {
    const designs = mediaByType(brand, "design");
    const videos = mediaByType(brand, "video");
    const dataImages = designs.map((m) => m.file).join("|");
    const dataVideos = videos.map((m) => m.file).join("|");
    const dataVideoOrientations = videos.map((m) => m.orientation || "auto").join("|");
    const hasDesign = designs.length > 0;
    const hasVideo = videos.length > 0;
    const category = [hasDesign ? "design" : "", hasVideo ? "video" : ""]
      .filter(Boolean)
      .join(" ");

    const cover = (brand.coverUrl || "").trim();
    const fallbackThumbnail = videos.map((m) => window.cmYouTube?.thumbnail(m.file)).find(Boolean) || "";
    const thumbnail = cover || fallbackThumbnail;
    const hasPlaylist = videos.some((m) => window.cmYouTube?.parse(m.file)?.kind === "playlist");
    const thumbHtml = thumbnail
      ? `<img src="${escAttr(thumbnail)}" alt="${escAttr(brand.name)}" loading="lazy" /><span class="cm-portfolio-thumb-label">${escAttr(brand.name)}</span>`
      : hasPlaylist
        ? `<span class="cm-playlist-card-cover"><span class="cm-playlist-card-icon" aria-hidden="true">▶</span><span>${escAttr(brand.name)}</span><small>PLAYLIST · YOUTUBE</small></span>`
        : `<span>${escAttr(brand.name)}</span>`;

    return `<article class="cm-portfolio-card" data-category="${category}" data-market="${brand.market}" data-images="${escAttr(dataImages)}" data-videos="${escAttr(dataVideos)}" data-video-orientations="${escAttr(dataVideoOrientations)}" data-aos="fade-up">
      <div class="cm-portfolio-thumb ${thumbnail ? "has-cover" : hasPlaylist ? "placeholder-video cm-playlist-cover" : "placeholder-video"}">
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

  // The portfolio is a dedicated category experience, never an "all projects" page.
  // The existing egyptCategory property is retained for compatibility with migrated projects;
  // it now represents the business category for BOTH Egyptian and Saudi brands.
  const categoryIdFor = (brand) => {
    const id = brand.egyptCategory || "other";
    return EGYPT_CATEGORIES.some((category) => category.id === id) ? id : "other";
  };
  const categoryIcons = {
    medical: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v5a6 6 0 0 0 12 0V3M6 3H4m14 0h2M12 14v2a4 4 0 0 0 8 0v-1"/><circle cx="20" cy="13" r="2"/></svg>',
    restaurants: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M17 21V3c-3 2-4 6-4 10h4"/></svg>',
    cafes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h14v5a7 7 0 0 1-14 0V9ZM17 10h2a3 3 0 0 1 0 6h-3M3 21h16M8 3v3m4-3v3"/></svg>',
    education: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5-10-5Zm4 3v5c4 3 8 3 12 0v-5M22 9v7"/></svg>',
    other: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2ZM19 18l.8 1.2L21 20l-1.2.8L19 22l-.8-1.2L17 20l1.2-.8L19 18Z"/></svg>',
    beauty: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 9 9l-6 3 6 3 3 6 3-6 6-3-6-3-3-6Z"/></svg>',
    retail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16l-1 11H5L4 10Zm0 0 2-7h12l2 7M9 10V7m6 3V7"/></svg>',
    realestate: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v10H3V11Zm6 10v-7h6v7"/></svg>',
    fitness: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8v8M2 9v6m6-9v12m8-12v12m3-10v8m3-7v6M8 12h8"/></svg>',
    tech: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9V9Zm3-8v3m0 16v3M1 12h3m16 0h3"/></svg>',
    cars: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-1-5 3-6h10l3 6-1 5H5Zm-1-5h16M7 16v3m10-3v3M7 14h.01M17 14h.01"/></svg>',
    law: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M5 6h14M4 6l-3 6h6L4 6Zm16 0-3 6h6l-3-6ZM6 21h12"/></svg>',
    events: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-10 4 1 2 3 .3-2 2 .5 3-2.5-1.5L8 22l.5-3-2-2 3-.3 1.5-2Z"/></svg>',
    hotel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V6h18v15M8 6V3h8v3M2 21h20M8 10h2m4 0h2m-8 4h2m4 0h2m-6 7v-4h4v4"/></svg>',
    playlists: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16M4 9h16M4 13h7m2 2 7 4-7 4v-8Z"/></svg>',
  };
  const categoryArrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>';
  const categoryIconFor = (category) => categoryIcons[category?.icon] || categoryIcons[category?.id] || categoryIcons.other;
  const safeImageUrl = (url) => {
    const value = String(url || "").trim();
    if (!value || /[\x00-\x1f]/.test(value) || /^(javascript|data|vbscript):/i.test(value)) return "";
    return /^(https?:\/\/|\/|[\w.\u0600-\u06ff#%-])/i.test(value) ? value : "";
  };
  const brandInCategory = (brand, categoryId) => {
    if (Object.prototype.hasOwnProperty.call(projectCategories, brand.id) && Array.isArray(projectCategories[brand.id])) {
      return projectCategories[brand.id].includes(categoryId);
    }
    return categoryIdFor(brand) === categoryId;
  };
  const visibleCategories = () => EGYPT_CATEGORIES.filter((item) => item.visible !== false);
  const gridEl = document.getElementById("category-grid");
  const screenEl = document.getElementById("category-screen");
  const backButton = document.getElementById("back-to-guide");
  const resultsBar = document.getElementById("category-results-bar");
  let portfolioData = [];
  let activeCategory = null;
  const pendingPlaylistsByCategory = new Map();
  const failedPlaylistsByCategory = new Map();
  const refreshVisibleCategory = () => {
    renderCategoryGuide();
    if (activeCategory) {
      const category = visibleCategories().find(entry => entry.id === activeCategory);
      if (category) renderSelectedCategory(category);
    }
  };
  const discoverPlaylistVideos = async (brand, item, alreadyPending = false) => {
    const cat = categoryIdFor(brand);
    if (!alreadyPending) pendingPlaylistsByCategory.set(cat, (pendingPlaylistsByCategory.get(cat) || 0) + 1);
    refreshVisibleCategory();
    try {
      const videos = await window.cmPlaylistLoader.getVideos(item.file);
      const cards = window.cmPlaylistLoader.asPortfolioBrands(brand, item, videos);
      portfolioData = sortBrands([...portfolioData, ...cards]);
    } catch (error) {
      console.error('Unable to expand YouTube playlist:', item.file, error);
      const errors = failedPlaylistsByCategory.get(cat) || [];
      errors.push({ name: brand.name, url: item.file });
      failedPlaylistsByCategory.set(cat, errors);
    } finally {
      pendingPlaylistsByCategory.set(cat, Math.max(0, (pendingPlaylistsByCategory.get(cat) || 1) - 1));
      refreshVisibleCategory();
    }
  };

  const renderCategoryGuide = () => {
    if (!gridEl) return;
    gridEl.innerHTML = visibleCategories().map((category, index) => {
      const count = portfolioData.filter((brand) => brandInCategory(brand, category.id)).length;
      const cover = safeImageUrl(category.coverUrl);
      return `<button type="button" class="cm-category-choice ${cover ? "cm-category-has-cover" : ""}" data-select-category="${escAttr(category.id)}" style="--choice-index:${index}">
        ${cover ? `<img class="cm-category-choice-cover" src="${escAttr(cover)}" alt="" loading="lazy" />` : ""}
        <span class="cm-category-choice-top"><span class="cm-category-choice-icon">${categoryIconFor(category)}</span><span class="cm-category-choice-num">${String(index+1).padStart(2, "0")}</span></span>
        <span class="cm-category-choice-title"><span class="cm-category-choice-name" lang="ar">${escAttr(category.label)}</span>${category.enLabel ? `<span class="cm-category-choice-english" lang="en" dir="ltr">${escAttr(category.enLabel)}</span>` : ""}</span>
        <span class="cm-category-choice-bottom"><span>${escAttr(category.tagline || (count ? `${count} مشروع` : "استكشف القسم"))}</span><span class="cm-category-choice-arrow">${categoryArrow}</span></span>
      </button>`;
    }).join("");
  };

  const renderSelectedCategory = (category) => {
    const groupsRoot = document.getElementById("portfolio-groups");
    if (!groupsRoot) return;
    const brands = portfolioData.filter((brand) => brandInCategory(brand, category.id));
    const waiting = (pendingPlaylistsByCategory.get(category.id) || 0) > 0;
    const failures = failedPlaylistsByCategory.get(category.id) || [];
    const loadingMarkup = waiting ? '<div class="cm-playlist-status" role="status">جاري تحميل فيديوهات القسم من يوتيوب...</div>' : '';
    const errorMarkup = failures.length ? `<div class="cm-playlist-status cm-playlist-warning" role="status">تعذر جلب فيديوهات بعض القوائم من يوتيوب. تأكد من أن روابط القوائم صحيحة وأنها عامة أو غير مدرجة وتسمح بالتضمين. ${failures.map(f => `<a href="${escAttr(f.url)}" target="_blank" rel="noopener noreferrer">${escAttr(f.name)} ↗</a>`).join(' · ')}</div>` : '';
    groupsRoot.innerHTML = brands.length
      ? `<div class="cm-category-projects-grid">${brands.map(buildCardHtml).join("")}</div>${loadingMarkup}${errorMarkup}`
      : loadingMarkup || errorMarkup || `<div class="cm-category-empty"><span class="cm-category-empty-icon">${categoryIconFor(category)}</span><h3>بنجهز أعمال القسم ده</h3><p>لسه مفيش مشاريع معروضة هنا. تقدر ترجع وتستكشف قسم تاني.</p><button type="button" class="cm-empty-back" id="category-empty-back">اختار قسم تاني</button></div>`;
    setText('[data-cm="portfolio-title"]', `أعمال ${category.label}`);
    setText('[data-cm="portfolio-subtitle"]', category.description || `نماذج من شغل Core Media في مجال ${category.label}، مختارة علشان تشوف التفاصيل اللي تهمك.`);
    if (resultsBar) resultsBar.textContent = brands.length ? `${brands.length} مشروع في هذا القسم` : "";
    if (window.AOS) window.AOS.refresh();
  };

  // Single-view navigation: a business portfolio OR a dedicated company page.
  // We keep all existing CMS-managed sections, but only show the requested view.
  const informationalViews = new Set(["home", "about", "contact"]);
  const pageTitles = {
    guide: "اختيار القسم",
    home: "الرئيسية",
    about: "من نحن",
    contact: "تواصل معنا",
  };
  const setUrl = (view, id, changeHistory) => {
    if (!changeHistory) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("view");
    if (view === "category") url.searchParams.set("category", id);
    else if (view !== "guide") url.searchParams.set("view", view);
    const newUrl = `${url.pathname}${url.search}`;
    if (`${window.location.pathname}${window.location.search}` !== newUrl) {
      // Some browsers restrict history changes when previewing via file://.
      // Navigation must still work locally even when pushState is blocked.
      try { window.history.pushState({ view, category: id || null }, "", newUrl); } catch (_) {}
    }
  };
  const setCurrentView = (view) => {
    document.body.classList.remove("cm-gateway-mode", "cm-category-mode", "cm-page-mode");
    document.body.removeAttribute("data-current-view");
    if (view === "guide") document.body.classList.add("cm-gateway-mode");
    else if (view === "category") document.body.classList.add("cm-category-mode");
    else {
      document.body.classList.add("cm-page-mode");
      document.body.setAttribute("data-current-view", view);
    }
    if (view === "guide") screenEl?.removeAttribute("aria-hidden");
    else screenEl?.setAttribute("aria-hidden", "true");
    document.querySelector(".cm-nav")?.classList.remove("is-open");
    document.querySelectorAll(".cm-nav [data-cm-view]").forEach((link) => {
      const selected = link.getAttribute("data-cm-view") === view;
      if (selected) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    const label = view === "category" ? `أعمال ${EGYPT_CATEGORIES.find((entry) => entry.id === activeCategory)?.label || "القسم"}` : pageTitles[view];
    document.title = `${label || "Core Media"} | Core Media & Production`;
    window.scrollTo(0, 0);
    if (window.AOS) requestAnimationFrame(() => window.AOS.refresh());
  };

  const showCategory = (id, changeHistory = true) => {
    const category = visibleCategories().find((item) => item.id === id);
    if (!category) return showCategoryGuide(changeHistory);
    activeCategory = category.id;
    renderSelectedCategory(category);
    setCurrentView("category");
    setUrl("category", category.id, changeHistory);
  };

  const showCategoryGuide = (changeHistory = true) => {
    activeCategory = null;
    setCurrentView("guide");
    setUrl("guide", null, changeHistory);
  };

  const showInfoPage = (view, changeHistory = true) => {
    if (!informationalViews.has(view)) return showCategoryGuide(changeHistory);
    setCurrentView(view);
    setUrl(view, null, changeHistory);
  };

  const restoreViewFromUrl = () => {
    const url = new URL(window.location.href);
    const category = url.searchParams.get("category");
    const view = url.searchParams.get("view");
    if (category && visibleCategories().some((item) => item.id === category)) showCategory(category, false);
    else if (informationalViews.has(view)) showInfoPage(view, false);
    else showCategoryGuide(false);
  };

  gridEl?.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-select-category]");
    if (choice) showCategory(choice.getAttribute("data-select-category"));
  });
  backButton?.addEventListener("click", () => showCategoryGuide());
  document.getElementById("portfolio-groups")?.addEventListener("click", (event) => {
    if (event.target.closest("#category-empty-back")) showCategoryGuide();
  });
  document.addEventListener("click", (event) => {
    const routeLink = event.target.closest("a[data-cm-view]");
    if (routeLink) {
      event.preventDefault();
      const view = routeLink.getAttribute("data-cm-view");
      if (view === "guide") showCategoryGuide();
      else if (view === "category" && activeCategory) showCategory(activeCategory);
      else showInfoPage(view);
      return;
    }
    // Legacy CTA anchors still route to a single page instead of jumping to hidden content.
    const hashLink = event.target.closest('a[href^="#"]');
    if (!hashLink) return;
    const hash = hashLink.getAttribute("href");
    if (["#home", "#about", "#contact", "#portfolio", "#services"].includes(hash)) {
      event.preventDefault();
      if (hash === "#portfolio") {
        if (activeCategory) showCategory(activeCategory);
        else showCategoryGuide();
      } else {
        showInfoPage(hash === "#services" ? "home" : hash.substring(1));
        if (hash === "#services") requestAnimationFrame(() => document.getElementById("services")?.scrollIntoView());
      }
    }
  });
  window.addEventListener("popstate", restoreViewFromUrl);

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
  const getIntroVideoPath = () => cleanIntroVideoUrl(introVideoTrigger?.getAttribute("data-file"));
  let introVideoOpen = false;
  const videoProtectionAttrs =
    'preload="auto" playsinline webkit-playsinline controls controlslist="nodownload noplaybackrate" disablepictureinpicture disableremoteplayback';

  const videoFallbackHtml =
    '<p class="cm-lightbox-video-fallback">الصوت شغال والصورة مش ظاهرة — غالبًا الملف نفسه بصيغة HEVC (حتى لو اترفح من اللاب). من لوحة الإدارة: احذف القاطعة وارفعها تاني واستنى رسالة التحويل لـ H.264.</p>';

  const buildVideoHtml = (src, extraAttrs = "", orientation = "auto") => {
    const youtube = window.cmYouTube?.parse(src);
    if (youtube) {
      const isPortrait = orientation === "portrait" || (orientation !== "landscape" && youtube.short);
      const autoplay = /\bautoplay\b/.test(extraAttrs);
      const muted = /\bmuted\b/.test(extraAttrs);
      const embed = window.cmYouTube.embed(src, { autoplay, mute: muted });
      const isPlaylist = youtube.kind === "playlist";
      const originalUrl = window.cmYouTube.canonical(src);
      return `<div class="cm-lightbox-media-frame cm-lightbox-media-frame-video cm-youtube-frame ${isPortrait ? "is-portrait" : "is-landscape"} ${isPlaylist ? "cm-youtube-playlist-frame" : ""}">
        <iframe class="cm-youtube-player" src="${escAttr(embed)}" title="${isPlaylist ? "قائمة فيديوهات Core Media على يوتيوب" : "فيديو من قناة Core Media على يوتيوب"}" loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
        ${isPlaylist ? `<a class="cm-playlist-open-youtube" href="${escAttr(originalUrl)}" rel="noopener noreferrer" target="_blank">لو القائمة مش بتشتغل هنا، افتحها على يوتيوب ↗</a>` : ""}
      </div>`;
    }
    return `<div class="cm-lightbox-media-frame cm-lightbox-media-frame-video">
      <video class="cm-lightbox-media cm-lightbox-video" ${videoProtectionAttrs} ${extraAttrs}>
        <source src="${escAttr(src)}" type="video/mp4" />
      </video>
      ${videoFallbackHtml}
    </div>`;
  };

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
    const orientations = (card.getAttribute("data-video-orientations") || "").split("|");
    const parts = [];
    images.forEach((src) => {
      parts.push(
        `<img src="${escAttr(src)}" alt="" class="cm-lightbox-media cm-lightbox-image" decoding="async" draggable="false" loading="eager" />`
      );
    });
    videos.forEach((src, i) => {
      parts.push(buildVideoHtml(src, i === 0 ? "autoplay" : "", orientations[i] || "auto"));
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

  const openSingleMedia = (filePath, title, orientation = "auto") => {
    const mediaHtml = isVideoPath(filePath)
      ? buildVideoHtml(filePath, "autoplay", orientation)
      : `<img src="${escAttr(filePath)}" alt="" class="cm-lightbox-media cm-lightbox-image" decoding="async" draggable="false" loading="eager" />`;
    openLightbox(title, mediaHtml);
  };

  const closeLightbox = (reason = "manual") => {
    if (!lightbox) return;
    lightbox.querySelectorAll("video").forEach((v) => v.pause());
    // Removing iframe from the DOM stops YouTube audio when the dialog is closed.
    if (lightboxText) lightboxText.replaceChildren();
    lightbox.classList.remove("is-open");
    lightbox.classList.remove("is-intro-open");
    document.body.style.overflow = "";
    introVideoOpen = false;
  };

  const openCompanyIntro = ({ autoOpen = false } = {}) => {
    const introVideoPath = getIntroVideoPath();
    if (!introVideoPath) return;

    const isYouTubeIntro = Boolean(window.cmYouTube?.parse(introVideoPath));
    let introHtml = buildVideoHtml(introVideoPath, autoOpen ? "autoplay muted" : "autoplay");
    if (isYouTubeIntro) {
      introHtml = introHtml.replace('cm-youtube-frame ', 'cm-youtube-frame cm-intro-video-frame ');
    } else {
      introHtml = introHtml.replace(
        'cm-lightbox-media-frame-video"',
        'cm-lightbox-media-frame-video cm-intro-video-frame"'
      ).replace(
        'cm-lightbox-video"',
        'cm-lightbox-video cm-intro-video"'
      );
    }
    openLightbox(
      introVideoTrigger?.textContent?.trim() || "Video.Core",
      introHtml,
      { description: autoOpen ? "فيديو تعريفي لشركة Core Media." : "فيديو تعريفي لشركة Core Media." }
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
        openSingleMedia(filePath, title, tag.getAttribute("data-orientation") || "auto");
        return;
      }
      const card = e.target.closest(".cm-portfolio-card");
      if (!card) return;
      const title = card.querySelector(".cm-portfolio-info h3")?.textContent || "مشروع";
      openLightbox(title, buildMediaContent(card));
    });
  }

  (async () => {
    try {
      const cms = await loadPublicCms();
      if (cms.site && typeof cms.site === "object") applySiteContent(cms.site);
      // CMS state is authoritative. Keep normal portfolio items as-is.
      // Each playlist is expanded asynchronously into one card per real YouTube video.
      const brands = (cms.brands || []).map(normalizeBrand);
      const playlistJobs = [];
      const regularBrands = [];
      for (const brand of brands) {
        const playlistItems = (brand.media || []).filter(item => window.cmYouTube?.parse(item.file)?.kind === 'playlist');
        for (const item of playlistItems) playlistJobs.push({ brand, item });
        const ordinaryMedia = (brand.media || []).filter(item => window.cmYouTube?.parse(item.file)?.kind !== 'playlist');
        if (ordinaryMedia.length || !playlistItems.length) regularBrands.push({ ...brand, media: ordinaryMedia });
      }
      portfolioData = sortBrands(regularBrands);
      // Establish loading state before showing any category; no misleading empty section.
      for (const { brand } of playlistJobs) {
        const cat = categoryIdFor(brand);
        pendingPlaylistsByCategory.set(cat, (pendingPlaylistsByCategory.get(cat) || 0) + 1);
      }
      renderCategoryGuide();
      document.getElementById("portfolio-groups")?.replaceChildren();
      preloaderPromise.then(restoreViewFromUrl);
      for (const { brand, item } of playlistJobs) {
        // Separate requests: discovering one playlist cannot hide another category.
        discoverPlaylistVideos(brand, item, true);
      }
    } catch (error) {
      console.error("Unable to load the published CMS snapshot", error);
      portfolioData = [];
      renderCategoryGuide();
      document.getElementById("portfolio-groups")?.replaceChildren();
      preloaderPromise.then(restoreViewFromUrl);
    }
  })();
});
