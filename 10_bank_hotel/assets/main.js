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

  /* booking */
  const form = document.getElementById("booking");
  const status = document.getElementById("bookingStatus");
  const checkin = form.elements.checkin;
  const checkout = form.elements.checkout;
  const guests = form.elements.guests;
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
  const today = new Date();
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
      status.textContent = "Please choose an arrival and a departure date.";
      status.className = "booking-status err";
      (checkin.value ? checkout : checkin).focus();
      return;
    }
    if (checkout.value <= checkin.value) {
      status.textContent = "Departure needs to be after arrival.";
      status.className = "booking-status err";
      checkout.focus();
      return;
    }
    const nights = Math.round(
      (new Date(checkout.value + "T12:00:00") - new Date(checkin.value + "T12:00:00")) / 86400000
    );
    status.textContent = "A room is available for " + nights + " night" + (nights === 1 ? "" : "s") +
      " for " + guests.value + ". We will hold it for 24 hours — no card needed.";
    status.className = "booking-status ok";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) closeMenu();
  });
})();
