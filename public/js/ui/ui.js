const CATEGORY_IMAGES = {
  "Base":    "https://www.shutterstock.com/image-illustration/liquid-makeup-foundation-bottle-cosmetic-600nw-2600539727.jpg",
  "Ojos":    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMeRPYLY3_p882l3iBkuu2Pu_I3bP3dUHrxg&s",
  "Labios":  "https://png.pngtree.com/png-clipart/20240715/original/pngtree-beauty-lipstick-makeup-cartoon-png-image_15563295.png",
  "Rostro":  "https://previews.123rf.com/images/vaselena/vaselena2008/vaselena200800003/153570663-face-of-woman-without-makeup-and-many-various-beauty-products-around-concept-of-creating-beautiful.jpg",
  "Fijador": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSidFodch1EQPC8oo6lSujcnnso6bbgNYKhSQ&s",
  "Otro":    "https://thumbs.dreamstime.com/z/elementos-de-maquillaje-ilustraci%C3%B3n-estilo-dibujo-dibujos-animados-simple-arte-digital-d-280661388.jpg"
};

export function getCategoryIcon(category) {
  return CATEGORY_IMAGES[category] || "";
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
    document.getElementById("formTitle").textContent = "Nuevo Producto";
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