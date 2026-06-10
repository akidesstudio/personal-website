// ===== Ibrohim Qodirov — shaxsiy sayt skripti =====

(function () {
  "use strict";

  const STORAGE_KEY = "site-lang";
  const THEME_KEY = "site-theme";
  const SUPPORTED = ["uz", "ru"];
  const THEMES = ["dark", "light"];

  /**
   * Sahifadagi barcha matnlarni tanlangan tilga o'tkazadi.
   * Elementlarda data-uz / data-ru atributlari bo'lishi kerak.
   */
  function applyLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = "uz";

    document.querySelectorAll("[data-" + lang + "]").forEach(function (el) {
      const value = el.getAttribute("data-" + lang);
      if (value === null) return;

      if (el.tagName === "META") {
        el.setAttribute("content", value);
      } else {
        el.textContent = value;
      }
    });

    document.documentElement.setAttribute("lang", lang);

    // Til tugmalarining holatini yangilash
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage mavjud bo'lmasa, e'tiborsiz qoldiramiz */
    }
  }

  /** Saqlangan yoki brauzer tilini aniqlaydi (standart: uz). */
  function detectLanguage() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    if (SUPPORTED.includes(saved)) return saved;

    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("ru")) return "ru";
    return "uz";
  }

  /** Tanlangan rejimni (light/dark) qo'llaydi va saqlaydi. */
  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = "dark";
    document.documentElement.setAttribute("data-theme", theme);

    const toggle = document.getElementById("themeToggle");
    if (toggle) toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  /** Saqlangan yoki tizim rejimini aniqlaydi (standart: dark). */
  function detectTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (e) {
      /* ignore */
    }
    if (THEMES.includes(saved)) return saved;

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }

  /** Sichqoncha harakatiga ergashuvchi yorug'lik. */
  function initCursorGlow() {
    const glow = document.getElementById("cursorGlow");
    if (!glow) return;
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;

    let raf = null;
    let x = 0;
    let y = 0;

    function render() {
      raf = null;
      glow.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    }

    window.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;
      glow.style.opacity = "1";
      if (raf === null) raf = window.requestAnimationFrame(render);
    });

    document.addEventListener("mouseleave", function () {
      glow.style.opacity = "0";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 1) Til
    applyLanguage(detectLanguage());

    // 1b) Rejim (light/dark)
    applyTheme(detectTheme());
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        const current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "light" ? "dark" : "light");
      });
    }

    // 1c) Sichqoncha yorug'ligi
    initCursorGlow();

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });

    // 2) Mobil menyu (burger)
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");

    function closeMenu() {
      if (!nav) return;
      nav.classList.remove("is-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    }

    if (burger && nav) {
      burger.addEventListener("click", function () {
        const open = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // Menyudagi havola bosilganda yopiladi
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

    // 3) Footer'dagi yil
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  });
})();
