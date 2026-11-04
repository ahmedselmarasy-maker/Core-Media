/* Core Media: seamless, continuously moving portfolio strips without navigation buttons. */
(() => {
  "use strict";
  const instances = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const SPEED_PX_PER_SECOND = 40; // Slightly quicker than the previous 25px/s.
  let lastFrame = 0;
  let running = false;

  // An exact cycle contains every original card plus its following flex gap.
  // The next cloned cycle is pixel-for-pixel identical, so wrapping has no visual seam.
  function wrap(instance) {
    const { viewport, unit } = instance;
    if (!unit) return;
    let distance = -viewport.scrollLeft;
    if (distance < 0 || distance >= unit) {
      distance = ((distance % unit) + unit) % unit;
      viewport.scrollLeft = -distance;
    }
  }

  function animate(now) {
    const elapsed = lastFrame ? Math.min(now - lastFrame, 60) : 0;
    lastFrame = now;
    if (elapsed > 0 && !document.hidden && !reducedMotion.matches &&
        document.body.classList.contains("cm-category-mode") &&
        !document.querySelector(".cm-lightbox.is-open")) {
      for (const instance of instances) {
        const { viewport, unit, hovered, focused, interactingUntil } = instance;
        if (!viewport.isConnected || !unit || hovered || focused || now < interactingUntil) continue;
        const bounds = viewport.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) continue;
        // Scroll through repeated content rather than jumping to a first/last slide.
        const distance = ((-viewport.scrollLeft + SPEED_PX_PER_SECOND * elapsed / 1000) % unit + unit) % unit;
        viewport.scrollLeft = -distance;
      }
    }
    window.requestAnimationFrame(animate);
  }

  function setup(element) {
    const viewport = element.querySelector(".cm-work-carousel-viewport");
    const track = element.querySelector(".cm-work-carousel-track");
    if (!viewport || !track) return null;
    const originals = Array.from(track.children);
    originals.forEach(card => {
      card.removeAttribute("data-aos");
      card.removeAttribute("data-aos-delay");
      card.classList.add("aos-animate");
    });
    const instance = { element, viewport, track, originals, unit: 0,
      hovered: false, focused: false, interactingUntil: 0, observer: null };
    let lastWidth = 0;

    function layout() {
      if (!element.isConnected) return;
      const availableWidth = viewport.clientWidth;
      if (!availableWidth || (availableWidth === lastWidth && instance.unit)) return;
      lastWidth = availableWidth;
      track.querySelectorAll(".cm-work-clone").forEach(node => node.remove());
      instance.unit = 0;
      viewport.scrollLeft = 0;
      if (!originals.length) {
        element.classList.add("is-static");
        return;
      }
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const unit = originals.reduce((sum, card) =>
        sum + card.getBoundingClientRect().width + gap, 0);
      if (!Number.isFinite(unit) || unit <= 0) {
        element.classList.add("is-static");
        return;
      }
      // Keep enough cards beyond the first cycle for a viewport of any width.
      // A single original item is repeated too, without any empty gap or endpoint.
      instance.unit = unit;
      element.classList.remove("is-static");
      const copyCount = Math.max(1, Math.ceil(availableWidth / unit) + 1);
      for (let cycle = 0; cycle < copyCount; cycle++) {
        for (const card of originals) {
          const clone = card.cloneNode(true);
          clone.classList.add("cm-work-clone");
          clone.setAttribute("aria-hidden", "true");
          clone.setAttribute("tabindex", "-1");
          clone.querySelectorAll("a,button,[tabindex]").forEach(node => node.setAttribute("tabindex", "-1"));
          track.appendChild(clone);
        }
      }
    }
    if (window.ResizeObserver) {
      instance.observer = new ResizeObserver(layout);
      instance.observer.observe(viewport);
    } else window.addEventListener("resize", layout, { passive: true });
    element.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse") instance.hovered = true;
    });
    element.addEventListener("pointerleave", event => {
      if (event.pointerType === "mouse") instance.hovered = false;
    });
    viewport.addEventListener("focusin", () => { instance.focused = true; });
    viewport.addEventListener("focusout", event => {
      if (!viewport.contains(event.relatedTarget)) instance.focused = false;
    });
    viewport.addEventListener("touchstart", () => {
      instance.interactingUntil = performance.now() + 3000;
    }, { passive: true });
    viewport.addEventListener("touchend", () => {
      instance.interactingUntil = performance.now() + 1800;
      window.setTimeout(() => wrap(instance), 400);
    }, { passive: true });
    viewport.addEventListener("wheel", () => {
      instance.interactingUntil = performance.now() + 1800;
    }, { passive: true });
    // Manual swipes can pass the end of one repetition; silently normalize
    // after the gesture, without a visible first/last slide.
    viewport.addEventListener("scroll", () => {
      if (instance.interactingUntil > performance.now()) return;
      wrap(instance);
    }, { passive: true });
    layout();
    return instance;
  }

  window.cmPortfolioCarousel = {
    mount(root) {
      for (const instance of instances) instance.observer?.disconnect();
      instances.length = 0;
      for (const element of root.querySelectorAll(".cm-work-carousel")) {
        const instance = setup(element);
        if (instance) instances.push(instance);
      }
      if (!running) {
        running = true;
        window.requestAnimationFrame(animate);
      }
    }
  };
})();
