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

  /* palette */
  const scales = [
    { name: "Grayscale", note: "10 steps", colors: ["#0b0b14", "#16161f", "#26262f", "#3a3a45", "#55555f", "#7a7a85", "#a6a6b0", "#d2d2d8", "#e8e8ec", "#f5f5f7"] },
    { name: "Indigo", note: "Brand", colors: ["#1e1e9e", "#2a2ad6", "#3b3bf0", "#5a5af5", "#7c7cf8", "#9e9efa", "#bfbffc", "#d9d9fd", "#ededfe", "#f6f6ff"] },
    { name: "Purple", note: "Accent", colors: ["#4c1d95", "#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff", "#faf8ff"] },
    { name: "Blue", note: "Info", colors: ["#1e3a8a", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#eff6ff", "#f8fbff"] },
    { name: "Yellow", note: "Warning", colors: ["#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#fff7ed", "#fffbf5"] },
    { name: "Green", note: "Success", colors: ["#064e3b", "#047857", "#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5", "#ecfdf5", "#f5fef9"] },
    { name: "Cyan", note: "Data", colors: ["#155e75", "#0e7490", "#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#a5f3fc", "#cffafe", "#ecfeff", "#f6feff"] },
    { name: "Teal", note: "Calm", colors: ["#134e4a", "#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1", "#f0fdfa", "#f7fffd"] },
    { name: "Red", note: "Danger", colors: ["#7f1d1d", "#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2", "#fef2f2", "#fff8f8"] },
    { name: "Pink", note: "Playful", colors: ["#831843", "#be185d", "#db2777", "#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8", "#fce7f3", "#fdf2f8", "#fff8fc"] }
  ];

  function readable(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 158 ? "#15152c" : "#ffffff";
  }

  const paletteGrid = document.getElementById("paletteGrid");
  if (paletteGrid) {
    paletteGrid.innerHTML = scales.map((scale) => {
      const swatches = scale.colors.map((hex) => {
        return '<button class="swatch" type="button" data-hex="' + hex.toUpperCase() + '" style="background:' + hex + ";color:" + readable(hex) + '" aria-label="Copy ' + hex.toUpperCase() + '"><span>' + hex.slice(1).toUpperCase() + "</span></button>";
      }).join("");
      return '<div class="palette-row"><div class="palette-name"><strong>' + scale.name + "</strong><span>" + scale.note + '</span></div><div class="palette-swatches">' + swatches + "</div></div>";
    }).join("");
  }

  /* toast */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  if (paletteGrid) {
    paletteGrid.addEventListener("click", (e) => {
      const swatch = e.target.closest(".swatch");
      if (!swatch) return;
      const hex = swatch.dataset.hex;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).catch(() => {});
      }
      showToast("Copied " + hex);
    });
  }

  /* chips */
  const chipRow = document.getElementById("chipRow");
  if (chipRow) {
    chipRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".ui-chip");
      if (!chip) return;
      chipRow.querySelectorAll(".ui-chip").forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", String(on));
      });
    });
  }

  /* sample form */
  const form = document.getElementById("sampleForm");
  const emailInput = document.getElementById("sampleEmail");
  const status = document.getElementById("sampleStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!emailRe.test(email)) {
      status.textContent = "That email doesn't look right — mind checking it?";
      status.className = "sample-status err";
      emailInput.focus();
      return;
    }
    status.textContent = "On its way to " + email + ". Check your inbox in a minute.";
    status.className = "sample-status ok";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) closeMenu();
  });
})();
