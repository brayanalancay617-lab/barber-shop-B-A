const carritoIcono = document.querySelector(".carrito-icono");
const contadorCarrito = document.querySelector(".contador-carrito");
const menuCarrito = document.querySelector(".menu-carrito");
const listaCarrito = document.querySelector(".lista-carrito");
const totalCarrito = document.querySelector(".total-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let botonVaciar; // referencia global del botón

// === FUNCIÓN PRINCIPAL: actualizar el carrito ===
function actualizarCarrito() {
  contadorCarrito.textContent = carrito.length;

  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.image}" alt="${item.nombre}" 
           style="width:40px; height:40px; border-radius:8px; margin-right:10px;">
      ${item.nombre} - <strong>$${item.precio}</strong>
      <button class="eliminar" data-index="${index}">❌</button>
    `;
    listaCarrito.appendChild(li);
    total += item.precio;
  });

  totalCarrito.textContent = `$${total}`;
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // 👇 Mostrar u ocultar el botón "Vaciar carrito"
  if (botonVaciar) {
    botonVaciar.style.display = carrito.length > 0 ? "block" : "none";
  }
}

// === Delegación de eventos para eliminar productos ===
listaCarrito.addEventListener("click", e => {
  if (e.target.classList.contains("eliminar")) {
    const index = e.target.dataset.index;
    carrito.splice(index, 1);
    actualizarCarrito();
  }
});

// === Escuchar botones "Agregar al carrito" ===
document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".btn-agregar");

  botones.forEach(boton => {
    boton.addEventListener("click", e => {
      e.preventDefault();
      const nombre = boton.dataset.nombre;
      const precio = parseFloat(boton.dataset.precio.replace("$", ""));
      const image = boton.dataset.image;

      // Evitar duplicados
      const yaExiste = carrito.some(item => item.nombre === nombre);
      if (yaExiste) {
        alert("Ya tenés este producto en tu carrito.");
        return;
      }

      carrito.push({ nombre, precio, image });
      actualizarCarrito();
    });
  });

  // Mostrar / ocultar menú del carrito
  carritoIcono.addEventListener("click", () => {
    menuCarrito.classList.toggle("visible");
  });

  // Crear botón "Vaciar carrito"
  botonVaciar = document.createElement("button");
  botonVaciar.classList.add("btn-vaciar");
  botonVaciar.textContent = "🗑️ Vaciar carrito";
  menuCarrito.appendChild(botonVaciar);

  // Vaciar carrito completo
  botonVaciar.addEventListener("click", () => {
    if (carrito.length === 0) return;

    const confirmar = confirm("¿Seguro que querés vaciar todo el carrito?");
    if (confirmar) {
      carrito = [];
      actualizarCarrito();
      lanzarMonedas(10);
      alert("🗑️ Carrito vaciado con éxito.");
    }
  });

  actualizarCarrito(); // inicializar vista del carrito

  // === BOTÓN PAGAR ===
  const botonPagar = document.querySelector(".btn-pagar");
  if (botonPagar) {
    botonPagar.addEventListener("click", () => {
      if (carrito.length === 0) {
        alert("🛒 Tu carrito está vacío. ¡Agregá algún producto primero!");
        return;
      }

      botonPagar.innerText = "Procesando...";
      botonPagar.style.background = "linear-gradient(90deg, #ff00ff, #8a47ff)";
      botonPagar.disabled = true;

      setTimeout(() => {
        lanzarMonedas(25);
        mostrarMensajeExito();
        carrito = [];
        actualizarCarrito();
        botonPagar.innerText = "Pagar ahora";
        botonPagar.disabled = false;
      }, 2000);
    });
  }
});

// === EFECTO VISUAL DE MONEDAS ===
function lanzarMonedas(cantidad = 20) {
  const contenedor = document.getElementById("efecto-monedas");

  for (let i = 0; i < cantidad; i++) {
    const moneda = document.createElement("div");
    moneda.classList.add("moneda");
    moneda.style.left = Math.random() * 100 + "vw";
    moneda.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
    moneda.style.width = moneda.style.height = 20 + Math.random() * 20 + "px";
    contenedor.appendChild(moneda);

    // Eliminar moneda después de caer
    setTimeout(() => moneda.remove(), 2000);
  }
}

function mostrarMensajeExito() {
  const mensaje = document.getElementById("mensaje-exito");
  if (!mensaje) return;
  mensaje.classList.add("mostrar");
  setTimeout(() => mensaje.classList.remove("mostrar"), 3000);
}