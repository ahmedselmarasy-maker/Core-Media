/* Core Media: accessible, continuously moving galleries with native touch scrolling. */
(() => {
  "use strict";
  const instances = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastFrame = 0;
  let running = false;

  function animate(now) {
    const elapsed = lastFrame ? Math.min(now - lastFrame, 60) : 0;
    lastFrame = now;
    if (elapsed > 0 && !document.hidden && !reduceMotion.matches &&
        document.body.classList.contains("cm-category-mode") &&
        !document.querySelector(".cm-lightbox.is-open")) {
      for (const instance of instances) {
        const { viewport, unit, paused, hovered, focused, interactingUntil } = instance;
        if (!viewport.isConnected || !unit || paused || hovered || focused || now < interactingUntil) continue;
        const bounds = viewport.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) continue;
        viewport.scrollLeft -= (25 * elapsed) / 1000;
        if (viewport.scrollLeft < -unit) viewport.scrollLeft += unit;
      }
    }
    window.requestAnimationFrame(animate);
  }

  function setup(element) {
    const viewport = element.querySelector(".cm-work-carousel-viewport");
    const track = element.querySelector(".cm-work-carousel-track");
    const originals = Array.from(track.children);
    // Carousel cards are continually visible; scroll reveal effects must not hide repeated slides.
    originals.forEach(card => { card.removeAttribute("data-aos"); card.removeAttribute("data-aos-delay"); card.classList.add("aos-animate"); });
    const instance = { element, viewport, track, originals, unit:0, paused:false, hovered:false, focused:false, interactingUntil:0, observer:null };
    const pause = element.querySelector('[data-work-control="pause"]');
    const previous = element.querySelector('[data-work-control="previous"]');
    const next = element.querySelector('[data-work-control="next"]');
    let lastWidth = 0;
    function layout() {
      if (!element.isConnected) return;
      const availableWidth = viewport.clientWidth;
      if (!availableWidth || availableWidth === lastWidth) return;
      lastWidth = availableWidth;
      track.querySelectorAll(".cm-work-clone").forEach(node => node.remove());
      instance.unit = 0;
      viewport.scrollLeft = 0;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const unit = originals.reduce((sum,node) => sum + node.getBoundingClientRect().width + gap, 0);
      if (originals.length < 2 || unit <= 0) {
        element.classList.add("is-static");
        return;
      }
      element.classList.remove("is-static");
      instance.unit = unit;
      const copies = Math.max(2, Math.ceil(availableWidth / unit) + 2);
      for (let copy = 0; copy < copies; copy += 1) {
        for (const card of originals) {
          const clone = card.cloneNode(true);
          clone.classList.add("cm-work-clone");
          clone.setAttribute("aria-hidden","true");
          clone.setAttribute("tabindex","-1");
          clone.querySelectorAll("a,button,[tabindex]").forEach(child => child.setAttribute("tabindex","-1"));
          track.appendChild(clone);
        }
      }
    }
    if (window.ResizeObserver) {
      instance.observer = new ResizeObserver(layout);
      instance.observer.observe(viewport);
    } else window.addEventListener("resize", layout, {passive:true});
    element.addEventListener("pointerenter",event=>{if(event.pointerType==="mouse")instance.hovered=true;});
    element.addEventListener("pointerleave",event=>{if(event.pointerType==="mouse")instance.hovered=false;});
    viewport.addEventListener("focusin",()=>{instance.focused=true;});
    viewport.addEventListener("focusout",event=>{if(!viewport.contains(event.relatedTarget)) instance.focused=false;});
    viewport.addEventListener("touchstart",()=>{instance.interactingUntil=performance.now()+3000;},{passive:true});
    viewport.addEventListener("touchend",()=>{instance.interactingUntil=performance.now()+1800;},{passive:true});
    viewport.addEventListener("wheel",()=>{instance.interactingUntil=performance.now()+1800;},{passive:true});
    element.addEventListener("click",event=>{
      const button=event.target.closest("[data-work-control]");
      if(!button) return;
      const action=button.dataset.workControl;
      if(action==="pause"){
        instance.paused=!instance.paused;
        pause.setAttribute("aria-pressed",String(instance.paused));
        pause.setAttribute("aria-label",instance.paused?"تشغيل الحركة":"إيقاف الحركة");
        pause.title=instance.paused?"تشغيل الحركة":"إيقاف الحركة";
        pause.innerHTML=instance.paused?"▶ <span>تشغيل الحركة</span>":"❚❚ <span>إيقاف الحركة</span>";
      } else if(instance.unit){
        instance.interactingUntil=performance.now()+2400;
        const stride=originals[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(track).columnGap)||0);
        if(action==="previous" && viewport.scrollLeft > -stride) viewport.scrollLeft-=instance.unit;
        viewport.scrollBy({left: action==="next"?-stride:stride,behavior:"smooth"});
      }
    });
    layout();
    return instance;
  }

  window.cmPortfolioCarousel = {
    mount(root) {
      for(const inst of instances) inst.observer?.disconnect();
      instances.length=0;
      for(const element of root.querySelectorAll(".cm-work-carousel")) instances.push(setup(element));
      if(!running){
        running=true;
        window.requestAnimationFrame(animate);
      }
    }
  };
})();
