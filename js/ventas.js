// ventas.js - Tienda con Carrito de Compras (Versión Corregida)

import { productos } from "./productos.js";

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  countEl.textContent = totalItems;
}

function renderizarProductos() {
  const contenedor = document.getElementById("productos-grid");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    const precioFormateado = producto.precio.toLocaleString("es-AR");

    const cardHTML = `
      <article class="producto-card">
        <div class="producto-imagen">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
        </div>
        <div class="producto-info">
          <h3>${producto.nombre}</h3>
          <p class="producto-desc">${producto.descripcion || ""}</p>
          
          <div class="producto-precio">
            <span class="precio-label">Precio:</span>
            <span class="precio-valor">$${precioFormateado}</span>
          </div>
          
          <button class="btn-carrito" data-id="${producto.id}">
            <img src="../img/carrito-de-compras.png" alt="Carrito" />
            Agregar al Carrito
          </button>
        </div>
      </article>
    `;
    contenedor.innerHTML += cardHTML;
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  const itemExistente = carrito.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1,
    });
  }

  guardarCarrito();
  alert(`✅ ${producto.nombre} agregado al carrito`);
}

function renderizarCarrito() {
  const contenedor = document.getElementById("cart-items");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    document.getElementById("cart-total-amount").textContent = "$0";
    return;
  }

  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const precioFormateado = item.precio.toLocaleString("es-AR");
    const subtotalFormateado = subtotal.toLocaleString("es-AR");

    contenedor.innerHTML += `
      <div class="cart-item">
        <img src="${item.imagen}" alt="${item.nombre}">
        <div class="cart-item-info">
          <h4>${item.nombre}</h4>
          <p>$${precioFormateado} × ${item.cantidad}</p>
          <strong>Subtotal: $${subtotalFormateado}</strong>
        </div>
        <button class="btn-remove" data-index="${index}">Eliminar</button>
      </div>
    `;
  });

  document.getElementById("cart-total-amount").textContent =
    "$" + total.toLocaleString("es-AR");
}

// ==================== EVENTOS ====================
document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos();
  actualizarContadorCarrito();

  // Agregar al carrito
  const productosGrid = document.getElementById("productos-grid");
  if (productosGrid) {
    productosGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-carrito");
      if (btn) {
        const id = parseInt(btn.getAttribute("data-id"));
        agregarAlCarrito(id);
      }
    });
  }

  // Abrir modal del carrito
  const btnCart = document.getElementById("btn-cart");
  if (btnCart) {
    btnCart.addEventListener("click", () => {
      const modal = document.getElementById("cart-modal");
      if (modal) {
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add("show"), 10);
        renderizarCarrito();
      }
    });
  }

  // Cerrar modal
  const closeModal = () => {
    const modal = document.getElementById("cart-modal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  };

  const btnCloseCart = document.getElementById("btn-close-cart");
  if (btnCloseCart) {
    btnCloseCart.addEventListener("click", closeModal);
  }

  // Cerrar al hacer clic fuera
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) closeModal();
    });
  }

  // Eliminar producto del carrito
  const cartItems = document.getElementById("cart-items");
  if (cartItems) {
    cartItems.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-remove");
      if (btn) {
        const index = parseInt(btn.getAttribute("data-index"));
        carrito.splice(index, 1);
        guardarCarrito();
        renderizarCarrito();
      }
    });
  }

  // Vaciar carrito
  const btnEmptyCart = document.getElementById("btn-empty-cart");
  if (btnEmptyCart) {
    btnEmptyCart.addEventListener("click", () => {
      if (confirm("¿Estás seguro de vaciar el carrito?")) {
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
      }
    });
  }

  // Finalizar compra
  const btnCheckout = document.getElementById("btn-checkout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      if (carrito.length === 0) return;
      alert("🎉 ¡Gracias por tu compra! (Esta es una demostración)");
      carrito = [];
      guardarCarrito();
      closeModal();
    });
  }
});
