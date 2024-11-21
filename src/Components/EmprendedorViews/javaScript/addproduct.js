document.addEventListener("DOMContentLoaded", async () => {
    const addProductBtn = document.getElementById("add-product-btn");
    const productModal = document.getElementById("product-modal");
    const closeModal = document.getElementById("close-modal");
    const saveProductBtn = document.getElementById("save-product-btn");
    const productList = document.getElementById("product-list");

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Debe iniciar sesión para gestionar productos.");
        return;
    }

    // Abrir modal
    addProductBtn.addEventListener("click", () => {
        productModal.style.display = "flex";
    });

    // Cerrar modal
    closeModal.addEventListener("click", () => {
        productModal.style.display = "none";
    });

    // Guardar producto
    saveProductBtn.addEventListener("click", async () => {
        const nameInput = document.getElementById("product-name").value;
        const descriptionInput = document.getElementById("product-description").value;
        const priceInput = document.getElementById("product-price").value;
        const fileInput = document.getElementById("upload-product-image").files[0];

        if (!nameInput || !descriptionInput || !priceInput || !fileInput) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nameInput);
        formData.append("descripcion", descriptionInput);
        formData.append("precio", priceInput);
        formData.append("imagenProducto", fileInput);


        if (fileInput.name.trim() === "") {
            alert("El archivo no tiene un nombre válido.");
            return;
        }


        try {
            const response = await fetch("http://192.68.134.131/productos", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            const producto = result.producto;

            // Añadir producto a la lista
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="http://192.68.134.131${producto.imagenProducto}" alt="${producto.nombre}" />
                <h3>${producto.nombre}</h3>
                <p>Descripción: ${producto.descripcion}</p>
                <p>$${producto.precio.toFixed(2)}</p>
            `;

            // Mostrar descripción al hacer clic
            productCard.addEventListener("click", () => {
                alert(producto.descripcion);
            });

            productList.appendChild(productCard);

            // Limpiar el modal y cerrarlo
            document.getElementById("product-name").value = "";
            document.getElementById("product-description").value = "";
            document.getElementById("product-price").value = "";
            document.getElementById("upload-product-image").value = "";
            productModal.style.display = "none";
        } catch (error) {
            alert("Error al guardar el producto: " + error.message);
        }
    });

    // Cargar productos existentes
    try {

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const emprendimientoId = tokenPayload.id;



        const response = await fetch(`http://192.68.134.131/productos?id=${emprendimientoId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al cargar productos. Status: ${response.status}`);
        }

        const productos = await response.json();
        productos.forEach((producto) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="http://192.68.134.131${producto.imagenProducto}" alt="${producto.nombre}" />
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio.toFixed(2)}</p>
            `;
            productCard.addEventListener("click", () => {
                alert(producto.descripcion);
            });

            productList.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
});
