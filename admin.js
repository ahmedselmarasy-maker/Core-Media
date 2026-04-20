document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "cmPortfolioDataV1";
  const AUTH_KEY = "cmAdminAuth";
  const ADMIN_PASSCODE = "coremedia2026";

  const loginCard = document.getElementById("admin-login-card");
  const appCard = document.getElementById("admin-app-card");
  const loginForm = document.getElementById("admin-login-form");
  const logoutBtn = document.getElementById("admin-logout");

  const brandForm = document.getElementById("brand-form");
  const brandIdInput = document.getElementById("brand-id");
  const brandNameInput = document.getElementById("brand-name");
  const brandMarketInput = document.getElementById("brand-market");
  const brandEgyptCategoryInput = document.getElementById("brand-egypt-category");
  const brandResetBtn = document.getElementById("brand-reset");

  const mediaTypeInput = document.getElementById("media-type");
  const mediaFileInput = document.getElementById("media-file");
  const addMediaBtn = document.getElementById("add-media");
  const mediaListEl = document.getElementById("media-list");
  const brandListEl = document.getElementById("brand-list");

  let data = [];

  const readData = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const marketText = (brand) => {
    if (brand.market === "saudi") return "القطاع السعودي";
    const catMap = {
      restaurants: "مطاعم",
      cafes: "كافيهات",
      medical: "ميديكل",
      other: "مشاريع أخرى",
    };
    return `القطاع المصري - ${catMap[brand.egyptCategory || "other"]}`;
  };

  const selectedBrand = () =>
    data.find((b) => b.id === brandIdInput.value) || null;

  const clearForm = () => {
    brandIdInput.value = "";
    brandForm.reset();
    brandEgyptCategoryInput.disabled = brandMarketInput.value !== "egypt";
    mediaListEl.innerHTML = "";
    mediaFileInput.value = "";
    mediaTypeInput.value = "design";
  };

  const renderMediaList = () => {
    const brand = selectedBrand();
    mediaListEl.innerHTML = "";
    if (!brand) return;
    const media = Array.isArray(brand.media) ? brand.media : [];
    media.forEach((m, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${m.type === "video" ? "فيديو" : "تصميم"} ${i + 1}: ${m.file}</span>`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cm-btn cm-btn-outline";
      btn.textContent = "حذف";
      btn.addEventListener("click", () => {
        brand.media.splice(i, 1);
        saveData();
        renderMediaList();
        renderBrandList();
      });
      li.appendChild(btn);
      mediaListEl.appendChild(li);
    });
  };

  const renderBrandList = () => {
    brandListEl.innerHTML = "";
    if (!data.length) {
      brandListEl.innerHTML = "<p class='cm-admin-note'>لا توجد براندات بعد.</p>";
      return;
    }
    data.forEach((brand) => {
      const row = document.createElement("div");
      row.className = "cm-admin-brand-item";
      row.innerHTML = `
        <div>
          <strong>${brand.name}</strong>
          <div class="cm-admin-brand-meta">${marketText(brand)} - ${brand.media?.length || 0} عنصر</div>
        </div>
      `;
      const actions = document.createElement("div");
      actions.className = "cm-admin-brand-actions";
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "cm-btn";
      editBtn.textContent = "تعديل";
      editBtn.addEventListener("click", () => {
        brandIdInput.value = brand.id;
        brandNameInput.value = brand.name || "";
        brandMarketInput.value = brand.market || "egypt";
        brandEgyptCategoryInput.value = brand.egyptCategory || "other";
        brandEgyptCategoryInput.disabled = brandMarketInput.value !== "egypt";
        renderMediaList();
      });
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "cm-btn cm-btn-outline";
      delBtn.textContent = "حذف";
      delBtn.addEventListener("click", () => {
        if (!window.confirm(`حذف براند ${brand.name}؟`)) return;
        data = data.filter((b) => b.id !== brand.id);
        saveData();
        if (brandIdInput.value === brand.id) clearForm();
        renderBrandList();
      });
      actions.append(editBtn, delBtn);
      row.appendChild(actions);
      brandListEl.appendChild(row);
    });
  };

  brandMarketInput.addEventListener("change", () => {
    brandEgyptCategoryInput.disabled = brandMarketInput.value !== "egypt";
  });

  brandForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = brandNameInput.value.trim();
    if (!name) return;
    const payload = {
      name,
      market: brandMarketInput.value,
      egyptCategory: brandMarketInput.value === "egypt" ? brandEgyptCategoryInput.value : null,
    };
    const current = selectedBrand();
    if (current) {
      current.name = payload.name;
      current.market = payload.market;
      current.egyptCategory = payload.egyptCategory;
      current.media = Array.isArray(current.media) ? current.media : [];
    } else {
      const brand = {
        id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...payload,
        media: [],
      };
      data.unshift(brand);
      brandIdInput.value = brand.id;
    }
    saveData();
    renderBrandList();
    renderMediaList();
  });

  addMediaBtn.addEventListener("click", () => {
    const brand = selectedBrand();
    if (!brand) {
      window.alert("احفظ البراند أولاً ثم أضف الوسائط.");
      return;
    }
    const file = mediaFileInput.value.trim();
    if (!file) return;
    brand.media = Array.isArray(brand.media) ? brand.media : [];
    brand.media.push({ type: mediaTypeInput.value, file });
    mediaFileInput.value = "";
    saveData();
    renderMediaList();
    renderBrandList();
  });

  brandResetBtn.addEventListener("click", clearForm);

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("admin-pass")?.value || "";
    if (pass !== ADMIN_PASSCODE) {
      window.alert("كود الإدارة غير صحيح.");
      return;
    }
    sessionStorage.setItem(AUTH_KEY, "1");
    loginCard.classList.add("hidden");
    appCard.classList.remove("hidden");
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
  });

  const isAuth = sessionStorage.getItem(AUTH_KEY) === "1";
  if (isAuth) {
    loginCard.classList.add("hidden");
    appCard.classList.remove("hidden");
  }

  data = readData();
  renderBrandList();
  clearForm();
});
