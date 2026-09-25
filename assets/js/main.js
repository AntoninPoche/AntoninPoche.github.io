(function () {
  const CLICK_OFFSET_GAP = 18;
  const topnav = document.querySelector(".topnav");
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

  function getNavHeight() {
    return topnav ? topnav.getBoundingClientRect().height : 0;
  }

  function getSectionAnchorOffset(section) {
    return parseFloat(window.getComputedStyle(section).paddingTop) || 0;
  }

  function getActiveTriggerLine() {
    const navHeight = getNavHeight();
    const extraOffset = Math.max(72, Math.min(160, window.innerHeight * 0.22));
    return navHeight + extraOffset;
  }

  function scrollToSection(section) {
    const navHeight = getNavHeight();
    const anchorOffset = getSectionAnchorOffset(section);
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const targetTop = Math.max(
      0,
      sectionTop - navHeight + anchorOffset - CLICK_OFFSET_GAP
    );

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }

  function getActiveSectionId() {
    if (sections.length === 0) return null;

    const triggerLine = getActiveTriggerLine();
    let activeId = sections[0].id;

    sections.forEach((section) => {
      const anchorLineTop = section.getBoundingClientRect().top + getSectionAnchorOffset(section);
      if (anchorLineTop <= triggerLine) {
        activeId = section.id;
      }
    });

    return activeId;
  }

  function initTopNav() {
    tabs.forEach((tab) => {
      tab.addEventListener("click", (event) => {
        const id = getTabTarget(tab);
        const section = document.getElementById(id);
        if (!section) return;

        event.preventDefault();
        scrollToSection(section);
        history.replaceState(null, "", `#${id}`);
        setActiveTab(id);
      });
    });

    let isTicking = false;

    function updateActiveTabFromScroll() {
      isTicking = false;
      const activeId = getActiveSectionId();
      if (activeId) setActiveTab(activeId);
    }

    function requestActiveUpdate() {
      if (isTicking) return;
      isTicking = true;
      window.requestAnimationFrame(updateActiveTabFromScroll);
    }

    window.addEventListener("scroll", requestActiveUpdate, { passive: true });
    window.addEventListener("resize", requestActiveUpdate);

    requestActiveUpdate();
  }

  function initAuthorLists() {
    document.querySelectorAll(".contribution-authors").forEach((authors) => {
      const short = authors.querySelector(".contribution-authors-short");
      const expand = authors.querySelector(".contribution-authors-expand");
      const full = authors.querySelector(".contribution-authors-full");
      if (!short || !expand || !full) return;

      full.hidden = true;
      full.style.display = "none";
      short.hidden = false;
      short.style.display = "inline";
      expand.addEventListener("click", () => {
        short.hidden = true;
        short.style.display = "none";
        full.hidden = false;
        full.style.display = "inline";
        full.focus();
      });
    });
  }

  function initEventFeeds() {
    document.querySelectorAll(".event-feed").forEach((feed) => {
      const button = feed.querySelector(".event-toggle");
      if (!button) return;

      button.addEventListener("click", () => {
        const expanded = feed.classList.toggle("is-expanded");
        button.setAttribute("aria-expanded", expanded ? "true" : "false");
        button.textContent = expanded ? "Less" : "More";
      });
      feed.classList.add("is-collapsible");
    });
  }

  function initIllustrationLightbox() {
    let box = document.querySelector(".lightbox");
    if (!box) {
      box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Expanded illustration");
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
    const layout = document.querySelector(".layout");
    let opener = null;
    let previousOverflow = "";

    function open(src, button) {
      opener = button;
      previousOverflow = document.body.style.overflow;
      image.src = src;
      image.alt = button.querySelector("img")?.alt || "Expanded illustration";
      box.classList.add("is-open");
      if (layout) layout.inert = true;
      document.body.style.overflow = "hidden";
      closeButton.focus();
    }

    function close() {
      box.classList.remove("is-open");
      image.removeAttribute("src");
      if (layout) layout.inert = false;
      document.body.style.overflow = previousOverflow;
      if (opener) opener.focus();
      opener = null;
    }

    document
      .querySelectorAll(".contribution-illustration-btn, .poster-btn")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const src = button.dataset.full;
          if (src) open(src, button);
        });
      });

    closeButton.addEventListener("click", close);
    box.addEventListener("click", (event) => {
      if (event.target === box) close();
    });
    document.addEventListener("keydown", (event) => {
      if (!box.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "Tab") {
        // The close button is the only focusable element in the dialog.
        event.preventDefault();
        closeButton.focus();
      }
    });
  }

  function initAll() {
    initTopNav();
    initAuthorLists();
    initEventFeeds();
    initIllustrationLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
