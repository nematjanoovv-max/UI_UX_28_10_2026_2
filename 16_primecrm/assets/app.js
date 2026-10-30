(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Mobile menu */
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");
  const closeMenu = () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  };
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });

  /* Reveal on scroll */
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  /* Hero email form */
  const heroForm = $("#heroForm");
  const heroEmail = $("#heroEmail");
  const heroStatus = $("#heroStatus");
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  heroEmail.addEventListener("input", () => {
    heroEmail.removeAttribute("aria-invalid");
    heroStatus.textContent = "";
    heroStatus.className = "form-status";
  });
  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = heroEmail.value.trim();
    if (!validEmail(value)) {
      heroEmail.setAttribute("aria-invalid", "true");
      heroStatus.textContent = "Please enter a valid work email.";
      heroStatus.className = "form-status err";
      heroEmail.focus();
      return;
    }
    heroStatus.textContent = "Thanks! Check your inbox — your trial is ready.";
    heroStatus.className = "form-status ok";
    heroForm.reset();
  });

  /* Billing toggle */
  const billing = $$(".billing-toggle button");
  const prices = $$(".price");
  const billed = $$("[data-billed]");
  billing.forEach((btn) => {
    btn.addEventListener("click", () => {
      const period = btn.dataset.billing;
      billing.forEach((b) => b.classList.toggle("is-active", b === btn));
      prices.forEach((p) => { p.textContent = `$${p.dataset[period]}`; });
      billed.forEach((p) => { p.textContent = period === "annual" ? "Billed annually · save 20%" : "Billed monthly"; });
    });
  });

  /* FAQ accordion */
  $$(".faq-q").forEach((q) => {
    q.addEventListener("click", () => {
      const open = q.getAttribute("aria-expanded") === "true";
      const answer = q.nextElementSibling;
      $$(".faq-q").forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.hidden = true;
      });
      if (!open) {
        q.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });

  /* Testimonial carousel */
  const quotes = [
    {
      initials: "AM",
      text: "“PrimeCRM changed how our team sells. We finally trust our forecast, and the follow-ups that used to slip through the cracks now happen automatically.”",
      name: "Alex Morgan",
      role: "Head of Sales, Northwind"
    },
    {
      initials: "JK",
      text: "“We moved off spreadsheets in a single afternoon. Two months later our win rate is up 24% and the Monday forecast meeting takes ten minutes.”",
      name: "Jamie Kim",
      role: "Revenue Operations, Layers"
    },
    {
      initials: "SR",
      text: "“The pipeline view is the first thing my team opens every morning. It is simple enough that everyone actually keeps it up to date.”",
      name: "Sofia Reyes",
      role: "Founder, Quotient Studio"
    }
  ];
  const slide = $("#quoteSlide");
  const dots = $("#quoteDots");
  let quoteIndex = 0;

  const renderQuote = () => {
    const q = quotes[quoteIndex];
    slide.innerHTML = `
      <div class="quote-avatar">${q.initials}</div>
      <span class="stars light" aria-label="5 out of 5 stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</span>
      <blockquote>${q.text}</blockquote>
      <p class="quote-author"><strong>${q.name}</strong><span>${q.role}</span></p>`;
    $$("button", dots).forEach((d, i) => d.classList.toggle("is-active", i === quoteIndex));
  };
  quotes.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Testimonial ${i + 1}`);
    b.addEventListener("click", () => { quoteIndex = i; renderQuote(); });
    dots.appendChild(b);
  });
  $("#quotePrev").addEventListener("click", () => {
    quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
    renderQuote();
  });
  $("#quoteNext").addEventListener("click", () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    renderQuote();
  });
  renderQuote();

  /* Demo dialog */
  const dialog = $("#demoDialog");
  const demoForm = $("#demoForm");
  const demoBody = $("#demoBody");
  const demoSuccess = $("#demoSuccess");
  const demoName = $("#demoName");
  const demoEmail = $("#demoEmail");
  const demoError = $("#demoError");

  const resetDialog = () => {
    demoForm.reset();
    demoBody.hidden = false;
    demoSuccess.hidden = true;
    demoError.textContent = "";
    demoName.removeAttribute("aria-invalid");
    demoEmail.removeAttribute("aria-invalid");
  };

  $$("[data-demo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      resetDialog();
      dialog.showModal();
      setTimeout(() => demoName.focus(), 60);
    });
  });
  $("#demoClose").addEventListener("click", () => dialog.close());
  $("#demoSuccessClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  [demoName, demoEmail].forEach((input) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      demoError.textContent = "";
    });
  });

  demoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = demoName.value.trim();
    const email = demoEmail.value.trim();
    let error = "";
    if (name.length < 2) {
      error = "Please enter your full name.";
      demoName.setAttribute("aria-invalid", "true");
    } else if (!validEmail(email)) {
      error = "Please enter a valid work email.";
      demoEmail.setAttribute("aria-invalid", "true");
    }
    if (error) {
      demoError.textContent = error;
      (name.length < 2 ? demoName : demoEmail).focus();
      return;
    }
    demoBody.hidden = true;
    demoSuccess.hidden = false;
    demoSuccess.querySelector("button").focus();
  });

  /* Newsletter */
  const newsForm = $("#newsForm");
  const newsEmail = $("#newsEmail");
  const newsStatus = $("#newsStatus");
  newsEmail.addEventListener("input", () => {
    newsStatus.textContent = "";
    newsStatus.className = "news-status";
  });
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validEmail(newsEmail.value.trim())) {
      newsStatus.textContent = "Enter a valid email address.";
      newsStatus.className = "news-status err";
      newsEmail.focus();
      return;
    }
    newsStatus.textContent = "Subscribed. See you next month.";
    newsStatus.className = "news-status ok";
    newsForm.reset();
  });
})();
