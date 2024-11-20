document.addEventListener("DOMContentLoaded", async function () {
    const productsContainer = document.getElementById("products-container");
    const urlParams = new URLSearchParams(window.location.search); // Obtener ID del emprendimiento desde la URL
    const emprendimientoId = urlParams.get("id"); // Asegúrate de que el ID esté en la URL como ?id=emprendimientoId

    if (!emprendimientoId) {
        console.error("No se proporcionó el ID del emprendimiento.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/emprendimientos/${emprendimientoId}/productos`);
        if (!response.ok) {
            throw new Error('Productos no encontrados');
        }

        const productos = await response.json();
        productsContainer.innerHTML = ""; // Limpiar contenedor

        productos.forEach(producto => {
            const productCard = `
                <div class="product-card">
                    <img src="http://localhost:3000${producto.imagenProducto}" alt="${producto.nombre}" class="product-image">
                    <h2 class="product-name">${producto.nombre}</h2>
                    <p class="product-price">$${producto.precio}</p>
                    <p class="product-description">${producto.descripcion}</p>
                </div>
            `;
            productsContainer.innerHTML += productCard;
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        productsContainer.innerHTML = `<p>No se encontraron productos para este emprendimiento.</p>`;
    }
});
