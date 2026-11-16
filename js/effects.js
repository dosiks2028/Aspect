// Shared jQuery effects

(function () {
  "use strict";

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateMotion() {
    $.fx.off = motion.matches;

    if (motion.matches) {
      $(":animated").stop(true, true);
    }
  }

  updateMotion();
  motion.addEventListener("change", updateMotion);

  // Works for existing and dynamically added buttons
  $(document).on("mouseenter mouseleave", ".btn-seat", function (event) {
    $(this)
      .stop(true, true)
      .fadeTo(150, event.type === "mouseenter" ? 0.8 : 1);
  });

  // One shared smooth-scroll handler
  let scrollRequest = 0;

  $(document).on(
    "click",
    "#to-join, #to-reserve, #to-suggest, #to-feedback",
    function (event) {
      const target = document.getElementById(
        this.getAttribute("href").slice(1)
      );

      if (!target) return;

      event.preventDefault();

      const request = ++scrollRequest;

      $("html, body")
        .stop(true, true)
        .animate({
          scrollTop: Math.max(0, $(target).offset().top - 24)
        }, 500)
        .promise()
        .done(function () {
          if (request !== scrollRequest) return;

          const field = target.querySelector(
            "input, select, textarea, button"
          );

          if (field) {
            field.focus({ preventScroll: true });
          }
        });
    }
  );
})();
