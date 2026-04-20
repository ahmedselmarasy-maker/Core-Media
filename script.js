document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "cmPortfolioDataV1";
  const WHATSAPP_E164 = "201019132369";
  const EGYPT_CATEGORIES = [
    { id: "restaurants", label: "مطاعم" },
    { id: "cafes", label: "كافيهات" },
    { id: "medical", label: "ميديكل" },
    { id: "other", label: "مشاريع أخرى" },
  ];

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

  const mediaByType = (brand, type) =>
    (brand.media || []).filter((m) => (m.type || "design") === type && m.file);

  const renderTags = (items, prefix) =>
    items
      .map(
        (m, i) =>
          `<span class="cm-tag" data-file="${escAttr(m.file)}">${prefix} ${i + 1}</span>`
      )
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
    return `<article class="cm-portfolio-card" data-category="${category}" data-market="${brand.market}" data-images="${escAttr(dataImages)}" data-videos="${escAttr(dataVideos)}">
      <div class="cm-portfolio-thumb placeholder-video">
        <span>${escAttr(brand.name)}</span>
      </div>
      <div class="cm-portfolio-info">
        <h3 class="cm-gradient-text">${escAttr(brand.name)}</h3>
        <div class="cm-portfolio-tags">
          <div class="cm-portfolio-tags-row cm-portfolio-tags-designs">${renderTags(designs, "تصميم")}</div>
          <div class="cm-portfolio-tags-row cm-portfolio-tags-videos">${renderTags(videos, "فيديو")}</div>
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
      const list = egyptBrands.filter((b) => (b.egyptCategory || "other") === cat.id);
      const cards = list.map(buildCardHtml).join("");
      return `<div class="cm-portfolio-group" data-egypt-cat="${cat.id}">
        <div class="cm-portfolio-group-head">
          <h3 class="cm-portfolio-group-title cm-gradient-text">${cat.label}</h3>
        </div>
        <div class="cm-portfolio-grid">${cards}</div>
      </div>`;
    }).join("");

    groupsRoot.innerHTML = `
      <div class="cm-portfolio-market" data-market="saudi">
        <div class="cm-portfolio-group">
          <div class="cm-portfolio-group-head">
            <h3 class="cm-portfolio-group-title cm-gradient-text">القطاع السعودي</h3>
          </div>
          <div class="cm-portfolio-grid">${saudiBrands.map(buildCardHtml).join("")}</div>
        </div>
      </div>
      <div class="cm-portfolio-market" data-market="egypt">
        <div class="cm-portfolio-group-head">
          <h3 class="cm-portfolio-group-title cm-gradient-text">القطاع المصري</h3>
        </div>
        <div class="cm-portfolio-filter-block cm-portfolio-sector-block cm-portfolio-egypt-subfilter-block">
          <span class="cm-portfolio-filter-label">التصنيف</span>
          <div class="cm-portfolio-filters" aria-label="تصفية القطاع المصري">
            <button type="button" class="cm-filter-btn cm-egypt-cat-btn active" data-egypt-cat="all">الكل</button>
            ${EGYPT_CATEGORIES.map(
              (cat) =>
                `<button type="button" class="cm-filter-btn cm-egypt-cat-btn" data-egypt-cat="${cat.id}">${cat.label}</button>`
            ).join("")}
          </div>
        </div>
        <div class="cm-portfolio-market-body">${egyptGroupsHtml}</div>
      </div>
    `;
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
    const market = document.querySelector(".cm-sector-btn.active")?.getAttribute("data-market") || "all";
    document.querySelectorAll(".cm-portfolio-market").forEach((marketBlock) => {
      const blockMarket = marketBlock.getAttribute("data-market") || "";
      marketBlock.style.display = market === "all" || market === blockMarket ? "" : "none";
    });
    applyEgyptCategoryFilter();
  };

  const bindFilterEvents = () => {
    document.querySelectorAll(".cm-sector-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cm-sector-btn").forEach((b) => b.classList.remove("active"));
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

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const brand = document.getElementById("brand")?.value.trim() || "";
      const services = document.getElementById("contact-service")?.selectedOptions?.[0]?.textContent?.trim() || "";
      const message = document.getElementById("message")?.value.trim() || "";
      const lines = [
        "مرحباً Core Media،",
        "",
        `الاسم: ${name}`,
        `البريد: ${email}`,
        brand ? `البراند / الشركة: ${brand}` : "",
        `الخدمة المطلوبة: ${services}`,
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
  const videoProtectionAttrs =
    'preload="metadata" playsinline controls controlslist="nodownload noplaybackrate" disablepictureinpicture disableremoteplayback';

  const buildMediaContent = (card) => {
    const images = (card.getAttribute("data-images") || "").split("|").filter(Boolean);
    const videos = (card.getAttribute("data-videos") || "").split("|").filter(Boolean);
    const parts = [];
    images.forEach((src) => {
      parts.push(
        `<img src="${escAttr(src)}" alt="" class="cm-lightbox-media" decoding="async" draggable="false" loading="eager" />`
      );
    });
    videos.forEach((src, i) => {
      parts.push(
        `<video src="${escAttr(src)}" class="cm-lightbox-media" ${videoProtectionAttrs}${i === 0 ? " autoplay" : ""}></video>`
      );
    });
    return parts.length ? `<div class="cm-lightbox-gallery">${parts.join("")}</div>` : "";
  };

  const openLightbox = (title, mediaHtml) => {
    if (!(lightbox && lightboxTitle && lightboxText)) return;
    lightboxTitle.textContent = title || "مشروع";
    lightboxText.innerHTML = `${mediaHtml}<span class="cm-lightbox-desc">استعرض الوسائط الخاصة بهذا البراند.</span>`;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const openSingleMedia = (filePath, title) => {
    const safe = escAttr(filePath);
    const mediaHtml = isVideoPath(filePath)
      ? `<video src="${safe}" class="cm-lightbox-media" ${videoProtectionAttrs} autoplay></video>`
      : `<img src="${safe}" alt="" class="cm-lightbox-media" decoding="async" draggable="false" loading="eager" />`;
    openLightbox(title, mediaHtml);
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.querySelectorAll("video").forEach((v) => v.pause());
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
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
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("is-open")) closeLightbox();
  });

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

  const data = loadPortfolioData();
  savePortfolioData(data);
  renderPortfolio(data);
  bindFilterEvents();
  applyPortfolioFilters();
});

