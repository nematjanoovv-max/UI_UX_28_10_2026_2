(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const menuIcon = '<svg><use href="#g-menu"/></svg>';
  const closeIcon = '<svg><use href="#g-close"/></svg>';
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

  /* cart */
  const STORAGE = "greenshop-cart-v1";
  const drawer = document.getElementById("cartDrawer");
  const scrim = document.getElementById("scrim");
  const itemsEl = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  const countEl = document.getElementById("cartCount");
  const toastEl = document.getElementById("toast");
  let cart = [];
  let toastTimer;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    if (Array.isArray(saved)) cart = saved.filter((x) => x && x.id && x.qty > 0);
  } catch (e) { /* storage unavailable */ }

  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }
  function money(n) { return "$" + n.toFixed(0); }
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }
  function totalQty() { return cart.reduce((n, i) => n + i.qty, 0); }
  function subtotal() { return cart.reduce((n, i) => n + i.qty * i.price, 0); }

  function render() {
    countEl.textContent = totalQty();
    drawer.classList.toggle("no-items", cart.length === 0);
    subtotalEl.textContent = money(subtotal());
    itemsEl.innerHTML = cart.map((item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" alt="" width="64" height="70">
        <div><h3>${item.name}</h3><small>$ ${item.price} each</small>
          <div class="qty"><button data-dec aria-label="Decrease ${item.name}">&minus;</button><span>${item.qty}</span><button data-inc aria-label="Increase ${item.name}">+</button></div>
        </div>
        <span class="line-price">${money(item.price * item.qty)}</span>
      </div>`).join("");
  }

  function openCart() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    scrim.classList.add("show");
    document.body.classList.add("locked");
    document.getElementById("cartClose").focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.classList.remove("show");
    document.body.classList.remove("locked");
    document.getElementById("cartOpen").focus();
  }

  document.getElementById("cartOpen").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartShop").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
  });

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const id = card.dataset.id;
      const found = cart.find((x) => x.id === id);
      if (found) found.qty++;
      else cart.push({
        id,
        name: card.dataset.name,
        price: Number(card.dataset.price),
        qty: 1,
        img: card.querySelector("img").currentSrc || card.querySelector("img").src
      });
      save(); render(); openCart(); toast(card.dataset.name + " added to your basket");
    });
  });

  itemsEl.addEventListener("click", (e) => {
    const row = e.target.closest(".cart-item");
    if (!row) return;
    const item = cart.find((x) => x.id === row.dataset.id);
    if (!item) return;
    if (e.target.closest("[data-inc]")) item.qty++;
    if (e.target.closest("[data-dec]")) item.qty--;
    cart = cart.filter((x) => x.qty > 0);
    save(); render();
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    toast("Demo store — checkout is not connected to payments.");
  });

  render();

  /* product search + filters */
  const products = Array.from(document.querySelectorAll(".product-card"));
  const tabs = Array.from(document.querySelectorAll(".tabs button"));
  const searchInput = document.querySelector(".search input");
  const searchForm = document.querySelector(".search");
  let activeTag = "all";
  let query = "";

  function applyFilters() {
    let visible = 0;
    products.forEach((card) => {
      const tagOk = activeTag === "all" || (card.dataset.tags || "").split(" ").includes(activeTag);
      const nameOk = card.dataset.name.toLowerCase().includes(query);
      const show = tagOk && nameOk;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    if (!visible) toast("No plants matched — try another filter.");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      activeTag = tab.dataset.filter || "all";
      applyFilters();
    });
  });

  searchForm.addEventListener("submit", (e) => e.preventDefault());
  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    applyFilters();
    if (query) document.getElementById("shop").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* newsletter */
  const offerForm = document.getElementById("offerForm");
  const offerStatus = document.getElementById("offerStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  offerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("offerEmail");
    if (!emailRe.test(input.value.trim())) {
      offerStatus.textContent = "Please enter a valid email address.";
      offerStatus.style.color = "#ffb3a7";
      input.focus();
      return;
    }
    offerStatus.textContent = "Welcome to the GreenLetter — your 15% code is on its way.";
    offerStatus.style.color = "#c9e6a4";
    offerStatus.classList.add("ok");
    offerForm.reset();
  });
})();
