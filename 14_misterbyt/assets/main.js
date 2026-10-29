(function () {
  "use strict";

  /* mobile menu */
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const menuIcon = '<svg><use href="#i-menu"/></svg>';
  const closeIcon = '<svg><use href="#i-close"/></svg>';
  function closeMenu() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Открыть меню");
    menuBtn.innerHTML = menuIcon;
  }
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    menuBtn.innerHTML = open ? closeIcon : menuIcon;
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  /* header shadow */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* reveal */
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

  /* brand marquee */
  const brands = ["AEG", "ARDO", "ASKO", "BEKO", "BOSCH", "CANDY", "DAEWOO", "ELECTROLUX", "GORENJE", "HAIER", "INDESIT", "LG", "MIELE", "SAMSUNG", "SIEMENS", "VESTEL", "ZANUSSI"];
  const brandTrack = document.getElementById("brandTrack");
  if (brandTrack) {
    const row = (hidden) => brands.map((name) =>
      '<img src="assets/brands/' + name + '.png" alt="' + name + '"' + (hidden ? ' aria-hidden="true"' : "") + ">"
    ).join("");
    brandTrack.innerHTML = row(false) + row(true);
  }

  /* phone mask */
  const digits = (value) => value.replace(/\D/g, "");
  function formatPhone(value) {
    let d = digits(value);
    if (!d) return "";
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    let out = "+7";
    if (d.length > 1) out += " (" + d.slice(1, 4);
    if (d.length >= 5) out += ") " + d.slice(4, 7);
    if (d.length >= 8) out += "-" + d.slice(7, 9);
    if (d.length >= 10) out += "-" + d.slice(9, 11);
    return out;
  }
  function bindMask(input) {
    input.addEventListener("input", () => {
      input.value = formatPhone(input.value);
    });
    input.addEventListener("focus", () => {
      if (!input.value) input.value = "+7 (";
    });
    input.addEventListener("blur", () => {
      if (digits(input.value).length <= 1) input.value = "";
    });
  }
  const heroPhone = document.getElementById("heroPhone");
  const ctaPhone = document.getElementById("ctaPhone");
  bindMask(heroPhone);
  bindMask(ctaPhone);

  /* hero form */
  const heroForm = document.getElementById("heroForm");
  const heroStatus = document.getElementById("heroStatus");
  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = digits(heroPhone.value);
    if (phone.length !== 11) {
      heroStatus.textContent = "Проверьте номер: нужно 11 цифр, например +7 (495) 106-52-16.";
      heroStatus.className = "form-status err";
      heroPhone.focus();
      return;
    }
    heroStatus.textContent = "Спасибо! Перезвоним в течение 2 минут и назовём время приезда мастера.";
    heroStatus.className = "form-status ok";
    heroPhone.value = "";
  });

  /* cta form */
  const ctaForm = document.getElementById("ctaForm");
  const ctaName = document.getElementById("ctaName");
  const ctaStatus = document.getElementById("ctaStatus");
  ctaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = ctaName.value.trim();
    if (name.length < 2) {
      ctaStatus.textContent = "Напишите, как к вам обращаться.";
      ctaStatus.className = "form-status form-status-light err";
      ctaName.focus();
      return;
    }
    if (digits(ctaPhone.value).length !== 11) {
      ctaStatus.textContent = "Проверьте телефон: нужно 11 цифр.";
      ctaStatus.className = "form-status form-status-light err";
      ctaPhone.focus();
      return;
    }
    ctaStatus.textContent = "Заявка принята, " + name + "! Мастер свяжется с вами в течение 2 минут.";
    ctaStatus.className = "form-status form-status-light ok";
    ctaForm.reset();
  });

  /* service area */
  const areaForm = document.getElementById("areaForm");
  const areaAddress = document.getElementById("areaAddress");
  const areaStatus = document.getElementById("areaStatus");
  const mapCardText = document.querySelector(".map-card span");
  areaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const address = areaAddress.value.trim();
    if (address.length < 3) {
      areaStatus.textContent = "Введите улицу и дом — так мы найдём ближайшего мастера.";
      areaStatus.className = "area-status err";
      areaAddress.focus();
      return;
    }
    const minutes = 10 + (address.length % 4) * 5;
    areaStatus.textContent = "Ближайший мастер — в " + minutes + " минутах от «" + address + "». Выезд бесплатный.";
    areaStatus.className = "area-status ok";
    if (mapCardText) mapCardText.textContent = "в " + minutes + " минутах от вас";
  });

  /* escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) closeMenu();
  });

  /* year */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
