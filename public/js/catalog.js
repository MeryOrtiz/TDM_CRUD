import { getItems, getItem } from "./services/api.js";
import { getCategoryIcon } from "./ui/ui.js";

const catalogContainer = document.getElementById("catalogContainer");
const modalOverlay     = document.getElementById("modalOverlay");
const modalClose       = document.getElementById("modalClose");
const modalCloseBtn    = document.getElementById("modalCloseBtn");

let allItems = [];
let activeCategory = "Todos";

function openModal(item) {
  document.getElementById("modalName").textContent = item.name;
  document.getElementById("modalIcon").textContent = "";

  const modalIconEl = document.getElementById("modalIcon");
  if (item.imageUrl) {
    modalIconEl.innerHTML = `<img src="${item.imageUrl}" alt="${item.name}" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;">`;
  } else {
    modalIconEl.textContent = "";
    modalIconEl.style.display = "none";
  }

  document.getElementById("modalDescription").textContent = item.description || "Sin descripción.";
  document.getElementById("modalPrice").textContent  = item.price ? "$ " + item.price.toLocaleString("es-CO") : "—";
  document.getElementById("modalStock").textContent  = item.stock !== undefined ? `${item.stock} unidades` : "—";
  document.getElementById("modalCategory").textContent = item.category || "—";
  document.getElementById("modalDate").textContent   = item.date
    ? new Date(item.date + "T00:00:00").toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  document.getElementById("modalBadge").innerHTML =
    `<span class="badge badge-${item.rarity || 'Clásico'}">${item.rarity || "Clásico"}</span>`;

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
  document.getElementById("modalIcon").style.display = "";
}

modalClose.addEventListener("click", closeModal);
modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function getStockStatus(stock) {
  if (stock === 0) return { cls: "out", label: "Agotado" };
  if (stock <= 5)  return { cls: "low", label: `Solo ${stock} disponibles` };
  return { cls: "in", label: `${stock} disponibles` };
}

function renderCard(item) {
  const { cls, label } = getStockStatus(item.stock ?? 0);

  const card = document.createElement("div");
  card.className = "item-card";

 const imgSrc = item.imageUrl || getCategoryIcon(item.category);

const imageSection = imgSrc
  ? `<div class="card-icon card-image"><img src="${imgSrc}" alt="${item.name}" onerror="this.parentElement.className='card-icon card-no-image';this.remove()"></div>`
  : `<div class="card-icon card-no-image"></div>`;
  card.innerHTML = `
    ${imageSection}
    <div class="card-header">
      <span class="card-name">${item.name}</span>
      <span class="card-category">${item.category || "Otro"}</span>
    </div>
    <span class="badge badge-${item.rarity || 'Clásico'}">${item.rarity || "Clásico"}</span>
    <div class="card-price">$ ${item.price ? item.price.toLocaleString("es-CO") : "—"} <span>COP</span></div>
    <div class="card-meta">
      <div class="stock-indicator">
        <span class="stock-dot ${cls}"></span>
        <span>${label}</span>
      </div>
      <span style="font-size:0.75rem">${item.date || ""}</span>
    </div>
    <button class="card-btn" data-id="${item.id}">Ver detalles →</button>
  `;

  card.querySelector(".card-btn").addEventListener("click", async () => {
    try {
      const full = await getItem(item.id);
      openModal(full);
    } catch {
      alert("No se pudo cargar el detalle del producto.");
    }
  });

  return card;
}

function buildFilters(items) {
  const categories = ["Todos", ...new Set(items.map(i => i.category).filter(Boolean))];

  const wrapper = document.createElement("div");
  wrapper.className = "filter-bar";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat === activeCategory ? " filter-btn--active" : "");
    btn.textContent = cat;
    btn.dataset.category = cat;

    btn.addEventListener("click", () => {
      activeCategory = cat;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
      renderFiltered();
    });

    wrapper.appendChild(btn);
  });

  return wrapper;
}

function renderFiltered() {
  const filtered = activeCategory === "Todos"
    ? allItems
    : allItems.filter(i => i.category === activeCategory);

  catalogContainer.innerHTML = "";

  if (filtered.length === 0) {
    catalogContainer.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">🔍</div>
        <p>No hay productos en esta categoría.</p>
      </div>`;
    return;
  }

  filtered.forEach(item => catalogContainer.appendChild(renderCard(item)));
}

async function loadCatalog() {
  try {
    allItems = await getItems();
    catalogContainer.innerHTML = "";

    if (allItems.length === 0) {
      catalogContainer.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="icon">🧴</div>
          <p>No hay productos en el catálogo todavía.</p>
          <p style="margin-top:0.5rem;font-size:0.85rem">
            <a href="index.html" style="color:var(--accent)">Ir a gestión</a> para agregar productos.
          </p>
        </div>`;
      return;
    }

    const wrapper = document.querySelector(".catalog-wrapper");
    const existingFilter = wrapper.querySelector(".filter-bar");
    if (existingFilter) existingFilter.remove();
    wrapper.insertBefore(buildFilters(allItems), catalogContainer);

    renderFiltered();
  } catch (err) {
    catalogContainer.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
¿        <p>Error cargando los productos.</p>
      </div>`;
    console.error(err);
  }
}

loadCatalog();