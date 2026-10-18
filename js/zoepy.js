/* ==========================================================================
   ZOEPY PETSHOP JOGJA — motion layer
   Lenis smooth scroll + GSAP ScrollTrigger. Everything degrades gracefully:
   if a CDN is blocked the page still renders and reads.
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  root.classList.remove("no-js");

  /* ------------------------------------------------------------------ year */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const hasGsap = typeof window.gsap !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  // Nothing below this line is required for the page to be usable.
  if (!hasGsap) {
    root.classList.add("no-gsap");
  }

  /* ------------------------------------------------------- nav + drawer */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  let lastY = window.scrollY;

  function setDrawer(open) {
    if (!nav || !burger) return;
    nav.toggleAttribute("data-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }

  burger?.addEventListener("click", () => setDrawer(!nav.hasAttribute("data-open")));
  drawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setDrawer(false)));

  function onScroll(y) {
    if (!nav) return;
    nav.toggleAttribute("data-stuck", y > 40);
    // Hide the bar when scrolling down past the hero, reveal on the way up.
    const goingDown = y > lastY && y > window.innerHeight * 0.7;
    if (!nav.hasAttribute("data-open")) nav.toggleAttribute("data-hidden", goingDown);
    lastY = y;
  }

  /* --------------------------------------------------------------- lenis */
  let lenis = null;
  if (hasLenis && !reduce) {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    if (hasGsap) {
      lenis.on("scroll", () => {
        window.ScrollTrigger.update();
        onScroll(window.scrollY);
      });
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      lenis.on("scroll", ({ scroll }) => onScroll(scroll));
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  } else {
    window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });
  }

  // In-page anchors go through Lenis so the easing stays consistent.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      setDrawer(false);
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  onScroll(window.scrollY);

  /* ------------------------------------------------- gsap-driven motion */
  if (hasGsap && !reduce) {
    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    // 1 — hero intro.
    // Built with fromTo + clearProps rather than from(): a `from` tween is
    // re-inverted by ScrollTrigger.refresh() (which fires on load), snapping
    // the hero back to its hidden state.
    // Only the landing page has a hero; the sub-pages share this script.
    const heroLines = gsap.utils.toArray(".hero .reveal-line > span");
    if (heroLines.length) {
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro.fromTo(
        heroLines,
        { yPercent: 105 },
        { yPercent: 0, duration: 1.15, stagger: 0.09, clearProps: "transform" },
        0.15
      );
      if (document.querySelector(".hero__meta")) {
        intro.fromTo(".hero__meta", { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.3);
      }
      if (document.querySelector(".hero__lede")) {
        intro.fromTo(
          ".hero__lede",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, clearProps: "transform" },
          0.5
        );
      }
      if (document.querySelector(".hero__actions")) {
        intro.fromTo(
          ".hero__actions",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, clearProps: "transform" },
          0.62
        );
      }
    }

    // 2 — parallax on marked media.
    gsap.utils.toArray("[data-parallax]").forEach((layer) => {
      const amount = parseFloat(layer.dataset.parallax) || 0.15;
      gsap.to(layer, {
        yPercent: amount * 100,
        ease: "none",
        scrollTrigger: {
          trigger: layer.closest("section") || layer,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    // 3 — staggered entrance for every .rise below the fold.
    // The hero is handled by the intro timeline, so it is excluded here.
    const risers = gsap.utils.toArray(".rise").filter((el) => !el.closest(".hero"));
    if (risers.length) {
      gsap.set(risers, { y: 28, opacity: 0 });
      window.ScrollTrigger.batch(risers, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.07,
            clearProps: "transform",
          }),
      });
    }

    // 4 — outline headlines fill as they enter.
    gsap.utils.toArray(".outline[data-fill]").forEach((el) => {
      window.ScrollTrigger.create({
        trigger: el,
        start: "top 78%",
        once: true,
        onEnter: () => el.classList.add("is-filled"),
      });
    });

    // 5 — counters.
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const value = { n: 0 };
      window.ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(value, {
            n: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(value.n).toLocaleString("id-ID");
            },
          }),
      });
    });

    // 6 — marquee: constant drift, and scroll velocity speeds it up.
    gsap.utils.toArray("[data-marquee]").forEach((band) => {
      const track = band.querySelector(".marquee__track");
      if (!track) return;
      const half = track.scrollWidth / 2;
      if (!half) return;

      const loop = gsap.to(track, {
        x: -half,
        duration: 22,
        ease: "none",
        repeat: -1,
      });

      const boost = { value: 1 };
      window.ScrollTrigger.create({
        trigger: band,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const speed = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 900);
          boost.value = speed;
          loop.timeScale(speed);
        },
      });
    });

    // 7 — the atmosphere strip pins and travels sideways.
    const pinSection = document.getElementById("galeri");
    const pinTrack = document.getElementById("pinTrack");
    if (pinSection && pinTrack) {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1101px)", () => {
        const distance = () => Math.max(0, pinTrack.scrollWidth - window.innerWidth + 60);
        if (!distance()) return;
        const tween = gsap.to(pinTrack, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinSection,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.6}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.scrollTrigger?.kill();
      });
    }

    // 8 — the rotating badge drifts against the scroll direction.
    const rotor = document.querySelector(".badge-rotor");
    if (rotor) {
      gsap.to(rotor, {
        yPercent: -34,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }

    // 9 — 3D tilt on marked cards.
    if (fine) {
      gsap.utils.toArray("[data-tilt]").forEach((card) => {
        const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });

        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          rotateY(px * 9);
          rotateX(-py * 9);
        });
        card.addEventListener("pointerleave", () => {
          rotateX(0);
          rotateY(0);
        });
      });
    }

    window.ScrollTrigger.refresh();
  } else {
    // No GSAP, or the visitor asked for less motion: show everything.
    root.classList.add("no-gsap");
  }

  /* --------------------------------------------- magnetic buttons (CSS-free) */
  if (fine && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const move = (event) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.28;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.38;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      };
      const reset = () => {
        el.style.transform = "";
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      el.addEventListener("blur", reset);
    });
  }

  /* ------------------------------------------------------- custom cursor */
  const cursor = document.getElementById("cursor");
  if (cursor && fine && !reduce) {
    document.body.classList.add("has-cursor");
    cursor.style.display = "block";

    const dot = cursor.querySelector("span");
    const ring = cursor.querySelector("i");
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const soft = { x: target.x, y: target.y };

    window.addEventListener(
      "pointermove",
      (event) => {
        target.x = event.clientX;
        target.y = event.clientY;
      },
      { passive: true }
    );

    const render = () => {
      soft.x += (target.x - soft.x) * 0.16;
      soft.y += (target.y - soft.y) * 0.16;
      if (dot) dot.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`;
      if (ring) ring.style.transform = `translate(${soft.x}px, ${soft.y}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    document.querySelectorAll("a, button, [data-tilt], .product").forEach((el) => {
      el.addEventListener("pointerenter", () => cursor.setAttribute("data-active", ""));
      el.addEventListener("pointerleave", () => cursor.removeAttribute("data-active"));
    });
    window.addEventListener("pointerdown", () => cursor.setAttribute("data-active", ""));
    window.addEventListener("pointerup", () => cursor.removeAttribute("data-active"));
  }

  /* ------------------------------------------------ rail drag-to-scroll */
  document.querySelectorAll("[data-rail]").forEach((rail) => {
    let down = false;
    let startX = 0;
    let startLeft = 0;

    rail.addEventListener("pointerdown", (event) => {
      down = true;
      startX = event.clientX;
      startLeft = rail.scrollLeft;
      rail.style.scrollSnapType = "none";
      rail.setPointerCapture(event.pointerId);
    });
    rail.addEventListener("pointermove", (event) => {
      if (!down) return;
      rail.scrollLeft = startLeft - (event.clientX - startX);
    });
    const stop = () => {
      down = false;
      rail.style.scrollSnapType = "";
    };
    rail.addEventListener("pointerup", stop);
    rail.addEventListener("pointercancel", stop);
  });

  /* ------------------------------------- keyboard escape for the drawer */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setDrawer(false);
  });
})();
