(function () {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const sections = Array.from(document.querySelectorAll(".section"));

  function setActive(id) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.target === id));
  }

  // Click: smooth scroll (works even without CSS smooth scroll)
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

  // Scroll spy: highlight current section tab
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((x) => x.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActive(visible.target.id);
    },
    { root: null, threshold: [0.25, 0.4, 0.6] }
  );

  sections.forEach((s) => obs.observe(s));

  // Initialize from hash (if any)
  const hash = (location.hash || "").replace("#", "");
  if (hash) setActive(hash);

  function initContributionToggles() {
    const blocks = document.querySelectorAll(".contribution-description");

    blocks.forEach((block) => {
      const text = block.querySelector(".contribution-description-text");
      const btn = block.querySelector(".contribution-toggle");
      const card = block.closest(".contribution");

      if (!text || !btn || !card) return;

      // Determine if clamped content overflows (button only if needed)
      const needsToggle = text.scrollHeight > text.clientHeight + 1;
      btn.style.display = needsToggle ? "inline" : "none";

      btn.addEventListener("click", () => {
        const expanded = card.classList.toggle("is-expanded");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.textContent = expanded ? "Less" : "More";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContributionToggles);
  } else {
    initContributionToggles();
  }
})();
