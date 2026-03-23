(function () {
  const tabs = Array.from(document.querySelectorAll(".topnav-tab"));
  const sections = Array.from(document.querySelectorAll(".section"));

  function getTabTarget(tab) {
    return tab.dataset.target || (tab.getAttribute("href") || "").replace(/^#/, "");
  }

  function setActiveTab(id) {
    tabs.forEach((tab) => {
      const isActive = getTabTarget(tab) === id;
      tab.classList.toggle("is-active", isActive);

      if (isActive) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });
  }

  function initTopNav() {
    tabs.forEach((tab) => {
      tab.addEventListener("click", (event) => {
        const id = getTabTarget(tab);
        const section = document.getElementById(id);
        if (!section) return;

        event.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
        setActiveTab(id);
      });
    });

    if (sections.length > 0 && tabs.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (visible) setActiveTab(visible.target.id);
        },
        {
          root: null,
          rootMargin: "-18% 0px -55% 0px",
          threshold: [0.15, 0.35, 0.6, 0.85],
        }
      );

      sections.forEach((section) => observer.observe(section));
    }

    const hash = (location.hash || "").replace("#", "");
    setActiveTab(hash || sections[0]?.id);
  }

  function initContributionToggles() {
    const blocks = Array.from(document.querySelectorAll(".contribution-description"));

    function updateToggle(block) {
      const text = block.querySelector(".contribution-description-text");
      const button = block.querySelector(".contribution-toggle");
      const card = block.closest(".contribution");
      if (!text || !button || !card) return;

      const wasExpanded = card.classList.contains("is-expanded");
      if (wasExpanded) card.classList.remove("is-expanded");

      const needsToggle = text.scrollHeight > text.clientHeight + 1;
      button.style.display = needsToggle ? "inline" : "none";
      button.textContent = "Read more";
      button.setAttribute("aria-expanded", "false");

      if (wasExpanded && needsToggle) {
        card.classList.add("is-expanded");
        button.textContent = "Show less";
        button.setAttribute("aria-expanded", "true");
      }
    }

    blocks.forEach((block) => {
      updateToggle(block);

      const button = block.querySelector(".contribution-toggle");
      const card = block.closest(".contribution");
      if (!button || !card) return;

      button.addEventListener("click", () => {
        const expanded = card.classList.toggle("is-expanded");
        button.setAttribute("aria-expanded", expanded ? "true" : "false");
        button.textContent = expanded ? "Show less" : "Read more";
      });
    });

    window.addEventListener("resize", () => {
      blocks.forEach((block) => updateToggle(block));
    });
  }

  function initNewsToggle() {
    const news = document.querySelector(".news");
    if (!news) return;

    const button = news.querySelector(".news-toggle");
    if (!button) return;

    button.addEventListener("click", () => {
      const expanded = news.classList.toggle("is-expanded");
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
      button.textContent = expanded ? "Show recent only" : "Show older updates";
    });
  }

  function initIllustrationLightbox() {
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

    const image = box.querySelector(".lightbox-img");
    const closeButton = box.querySelector(".lightbox-close");

    function open(src) {
      image.src = src;
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      box.classList.remove("is-open");
      image.removeAttribute("src");
      document.body.style.overflow = "";
    }

    document
      .querySelectorAll(".contribution-illustration-btn, .poster-btn")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const src = button.dataset.full;
          if (src) open(src);
        });
      });

    closeButton.addEventListener("click", close);
    box.addEventListener("click", (event) => {
      if (event.target === box) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && box.classList.contains("is-open")) close();
    });
  }

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
