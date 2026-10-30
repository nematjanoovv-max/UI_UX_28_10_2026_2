(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

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
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  /* FAQ accordion */
  $$(".faq-q").forEach((q) => {
    q.addEventListener("click", () => {
      const open = q.getAttribute("aria-expanded") === "true";
      $$(".faq-q").forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.hidden = true;
      });
      if (!open) {
        q.setAttribute("aria-expanded", "true");
        q.nextElementSibling.hidden = false;
      }
    });
  });

  /* Buy dialog */
  const dialog = $("#buyDialog");
  const form = $("#buyForm");
  const body = $("#buyBody");
  const success = $("#buySuccess");
  const nameInput = $("#buyName");
  const emailInput = $("#buyEmail");
  const errorEl = $("#buyError");
  const planName = $("#buyPlanName");
  const planPrice = $("#buyPlanPrice");

  const resetDialog = () => {
    form.reset();
    body.hidden = false;
    success.hidden = true;
    errorEl.textContent = "";
    nameInput.removeAttribute("aria-invalid");
    emailInput.removeAttribute("aria-invalid");
  };

  $$("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.dataset.buy || "Solo — $49";
      const [name, price] = plan.split(" — ");
      planName.textContent = plan;
      planPrice.textContent = price || "$49";
      resetDialog();
      dialog.showModal();
      setTimeout(() => nameInput.focus(), 60);
    });
  });
  $("#buyClose").addEventListener("click", () => dialog.close());
  $("#buySuccessClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  [nameInput, emailInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    let error = "";
    if (name.length < 2) {
      error = "Please enter your full name.";
      nameInput.setAttribute("aria-invalid", "true");
    } else if (!validEmail(email)) {
      error = "Please enter a valid email address.";
      emailInput.setAttribute("aria-invalid", "true");
    }
    if (error) {
      errorEl.textContent = error;
      (name.length < 2 ? nameInput : emailInput).focus();
      return;
    }
    body.hidden = true;
    success.hidden = false;
    success.querySelector("button").focus();
  });
})();
