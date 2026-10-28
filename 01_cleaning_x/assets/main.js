(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const nav = document.getElementById("primaryNav");
  const menuToggle = document.getElementById("menuToggle");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuToggle.innerHTML = open
      ? '<svg><use href="#i-close"/></svg>'
      : '<svg><use href="#i-menu"/></svg>';
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.innerHTML = '<svg><use href="#i-menu"/></svg>';
    }
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
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  const lightbox = document.getElementById("lightbox");
  const galleryOpen = document.getElementById("galleryOpen");
  const lightboxClose = document.getElementById("lightboxClose");
  let lastFocused = null;

  function openLightbox() {
    lastFocused = document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  }
  galleryOpen.addEventListener("click", openLightbox);
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });

  const form = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setInvalid(field, invalid) {
    field.classList.toggle("invalid", invalid);
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const service = form.elements.service;
    let firstBad = null;

    const checks = [
      [name, name.value.trim().length >= 2],
      [email, emailRe.test(email.value.trim())],
      [service, service.value !== ""]
    ];
    checks.forEach(([field, ok]) => {
      setInvalid(field, !ok);
      if (!ok && !firstBad) firstBad = field;
    });

    if (firstBad) {
      status.textContent = "Please check the highlighted fields and try again.";
      status.className = "form-status err";
      firstBad.focus();
      return;
    }

    status.textContent = "Thank you, " + name.value.trim().split(" ")[0] + "! Your quote request is on its way — we reply within one business hour.";
    status.className = "form-status ok";
    form.reset();
    checks.forEach(([field]) => setInvalid(field, false));
  });

  form.addEventListener("input", (e) => {
    if (e.target.matches("input,select,textarea")) {
      setInvalid(e.target, false);
      if (status.classList.contains("err")) {
        status.textContent = "";
        status.className = "form-status";
      }
    }
  });

  const newsForm = document.getElementById("newsForm");
  const newsStatus = document.getElementById("newsStatus");
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("newsEmail");
    if (!emailRe.test(input.value.trim())) {
      newsStatus.textContent = "Enter a valid email address.";
      newsStatus.style.color = "#ff9ca8";
      input.focus();
      return;
    }
    newsStatus.textContent = "You're in. Watch your inbox for the next checklist.";
    newsStatus.style.color = "#7fe0ab";
    newsForm.reset();
  });

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }
})();
