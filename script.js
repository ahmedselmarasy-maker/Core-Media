document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const nav = document.querySelector(".cm-nav");
  const toggle = document.querySelector(".cm-nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
      });
    });
  }

  const filterButtons = document.querySelectorAll(".cm-filter-btn");
  const portfolioCards = document.querySelectorAll(".cm-portfolio-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      portfolioCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  const lightbox = document.getElementById("cm-lightbox");
  const lightboxTitle = lightbox?.querySelector(".cm-lightbox-title");
  const lightboxText = lightbox?.querySelector(".cm-lightbox-text");
  const closeBtn = lightbox?.querySelector(".cm-lightbox-close");
  const backdrop = lightbox?.querySelector(".cm-lightbox-backdrop");

  const styleMedia = "width:100%;max-width:100%;height:auto;border-radius:16px;margin-bottom:1rem;display:block;";

  const buildMediaContent = (card) => {
    const imagesStr = card.getAttribute("data-images") || "";
    const videosStr = card.getAttribute("data-videos") || "";
    const singleImage = card.getAttribute("data-image") || "";
    const singleVideo = card.getAttribute("data-video") || "";

    const images = imagesStr ? imagesStr.split("|").filter(Boolean) : (singleImage ? [singleImage] : []);
    const videos = videosStr ? videosStr.split("|").filter(Boolean) : (singleVideo ? [singleVideo] : []);
    const parts = [];

    images.forEach((src) => {
      const safe = (src || "").replace(/"/g, "&quot;");
      parts.push(`<img src="${safe}" alt="" style="${styleMedia}" />`);
    });
    videos.forEach((src, i) => {
      const safe = (src || "").replace(/"/g, "&quot;");
      const autoplay = i === 0 ? " autoplay muted playsinline" : " playsinline";
      parts.push(
        `<video src="${safe}" controls ${autoplay} style="${styleMedia}"></video>`
      );
    });

    if (parts.length) {
      return `<div class="cm-lightbox-gallery">${parts.join("")}</div>`;
    }
    return "";
  };

  const openLightbox = (title, description, mediaHtml) => {
    if (!(lightbox && lightboxTitle && lightboxText)) return;
    lightboxTitle.textContent = title;
    const defaultText =
      "More details about this project will appear here.";
    lightboxText.innerHTML = `${mediaHtml || ""}<span class="cm-lightbox-desc">${
      description || defaultText
    }</span>`;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";

    const firstVideo = lightboxText.querySelector("video");
    if (firstVideo) {
      firstVideo.play?.().catch(() => {});
      const unmuteBtn = document.createElement("button");
      unmuteBtn.type = "button";
      unmuteBtn.className = "cm-video-unmute";
      unmuteBtn.innerHTML = "🔊 Enable sound";
      unmuteBtn.addEventListener("click", () => {
        firstVideo.muted = false;
        unmuteBtn.remove();
      });
      firstVideo.parentNode.insertBefore(unmuteBtn, firstVideo.nextSibling);
    }
  };

  const openSingleMedia = (filePath, title, description) => {
    const isVideo = filePath.toLowerCase().endsWith('.mp4') || filePath.toLowerCase().endsWith('.mov') || filePath.toLowerCase().endsWith('.avi');
    const safe = filePath.replace(/"/g, "&quot;");
    let mediaHtml = "";
    if (isVideo) {
      mediaHtml = `<video src="${safe}" controls autoplay muted playsinline style="${styleMedia}"></video>`;
    } else {
      mediaHtml = `<img src="${safe}" alt="" style="${styleMedia}" />`;
    }
    openLightbox(title, description, mediaHtml);
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }
  if (backdrop) {
    backdrop.addEventListener("click", closeLightbox);
  }

  portfolioCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent || "Project";
      const description = card.querySelector("p")?.textContent || "";
      const mediaHtml = buildMediaContent(card);
      openLightbox(title, description, mediaHtml);
    });
  });

  // Add click listeners to tags
  document.querySelectorAll(".cm-tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card click
      const filePath = tag.getAttribute("data-file");
      if (filePath) {
        const card = tag.closest(".cm-portfolio-card");
        const title = card.querySelector("h3")?.textContent || "Project";
        const description = card.querySelector("p")?.textContent || "";
        openSingleMedia(filePath, title, description);
      }
    });
  });
});

