const CATEGORY_ICONS = {
  "Base":     "🫧",
  "Ojos":     "👁️",
  "Labios":   "💋",
  "Rostro":   "✨",
  "Fijador":  "💨",
  "Otro":     "💄"
};

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || "💄";
}

export function renderItems(items, tableBody) {
  tableBody.innerHTML = "";
  if (items.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:2rem">No hay productos registrados.</td></tr>`;
    return;
  }
  items.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category || "—"}</td>
      <td style="color:var(--accent);font-weight:700">${item.price ? "$ " + item.price.toLocaleString("es-CO") : "—"}</td>
      <td>${item.stock ?? "—"}</td>
      <td><span class="badge badge-${item.rarity || 'Clásico'}">${item.rarity || "—"}</span></td>
      <td>
        <button class="btn-edit" data-id="${item.id}">Editar</button>
        <button class="btn-delete" data-id="${item.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

export function resetForm(form, submitBtn) {
  form.reset();
  if (submitBtn) {
    submitBtn.textContent = "Agregar Producto";
    document.getElementById("formTitle").textContent = "✨ Nuevo Producto";
  }
}

export function fillForm(form, item, submitBtn) {
  form.querySelector("#name").value        = item.name        || "";
  form.querySelector("#description").value = item.description || "";
  form.querySelector("#category").value    = item.category    || "";
  form.querySelector("#price").value       = item.price       || "";
  form.querySelector("#stock").value       = item.stock       ?? "";
  form.querySelector("#rarity").value      = item.rarity      || "";
  form.querySelector("#date").value        = item.date        || "";
  if (submitBtn) {
    submitBtn.textContent = "Guardar Cambios";
    document.getElementById("formTitle").textContent = "✏️ Editando: " + item.name;
  }
}