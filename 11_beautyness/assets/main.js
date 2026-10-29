(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const menuIcon = '<svg><use href="#i-menu"/></svg>';
  const closeIcon = '<svg><use href="#i-close"/></svg>';
  function closeMenu() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    menuBtn.innerHTML = menuIcon;
  }
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.innerHTML = open ? closeIcon : menuIcon;
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
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

  const form = document.getElementById("bookForm");
  const status = document.getElementById("bookStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const dateInput = form.elements.date;
  const iso = (d) => d.toISOString().slice(0, 10);
  dateInput.min = iso(new Date());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const service = form.elements.service.value;
    const date = dateInput.value;
    if (!name || !emailRe.test(email) || !service || !date) {
      status.textContent = !email || !emailRe.test(email)
        ? "That email doesn't look right — mind checking it?"
        : "Please add your name, a treatment and a preferred date.";
      status.className = "form-status err";
      if (!name) form.elements.name.focus();
      else if (!emailRe.test(email)) form.elements.email.focus();
      else if (!service) form.elements.service.focus();
      else dateInput.focus();
      return;
    }
    const pretty = new Date(date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    status.textContent = "Thank you, " + name.split(" ")[0] + ". We will email you to confirm " + service.toLowerCase() + " on " + pretty + ".";
    status.className = "form-status ok";
    form.reset();
    dateInput.min = iso(new Date());
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) closeMenu();
  });
})();
