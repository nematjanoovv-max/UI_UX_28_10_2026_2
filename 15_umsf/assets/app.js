(() => {
  const list = document.getElementById("reviewList");
  const pager = document.getElementById("pagination");
  const firstPage = list.innerHTML;
  let page = 1;

  const star = '<svg><use href="#i-star"/></svg>';
  const stars = `<div class="stars" role="img" aria-label="Оценка 5 из 5">${star.repeat(5)}</div>`;

  const reviewHTML = (r) => `
    <article class="review">
      <div class="review-top">
        <div class="review-meta">
          <h2 class="review-name">${r.name}</h2>
          <time class="review-date" datetime="${r.iso}">${r.date}</time>
        </div>
        ${stars}
      </div>
      <p class="review-text">${r.text.replace(/\n/g, '<br class="br-desk">')}</p>
    </article>`;

  const pages = {
    1: firstPage,
    2: [
      {
        name: "Екатерина Морозова", date: "14.01.2022", iso: "2022-01-14",
        text: "Покупали для сына 7 лет. Первую неделю будильник срабатывал почти каждую ночь, потом всё реже. Сейчас просыпается сам, бывают сухие ночи подряд. Главное — не ругать ребёнка и не сдаваться после первых дней."
      },
      {
        name: "Ирина", date: "02.03.2022", iso: "2022-03-02",
        text: "Устройство небольшое, крепится к пижаме удобно, ребёнок не замечает. Звенит громко, но не пугает. Дочка стала спокойнее спать, потому что знает: если что, будильник разбудит."
      },
      {
        name: "Павел Кузнецов", date: "21.04.2022", iso: "2022-04-21",
        text: "Сначала сомневался, что поможет. Взяли на пробу, и через месяц увидели результат: ночей без происшествий стало заметно больше. Спасибо за подробную инструкцию и быструю доставку."
      },
      {
        name: "Марина", date: "09.06.2022", iso: "2022-06-09",
        text: "Дочке 6 лет, боялись, что испугается звука. Настроили громкость, всё прошло спокойно. Через две недели она сама просит надеть будильник перед сном. Очень рады покупке."
      }
    ],
    3: [
      {
        name: "Ольга Петрова", date: "18.08.2022", iso: "2022-08-18",
        text: "Заказывали в июле, пришло быстро, упаковано аккуратно. Пользуемся второй месяц. Ребёнок стал увереннее, перестал стесняться ночевать у бабушки — берём будильник с собой."
      },
      {
        name: "Дмитрий", date: "05.10.2022", iso: "2022-10-05",
        text: "Работает как обещано. Понравилось, что есть несколько режимов и всё настраивается без сложных инструкций. Сын быстро привык, для нас это главное."
      },
      {
        name: "Анна", date: "22.12.2022", iso: "2022-12-22",
        text: "Помогло не сразу, примерно через три недели. Но результат есть, и это здорово. Поддержка ответила на все вопросы и подсказала, как правильно подобрать режим."
      },
      {
        name: "Сергей", date: "16.02.2023", iso: "2023-02-16",
        text: "Спасибо за устройство и за то, что не пришлось идти к врачу с этой деликатной темой. Ночью наконец высыпаемся всей семьёй. Рекомендую родителям, которые устали менять постель."
      }
    ]
  };

  function render() {
    list.innerHTML = page === 1 ? firstPage : pages[page].map(reviewHTML).join("");
    pager.querySelectorAll("[data-page]").forEach((btn) => {
      const target = btn.dataset.page;
      if (target === "prev" || target === "next") {
        btn.disabled = target === "prev" ? page === 1 : page === 3;
      } else {
        const active = Number(target) === page;
        btn.classList.toggle("is-active", active);
        if (active) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      }
    });
  }

  pager.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-page]");
    if (!btn || btn.disabled) return;
    const target = btn.dataset.page;
    const next = target === "prev" ? page - 1 : target === "next" ? page + 1 : Number(target);
    if (next === page || next < 1 || next > 3) return;
    page = next;
    render();
    document.getElementById("reviews").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  render();

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  const closeMenu = () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Открыть меню");
  };
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });

  // Order dialog
  const dialog = document.getElementById("orderDialog");
  const form = document.getElementById("orderForm");
  const body = document.getElementById("orderBody");
  const success = document.getElementById("orderSuccess");
  const nameInput = document.getElementById("orderName");
  const phoneInput = document.getElementById("orderPhone");
  const errorEl = document.getElementById("orderError");

  const resetDialog = () => {
    form.reset();
    body.hidden = false;
    success.hidden = true;
    errorEl.textContent = "";
    nameInput.removeAttribute("aria-invalid");
    phoneInput.removeAttribute("aria-invalid");
  };

  document.querySelectorAll("[data-order]").forEach((btn) => {
    btn.addEventListener("click", () => {
      resetDialog();
      dialog.showModal();
      setTimeout(() => nameInput.focus(), 60);
    });
  });
  document.getElementById("orderClose").addEventListener("click", () => dialog.close());
  document.getElementById("successClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  phoneInput.addEventListener("input", () => {
    let digits = phoneInput.value.replace(/\D/g, "");
    if (!digits) { phoneInput.value = ""; return; }
    if (digits[0] === "8") digits = "7" + digits.slice(1);
    if (digits[0] !== "7") digits = "7" + digits;
    digits = digits.slice(0, 11);
    let out = "+7";
    if (digits.length > 1) out += " (" + digits.slice(1, 4);
    if (digits.length >= 5) out += ") " + digits.slice(4, 7);
    if (digits.length >= 8) out += "-" + digits.slice(7, 9);
    if (digits.length >= 10) out += "-" + digits.slice(9, 11);
    phoneInput.value = out;
  });

  nameInput.addEventListener("input", () => {
    nameInput.removeAttribute("aria-invalid");
    errorEl.textContent = "";
  });
  phoneInput.addEventListener("input", () => {
    phoneInput.removeAttribute("aria-invalid");
    errorEl.textContent = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const digits = phoneInput.value.replace(/\D/g, "");
    let error = "";
    if (name.length < 2) {
      error = "Укажите имя — хотя бы 2 символа.";
      nameInput.setAttribute("aria-invalid", "true");
    } else if (digits.length < 11) {
      error = "Введите телефон полностью: +7 (___) ___-__-__.";
      phoneInput.setAttribute("aria-invalid", "true");
    }
    if (error) {
      errorEl.textContent = error;
      (name.length < 2 ? nameInput : phoneInput).focus();
      return;
    }
    body.hidden = true;
    success.hidden = false;
    success.querySelector("button").focus();
  });
})();
