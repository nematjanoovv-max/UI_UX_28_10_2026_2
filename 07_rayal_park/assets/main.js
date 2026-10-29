(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const menuIcon = '<svg><use href="#h-menu"/></svg>';
  const closeIcon = '<svg><use href="#h-close"/></svg>';
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

  /* booking */
  const form = document.getElementById("booking");
  const status = document.getElementById("bookingStatus");
  const checkin = form.elements.checkin;
  const checkout = form.elements.checkout;
  const guests = form.elements.guests;
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
  checkin.min = iso(today);
  checkout.min = iso(addDays(today, 1));
  checkin.addEventListener("change", () => {
    if (!checkin.value) return;
    const next = new Date(checkin.value + "T12:00:00");
    checkout.min = iso(addDays(next, 1));
    if (checkout.value && checkout.value <= checkin.value) checkout.value = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!checkin.value || !checkout.value) {
      status.textContent = "Please choose both a check-in and a check-out date.";
      status.className = "booking-status err";
      (checkin.value ? checkout : checkin).focus();
      return;
    }
    if (checkout.value <= checkin.value) {
      status.textContent = "Check-out needs to be after check-in.";
      status.className = "booking-status err";
      checkout.focus();
      return;
    }
    const nights = Math.round(
      (new Date(checkout.value + "T12:00:00") - new Date(checkin.value + "T12:00:00")) / 86400000
    );
    status.textContent = "Room available for " + nights + " night" + (nights === 1 ? "" : "s") +
      " and " + guests.value + ". We'll hold it for 24 hours — no card needed.";
    status.className = "booking-status ok";
  });

  /* newsletter */
  const signup = document.getElementById("signup");
  const signupStatus = document.getElementById("signupStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  signup.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail");
    if (!emailRe.test(email.value.trim())) {
      signupStatus.textContent = "That email doesn't look right — mind checking it?";
      signupStatus.className = "signup-status err";
      email.focus();
      return;
    }
    signupStatus.textContent = "You're on the list. Look out for the next letter from the garden.";
    signupStatus.className = "signup-status ok";
    signup.reset();
  });

  /* tour modal */
  const modal = document.getElementById("tourModal");
  const tourBtn = document.getElementById("tourBtn");
  const tourClose = document.getElementById("tourClose");
  function openTour() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    tourClose.focus();
  }
  function closeTour() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    tourBtn.focus();
  }
  tourBtn.addEventListener("click", openTour);
  tourClose.addEventListener("click", closeTour);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTour();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.classList.contains("open")) closeTour();
      if (nav.classList.contains("open")) closeMenu();
    }
  });
})();
