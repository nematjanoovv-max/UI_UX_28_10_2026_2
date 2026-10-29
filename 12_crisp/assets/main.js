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

  /* search */
  const searchBar = document.getElementById("searchBar");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const searchStatus = document.getElementById("searchStatus");
  const grid = document.getElementById("productGrid");
  const gridStatus = document.getElementById("gridStatus");
  const products = [...grid.querySelectorAll(".product")];

  searchBtn.addEventListener("click", () => {
    const open = searchBar.classList.toggle("open");
    searchBar.setAttribute("aria-hidden", String(!open));
    searchBtn.setAttribute("aria-expanded", String(open));
    if (open) searchInput.focus();
  });

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput.value.trim().toLowerCase();
    let shown = 0;
    products.forEach((p) => {
      const match = !q || p.dataset.name.toLowerCase().includes(q);
      p.classList.toggle("is-hidden", !match);
      if (match) shown++;
    });
    searchStatus.className = "search-status " + (shown ? "ok" : "err");
    searchStatus.textContent = !q
      ? "Showing all new pieces."
      : shown
        ? "Showing " + shown + " piece" + (shown === 1 ? "" : "s") + " for “" + searchInput.value.trim() + "”."
        : "Nothing matches “" + searchInput.value.trim() + "” — try coats, dresses or tees.";
    gridStatus.textContent = q && !shown ? "No pieces match your search. Clear the search to see everything." : "";
    if (q) document.getElementById("new").scrollIntoView({ behavior: "smooth" });
  });

  /* bag */
  const bagCount = document.getElementById("bagCount");
  const bagBtn = document.getElementById("bagBtn");
  const toast = document.getElementById("toast");
  let inBag = 0;
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }
  document.querySelectorAll(".quick-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      inBag++;
      bagCount.textContent = inBag;
      bagBtn.setAttribute("aria-label", "Shopping bag, " + inBag + " item" + (inBag === 1 ? "" : "s"));
      showToast(btn.dataset.name + " added to bag");
    });
  });
  bagBtn.addEventListener("click", () => {
    showToast(inBag ? "Your bag has " + inBag + " item" + (inBag === 1 ? "" : "s") : "Your bag is empty");
  });

  /* newsletter */
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const newsletterStatus = document.getElementById("newsletterStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!emailRe.test(email)) {
      newsletterStatus.textContent = "That email doesn't look right — mind checking it?";
      newsletterStatus.className = "newsletter-status err";
      emailInput.focus();
      return;
    }
    newsletterStatus.textContent = "You're on the list. Look out for the Friday drop.";
    newsletterStatus.className = "newsletter-status ok";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (nav.classList.contains("open")) closeMenu();
      if (searchBar.classList.contains("open")) {
        searchBar.classList.remove("open");
        searchBar.setAttribute("aria-hidden", "true");
        searchBtn.setAttribute("aria-expanded", "false");
      }
    }
  });
})();
