const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

/**
 * Hero fade on scroll (improved)
 * - Fades out completely BEFORE the About section starts
 * - Hard-hides hero to avoid showing through transparent sections
 */
(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const spacer = document.querySelector(".hero-spacer");

  const clamp01 = (n) => Math.min(1, Math.max(0, n));

  const getFadeDistance = () => {
    // Use the spacer height as the scroll length for the hero,
    // and fade out a bit earlier so it's fully gone by About section.
    const base = (spacer?.offsetHeight || hero.offsetHeight || 600);
    const fadeEarlyBy = 160; // tweak: 80..180
    return Math.max(200, base - fadeEarlyBy);
  };

  const render = () => {
    const y = window.scrollY || 0;
    const fadeDistance = getFadeDistance();
    const t = clamp01(y / fadeDistance);
    const opacity = 1 - t;

    hero.style.opacity = String(opacity);

    // Hard-hide when fully faded (prevents seeing it through translucent sections)
    if (t >= 1) {
      hero.style.visibility = "hidden";
      hero.style.pointerEvents = "none";
    } else {
      hero.style.visibility = "visible";
      hero.style.pointerEvents = "auto";
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      render();
      ticking = false;
    });
  };

  render();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", render);
})();

// Make navbar solid after scrolling down a bit
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});


// Reveal service cards on scroll (safe)
const cards = document.querySelectorAll(".service-card");

cards.forEach(c => c.classList.add("is-hidden"));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("reveal");
      e.target.classList.remove("is-hidden");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

cards.forEach(c => io.observe(c));

// ============================
// Smooth blur rotating message
// ============================
(() => {
  const A = document.getElementById("rotatorA");
  const B = document.getElementById("rotatorB");
  if (!A || !B) return;

  const slides = [
    { lines: ["Need some help", "with your idea?"], style: "style-1" },
    { lines: ["Then you’re", "in the right place."], style: "style-2" },
    { lines: ["We bring your idea", "to the real world."], style: "style-3" },
    { lines: ["Why wait?", "Contact us."], style: "style-4" }
  ];

  const transitionMs = 600;  // must match CSS
  const holdMs = 1900;

  let active = A;
  let idle = B;
  let i = 0;

  const setSlide = (el, slide) => {
    el.className = "rotator-text " + slide.style;
    el.innerHTML = `
      <div class="wrap">
        ${slide.lines.map(l => `<span class="line">${l}</span>`).join("")}
      </div>
    `;
  };

  const showNext = () => {
    const slide = slides[i % slides.length];
    i++;

    // prepare incoming
    setSlide(idle, slide);

    // trigger blur-in
    requestAnimationFrame(() => {
      idle.classList.add("is-active");
    });

    // trigger blur-out
    active.classList.add("is-leaving");
    active.classList.remove("is-active");

    setTimeout(() => {
      active.classList.remove("is-leaving");
      active.innerHTML = "";

      // swap
      const temp = active;
      active = idle;
      idle = temp;

      setTimeout(showNext, holdMs);
    }, transitionMs);
  };

  // initial slide
  setSlide(A, slides[0]);
  A.classList.add("is-active");
  i = 1;

  setTimeout(showNext, holdMs);
})();

