// main.js
// - Top nav: smooth scroll + "active tab" highlight while scrolling
// - Contribution cards: clamp description + More/Less toggle
// - News section: show last 10 + More/Less toggle
(function () {
  // -----------------------------
  // Topnav: smooth scroll + spy
  // -----------------------------
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const sections = Array.from(document.querySelectorAll(".section"));

  function setActiveTab(id) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.target === id));
  }

  function initTopNav() {
    // Click: smooth scroll to section
    tabs.forEach((t) => {
      t.addEventListener("click", (e) => {
        const id = t.dataset.target;
        const el = document.getElementById(id);
        if (!el) return;

        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      });
    });

    // Scroll spy: highlight the most visible section
    if (sections.length > 0 && tabs.length > 0) {
      const obs = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((x) => x.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (visible) setActiveTab(visible.target.id);
        },
        { root: null, threshold: [0.25, 0.4, 0.6] }
      );

      sections.forEach((s) => obs.observe(s));
    }

    // Initialize from hash (if any)
    const hash = (location.hash || "").replace("#", "");
    if (hash) setActiveTab(hash);
  }

  // -----------------------------------------
  // Contributions: "More/Less" description
  // -----------------------------------------
  function initContributionToggles() {
    const blocks = document.querySelectorAll(".contribution-description");

    blocks.forEach((block) => {
      const text = block.querySelector(".contribution-description-text");
      const btn = block.querySelector(".contribution-toggle");
      const card = block.closest(".contribution");
      if (!text || !btn || !card) return;

      // Show the button only if clamped content overflows
      const needsToggle = text.scrollHeight > text.clientHeight + 1;
      btn.style.display = needsToggle ? "inline" : "none";

      btn.addEventListener("click", () => {
        const expanded = card.classList.toggle("is-expanded");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.textContent = expanded ? "Less" : "More";
      });
    });
  }

  // -----------------------------
  // News: More/Less list toggle
  // -----------------------------
  function initNewsToggle() {
    const news = document.querySelector(".news");
    if (!news) return;

    const btn = news.querySelector(".news-toggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const expanded = news.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.textContent = expanded ? "Less" : "More";
    });
  }

  // -----------------------------
  // Contribution illustration zoom
  // -----------------------------
  function initIllustrationLightbox() {
    // Create overlay once
    let box = document.querySelector(".lightbox");
    if (!box) {
      box = document.createElement("div");
      box.className = "lightbox";
      box.innerHTML = `
        <div class="lightbox-inner">
          <button class="lightbox-close" type="button" aria-label="Close">Close</button>
          <img class="lightbox-img" alt="Expanded illustration">
        </div>
      `;
      document.body.appendChild(box);
    }

    const imgEl = box.querySelector(".lightbox-img");
    const closeBtn = box.querySelector(".lightbox-close");

    function open(src) {
      imgEl.src = src;
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      box.classList.remove("is-open");
      imgEl.removeAttribute("src");
      document.body.style.overflow = "";
    }

    // Open on click from any contribution illustration
    document.querySelectorAll(".contribution-illustration-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.dataset.full;
        if (src) open(src);
      });
    });

    // Close interactions
    closeBtn.addEventListener("click", close);
    box.addEventListener("click", (e) => {
      if (e.target === box) close(); // click outside image
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box.classList.contains("is-open")) close();
    });
  }


  // -----------------------------
  // Init everything once DOM ready
  // -----------------------------
  function initAll() {
    initTopNav();
    initContributionToggles();
    initNewsToggle();
    initIllustrationLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
