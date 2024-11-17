document.addEventListener("DOMContentLoaded", () => {
    const addProductBtn = document.getElementById("add-product-btn");
    const productModal = document.getElementById("product-modal");
    const closeModal = document.getElementById("close-modal");
    const saveProductBtn = document.getElementById("save-product-btn");
    const productList = document.getElementById("product-list");
    let editMode = false;
    let currentProductCard = null;

    // Abrir el modal para añadir producto
    addProductBtn.addEventListener("click", () => {
        editMode = false; // Modo de añadir
        clearModalFields();
        productModal.style.display = "flex";
    });

    // Cerrar el modal
    closeModal.addEventListener("click", () => {
        productModal.style.display = "none";
    });

    // Guardar o actualizar producto
    saveProductBtn.addEventListener("click", () => {
        const fileInput = document.getElementById("upload-product-image");
        const nameInput = document.getElementById("product-name");
        const descriptionInput = document.getElementById("product-description");
        const priceInput = document.getElementById("product-price");

        if (editMode && currentProductCard) {
            // Modo de edición: actualizar la tarjeta existente
            const productImage = currentProductCard.querySelector(".product-image");
            const productName = currentProductCard.querySelector(".product-name");
            const productPrice = currentProductCard.querySelector(".product-price");
            const productDescription = currentProductCard.querySelector(".product-description");

            if (fileInput.files.length > 0) {
                productImage.src = URL.createObjectURL(fileInput.files[0]);
            }
            productName.textContent = nameInput.value;
            productPrice.textContent = `$${priceInput.value}`;
            productDescription.textContent = descriptionInput.value;

            currentProductCard = null;
            editMode = false;
        } else {
            // Modo de añadir: crear una nueva tarjeta
            if (fileInput.files.length > 0 && priceInput.value) {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.onclick = () => toggleCard(productCard);

                const productImage = document.createElement("img");
                productImage.classList.add("product-image");
                productImage.src = URL.createObjectURL(fileInput.files[0]);

                const productInfo = document.createElement("div");
                productInfo.classList.add("product-info");

                const productName = document.createElement("h3");
                productName.classList.add("product-name");
                productName.textContent = nameInput.value;

                const productPrice = document.createElement("p");
                productPrice.classList.add("product-price");
                productPrice.textContent = `$${priceInput.value}`;

                const productDescription = document.createElement("p");
                productDescription.classList.add("product-description");
                productDescription.textContent = descriptionInput.value;

                // Añadir botones de eliminar y editar
                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete-btn");
                deleteBtn.textContent = "Eliminar";
                deleteBtn.onclick = (event) => {
                    event.stopPropagation();
                    productCard.remove();
                };

                const editBtn = document.createElement("button");
                editBtn.classList.add("edit-btn");
                editBtn.textContent = "Editar";
                editBtn.onclick = (event) => {
                    event.stopPropagation();
                    editMode = true;
                    currentProductCard = productCard;
                    loadProductDataIntoModal(productCard);
                    productModal.style.display = "flex";
                };

                // Añadir elementos a la tarjeta
                productInfo.appendChild(productName);
                productInfo.appendChild(productPrice);
                productInfo.appendChild(productDescription);
                productCard.appendChild(productImage);
                productCard.appendChild(productInfo);
                productCard.appendChild(deleteBtn);
                productCard.appendChild(editBtn);

                productList.appendChild(productCard);
            }
        }

        clearModalFields();
        productModal.style.display = "none";
    });

    // Función para cargar los datos de la tarjeta en el modal
    function loadProductDataIntoModal(productCard) {
        const productImage = productCard.querySelector(".product-image").src;
        const productName = productCard.querySelector(".product-name").textContent;
        const productDescription = productCard.querySelector(".product-description").textContent;
        const productPrice = productCard.querySelector(".product-price").textContent.slice(1); // Eliminar "$"

        document.getElementById("upload-product-image").value = "";
        document.getElementById("product-name").value = productName;
        document.getElementById("product-description").value = productDescription;
        document.getElementById("product-price").value = productPrice;
    }

    // Limpiar los campos del modal
    function clearModalFields() {
        document.getElementById("upload-product-image").value = "";
        document.getElementById("product-name").value = "";
        document.getElementById("product-description").value = "";
        document.getElementById("product-price").value = "";
    }

    
    // Función para expandir y colapsar la tarjeta del producto
    function toggleCard(card) {
        const allCards = document.querySelectorAll(".product-card");
        
        // Colapsa todas las tarjetas menos la actual
        allCards.forEach(c => {
            if (c !== card) c.classList.remove("expanded");
        });

        // Alterna el estado de expansión de la tarjeta actual
        card.classList.toggle("expanded");
    }
});
