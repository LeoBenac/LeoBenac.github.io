// Small enhancements only: the page is fully readable without JavaScript.
(() => {
  const root = document.documentElement;

  // ---- Theme toggle (follows the system unless the visitor picks otherwise) ----
  const themeBtn = document.querySelector(".theme-toggle");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === "dark" : systemDark.matches;
  const syncTheme = () => {
    themeBtn?.setAttribute(
      "aria-label",
      isDark() ? "Switch to light theme" : "Switch to dark theme"
    );
    // Keep the mobile browser toolbar in step with the page.
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute("content", isDark() ? "#111113" : "#a51c30"));
  };
  syncTheme();
  systemDark.addEventListener?.("change", syncTheme);
  themeBtn?.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    // Choosing the system's own theme goes back to following the system.
    const followsSystem = (next === "dark") === systemDark.matches;
    if (followsSystem) delete root.dataset.theme;
    else root.dataset.theme = next;
    try {
      if (followsSystem) localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch (e) {
      /* storage unavailable: the theme still applies for this visit */
    }
    syncTheme();
  });

  // ---- Mobile menu ----
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const header = document.querySelector(".site-header");
  const isOpen = () => !!navLinks?.classList.contains("open");
  const setMenu = (open) => {
    navLinks?.classList.toggle("open", open);
    menuBtn?.setAttribute("aria-expanded", String(open));
  };
  menuBtn?.addEventListener("click", () => {
    setMenu(!isOpen());
    // The links come before the button in the page, so move focus into them.
    if (isOpen()) navLinks.querySelector("a")?.focus();
  });
  navLinks?.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setMenu(false);
      menuBtn?.focus();
    }
  });
  header?.addEventListener("focusout", (e) => {
    if (isOpen() && !header.contains(e.relatedTarget)) setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (isOpen() && !header.contains(e.target)) setMenu(false);
  });

  // ---- Highlight the nav link of the section being read ----
  const links = new Map(
    [...document.querySelectorAll('.nav-links a[href^="#"]')].map((a) => [
      a.getAttribute("href").slice(1),
      a,
    ])
  );
  // Sections without a nav link (Education, Beyond Research) keep the previous link lit.
  const sections = [...document.querySelectorAll("main section[id]")].filter((s) =>
    links.has(s.id)
  );
  let ticking = false;
  const updateActive = () => {
    ticking = false;
    const line = window.innerHeight * 0.35;
    let current = null;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= line) current = s.id;
    }
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom && links.has("contact")) current = "contact";
    links.forEach((a, id) => {
      const on = id === current;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateActive);
  updateActive();

  // ---- BibTeX show/hide + copy ----
  document.querySelectorAll("[data-bib-toggle]").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  document.querySelectorAll(".bib .copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pre = btn.closest(".bib").querySelector("pre");
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = "Copied!";
      } catch (e) {
        // Clipboard API unavailable (e.g. page opened from a file): select the text instead.
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = "Press Ctrl/⌘+C";
      }
      setTimeout(() => (btn.textContent = "Copy"), 1800);
    });
  });
})();
