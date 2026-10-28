(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const menuIcon = '<svg><use href="#s-menu"/></svg>';
  const closeIcon = '<svg><use href="#s-close"/></svg>';
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.innerHTML = open ? closeIcon : menuIcon;
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      menuBtn.innerHTML = menuIcon;
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
    }, { threshold: 0.1, rootMargin: "0px 0px -30px" });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* hero email capture */
  const heroForm = document.getElementById("heroForm");
  const heroEmail = document.getElementById("heroEmail");
  const heroStatus = document.getElementById("heroStatus");
  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!emailRe.test(heroEmail.value.trim())) {
      heroStatus.textContent = "Please enter a valid work email to continue.";
      heroStatus.className = "signup-note err";
      heroEmail.focus();
      return;
    }
    heroStatus.textContent = "Nice one — check your inbox for the invite link.";
    heroStatus.className = "signup-note ok";
    heroForm.reset();
  });
  heroEmail.addEventListener("input", () => {
    if (heroStatus.classList.contains("err")) {
      heroStatus.textContent = "Free 14-day trial · No credit card required";
      heroStatus.className = "signup-note";
    }
  });

  /* pricing toggle */
  const toggleBtns = Array.from(document.querySelectorAll(".billing-toggle button"));
  const priceValues = Array.from(document.querySelectorAll(".price strong"));
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      const yearly = btn.dataset.period === "yearly";
      priceValues.forEach((el) => {
        el.textContent = el.dataset[yearly ? "yearly" : "monthly"];
      });
      document.querySelectorAll(".price-note").forEach((note) => {
        note.textContent = yearly
          ? "Billed yearly — save 20%. Cancel anytime."
          : "Billed monthly. Cancel anytime.";
      });
    });
  });

  /* team picker */
  const teamStatus = document.getElementById("teamStatus");
  document.getElementById("teamGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".team-card");
    if (!card) return;
    const cards = document.querySelectorAll(".team-card");
    const wasSelected = card.getAttribute("aria-pressed") === "true";
    cards.forEach((c) => c.setAttribute("aria-pressed", "false"));
    if (wasSelected) {
      teamStatus.textContent = "Select a teammate to preview their Swipe workspace.";
      return;
    }
    card.setAttribute("aria-pressed", "true");
    const name = card.querySelector("strong").textContent;
    const team = card.dataset.team;
    teamStatus.innerHTML = "Previewing <strong>" + team + "</strong> — " + name + " runs invoices, payouts and team cards here.";
  });

  /* contact form */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  function setInvalid(field, invalid) {
    field.classList.toggle("invalid", invalid);
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const first = form.elements.firstName;
    const last = form.elements.lastName;
    const email = form.elements.email;
    const size = form.elements.size;
    let firstBad = null;
    const checks = [
      [first, first.value.trim().length >= 2],
      [last, last.value.trim().length >= 2],
      [email, emailRe.test(email.value.trim())],
      [size, size.value !== ""]
    ];
    checks.forEach(([field, ok]) => {
      setInvalid(field, !ok);
      if (!ok && !firstBad) firstBad = field;
    });
    if (firstBad) {
      status.textContent = "Please check the highlighted fields.";
      status.className = "form-status err";
      firstBad.focus();
      return;
    }
    status.textContent = "Thanks, " + first.value.trim() + "! We will reply within one working day.";
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
})();
