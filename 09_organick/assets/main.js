(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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

  /* search */
  const searchBar = document.getElementById("searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchStatus = document.getElementById("searchStatus");
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", () => {
    const open = searchBar.classList.toggle("open");
    searchBar.setAttribute("aria-hidden", String(!open));
    if (open) searchInput.focus();
  });
  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput.value.trim().toLowerCase();
    const products = document.querySelectorAll(".product");
    let matches = 0;
    products.forEach((card) => {
      const hit = !q || card.textContent.toLowerCase().includes(q);
      card.hidden = !hit;
      if (hit) matches++;
    });
    searchStatus.textContent = q
      ? matches + " item" + (matches === 1 ? "" : "s") + " match “" + searchInput.value.trim() + "”."
      : "Showing all " + matches + " items.";
    document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* cart */
  let cart = 0;
  const cartCount = document.getElementById("cartCount");
  const cartBtn = document.getElementById("cartBtn");
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart++;
      cartCount.textContent = cart;
      cartBtn.setAttribute("aria-label", "Cart, " + cart + " item" + (cart === 1 ? "" : "s"));
      showToast(btn.dataset.name + " added — $" + Number(btn.dataset.price).toFixed(2));
    });
  });
  cartBtn.addEventListener("click", () => {
    showToast(cart ? "Your basket has " + cart + " item" + (cart === 1 ? "" : "s") + "." : "Your basket is empty — start with the harvest.");
  });

  /* forms */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function wireForm(formId, inputId, statusId) {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const status = document.getElementById(statusId);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!emailRe.test(input.value.trim())) {
        status.textContent = "That email doesn't look right — mind checking it?";
        status.className = status.className.split(" ")[0] + " err";
        input.focus();
        return;
      }
      status.textContent = formId === "promoForm"
        ? "Your 20% code is on its way. Check your inbox."
        : "You're on the list. The next letter goes out on Friday.";
      status.className = status.className.split(" ")[0] + " ok";
      form.reset();
    });
  }
  wireForm("promoForm", "promoEmail", "promoStatus");
  wireForm("signup", "signupEmail", "signupStatus");

  document.getElementById("year").textContent = new Date().getFullYear();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (nav.classList.contains("open")) closeMenu();
      if (searchBar.classList.contains("open")) {
        searchBar.classList.remove("open");
        searchBar.setAttribute("aria-hidden", "true");
      }
    }
  });
})();
