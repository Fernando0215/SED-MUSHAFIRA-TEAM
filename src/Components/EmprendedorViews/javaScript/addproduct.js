document.addEventListener("DOMContentLoaded", async () => {
    const addProductBtn = document.getElementById("add-product-btn");
    const productModal = document.getElementById("product-modal");
    const closeModal = document.getElementById("close-modal");
    const saveProductBtn = document.getElementById("save-product-btn");
    const productList = document.getElementById("product-list");

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2JjMGRhMTQ3NTZhNjg2NWMxN2NlYSIsIm5vbWJyZSI6InphcGF0aXRvcyBib25pdG9zIiwiaW5mb0NvbnRhY3RvIjoiNzg5MDQ4MzkzNCIsImlhdCI6MTczMTk5MDgwNywiZXhwIjoxNzMxOTk0NDA3fQ.3teeYo3aGuk1BMDw3rh8emN3kNT6C4TXCzpKnSUX3AE"; // Asegúrate de usar el token generado
    const emprendimientoId = "673bc0da14756a6865c17cea";

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
                throw new Error("Error al guardar el producto");
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
