(function () {
  "use strict";

  const menu = document.getElementById("menu");
  const openBtn = document.getElementById("menuOpen");
  const closeBtn = document.getElementById("menuClose");

  function openMenu() {
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    closeBtn.focus();
  }
  function closeMenu(returnFocus) {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (returnFocus) openBtn.focus();
  }
  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", () => closeMenu(true));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) closeMenu(true);
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px" });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }
})();
