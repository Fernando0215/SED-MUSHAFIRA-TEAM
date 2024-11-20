document.addEventListener("DOMContentLoaded", async () => {
    const addProductBtn = document.getElementById("add-product-btn");
    const productModal = document.getElementById("product-modal");
    const closeModal = document.getElementById("close-modal");
    const saveProductBtn = document.getElementById("save-product-btn");
    const productList = document.getElementById("product-list");

    if (!saveProductBtn) {
        console.error("El botón 'Guardar' no se encontró en el DOM. Verifica el ID.");
        return;
    }

    const token = localStorage.getItem('authToken'); // Obtén el token dinámicamente

    if (!token) {
        console.error("No se encontró un token. Asegúrate de iniciar sesión.");
        return;
    }

    // Abrir modal para añadir producto
    addProductBtn.addEventListener("click", () => {
        productModal.style.display = "flex";
    });

    // Cerrar modal
    closeModal.addEventListener("click", () => {
        productModal.style.display = "none";
    });

    // Guardar producto
    saveProductBtn.addEventListener("click", async () => {
        const nameInput = document.getElementById("product-name");
        const descriptionInput = document.getElementById("product-description");
        const priceInput = document.getElementById("product-price");
        const fileInput = document.getElementById("upload-product-image");

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("nombre", nameInput.value);
        formData.append("descripcion", descriptionInput.value);
        formData.append("precio", priceInput.value);
        if (file) formData.append("imagenProducto", file);

        try {
            const response = await fetch("http://localhost:3000/productos", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || "Error al guardar el producto");
            }

            const { producto } = await response.json();
            console.log("Producto creado:", producto);

            // Actualizar lista de productos
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="http://localhost:3000${producto.imagenProducto}" alt="${producto.nombre}" />
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>$${producto.precio}</p>
            `;
            productList.appendChild(productCard);
            

            productModal.style.display = "none";
        } catch (error) {
            console.error(error);
        }
    });
});
