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
})();
