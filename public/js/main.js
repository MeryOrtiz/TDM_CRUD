import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm } from "./ui/ui.js";

const form      = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
let editingId   = null;

tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);

  if (btn.classList.contains("btn-delete")) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteItem(id);
      loadItems();
    } catch {
      alert("No se pudo eliminar el producto.");
    }
  } else if (btn.classList.contains("btn-edit")) {
    try {
      if (editingId === id) { resetForm(form, submitBtn); editingId = null; return; }
      const item = await getItem(id);
      fillForm(form, item, submitBtn);
      editingId = id;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("No se pudo cargar el producto para edición.");
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name:        form.querySelector("#name").value,
    description: form.querySelector("#description").value,
    category:    form.querySelector("#category").value,
    price:       Number(form.querySelector("#price").value),
    stock:       Number(form.querySelector("#stock").value),
    rarity:      form.querySelector("#rarity").value,
    date:        form.querySelector("#date").value
  };

  if (!data.name) { alert("El nombre del producto es obligatorio"); return; }

  try {
    if (editingId) { await updateItem(editingId, data); editingId = null; }
    else           { await createItem(data); }
    resetForm(form, submitBtn);
    loadItems();
  } catch {
    alert("No se pudo guardar el producto.");
  }
});

async function loadItems() {
  try {
    const items = await getItems();
    renderItems(items, tableBody);
  } catch {
    alert("No se pudieron cargar los productos.");
  }
}

loadItems();