/* 간다GO — nav drawer + UX helpers */
(function () {
  "use strict";

  // Mobile drawer
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".mobile-nav");
  var scrim = document.querySelector(".nav-scrim");

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) toggle.addEventListener("click", function () { setDrawer(!drawer.classList.contains("open")); });
  if (scrim) scrim.addEventListener("click", function () { setDrawer(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  // Hide floating call button when footer CTA is in view (avoid overlap)
  var floatCall = document.querySelector(".float-call");
  var footerCta = document.querySelector(".footer-cta");
  if (floatCall && footerCta && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        floatCall.style.opacity = en.isIntersecting ? "0" : "1";
        floatCall.style.pointerEvents = en.isIntersecting ? "none" : "auto";
      });
    }, { threshold: 0.15 });
    io.observe(footerCta);
  }
})();
