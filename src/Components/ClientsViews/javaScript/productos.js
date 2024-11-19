document.addEventListener("DOMContentLoaded", async function () {
    const productsContainer = document.getElementById("products-container");
    const emprendimientoId = "673bc0da14756a6865c17cea"; // ID del emprendimiento

    try {
        const response = await fetch(`http://localhost:3000/emprendimientos/${emprendimientoId}/productos`);
        if (!response.ok) {
            throw new Error('Productos no encontrados');
        }

        const productos = await response.json();
        productos.forEach(producto => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            const productImage = document.createElement("img");
            productImage.src = `http://localhost:3000${producto.imagenProducto}`;
            productImage.alt = producto.nombre;
            productImage.classList.add("product-image");

            const productName = document.createElement("h2");
            productName.textContent = producto.nombre;
            productName.classList.add("product-name");

            const productPrice = document.createElement("p");
            productPrice.textContent = `$${producto.precio}`;
            productPrice.classList.add("product-price");

            const productDescription = document.createElement("div");
            productDescription.textContent = producto.descripcion;
            productDescription.classList.add("product-description");

            productCard.appendChild(productImage);
            productCard.appendChild(productName);
            productCard.appendChild(productPrice);
            productCard.appendChild(productDescription);

            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
});
