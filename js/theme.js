(function () {
  "use strict";

  // Защита от случайного повторного подключения файла
  if (window.rowFiveThemeReady) return;
  window.rowFiveThemeReady = true;

  const root = document.documentElement;
  const storageKey = "rowFiveTheme";

  function readTheme() {
    try {
      return localStorage.getItem(storageKey) === "light"
        ? "light"
        : "dark";
    } catch (error) {
      return "dark";
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;

    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const isLight = theme === "light";

    button.textContent = isLight ? "🌙 Dark" : "☀️ Light";
    button.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  }

  // Применяем тему сразу, до появления содержимого страницы
  applyTheme(readTheme());

  function init() {
    applyTheme(root.dataset.theme);

    const button = document.getElementById("theme-toggle");
    if (!button) return;

    button.addEventListener("click", function () {
      const theme = root.dataset.theme === "light" ? "dark" : "light";

      applyTheme(theme);

      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        // Переключение работает и при заблокированном хранилище
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Обновляем тему, если её поменяли в другой вкладке
  window.addEventListener("storage", function (event) {
    if (event.key === storageKey || event.key === null) {
      applyTheme(readTheme());
    }
  });
})();