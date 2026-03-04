import { getItems, getItem } from "./services/api.js";
import { getCategoryIcon } from "./ui/ui.js";

const catalogContainer = document.getElementById("catalogContainer");
const modalOverlay     = document.getElementById("modalOverlay");
const modalClose       = document.getElementById("modalClose");
const modalCloseBtn    = document.getElementById("modalCloseBtn");

// ── Modal ─────────────────────────────────────────────────
function openModal(item) {
  document.getElementById("modalName").textContent = item.name;
  document.getElementById("modalIcon").textContent = getCategoryIcon(item.category);
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
}

modalClose.addEventListener("click", closeModal);
modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ── Stock ─────────────────────────────────────────────────
function getStockStatus(stock) {
  if (stock === 0) return { cls: "out", label: "Agotado" };
  if (stock <= 5)  return { cls: "low", label: `Solo ${stock} disponibles` };
  return { cls: "in", label: `${stock} disponibles` };
}

// ── Card ──────────────────────────────────────────────────
function renderCard(item) {
  const icon           = getCategoryIcon(item.category);
  const { cls, label } = getStockStatus(item.stock ?? 0);

  const card = document.createElement("div");
  card.className = "item-card";
  card.innerHTML = `
    <div class="card-icon">${icon}</div>
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

// ── Cargar catálogo ───────────────────────────────────────
async function loadCatalog() {
  try {
    const items = await getItems();
    catalogContainer.innerHTML = "";

    if (items.length === 0) {
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

    items.forEach(item => catalogContainer.appendChild(renderCard(item)));
  } catch (err) {
    catalogContainer.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">⚠️</div>
        <p>Error cargando los productos.</p>
      </div>`;
    console.error(err);
  }
}

loadCatalog();