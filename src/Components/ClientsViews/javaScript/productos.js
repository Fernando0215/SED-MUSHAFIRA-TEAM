// Simulación de datos quemados para los productos
const productos = [
    {
        nombre: "Orange",
        precio: "$8.00",
        imagen: "../../../images/postre.jpg",
        descripcion: "Un delicioso postre de naranja, ideal para cualquier momento del día."
    },
    {
        nombre: "Banana",
        precio: "$5.00",
        imagen: "../../../images/postre.jpg",
        descripcion: "Suave y delicioso, el postre de banana es un clásico que encanta."
    },
    {
        nombre: "Apple",
        precio: "$7.50",
        imagen: "../../../images/postre.jpg",
        descripcion: "Un postre ligero de manzana, perfecto para los amantes de lo dulce."
    },
    {
        nombre: "Strawberry",
        precio: "$9.00",
        imagen: "../../../images/postre.jpg",
        descripcion: "Fresas frescas en un postre dulce que es una explosión de sabor."
    }
];

// Contenedor de productos
const productsContainer = document.getElementById("products-container");

// Función para cargar productos dinámicamente
function cargarProductos() {
    productos.forEach(producto => {
        // Crear la tarjeta de producto
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // Imagen del producto
        const productImage = document.createElement("img");
        productImage.src = producto.imagen;
        productImage.alt = producto.nombre;
        productImage.classList.add("product-image");

        // Nombre del producto
        const productName = document.createElement("h2");
        productName.textContent = producto.nombre;
        productName.classList.add("product-name");

        // Precio del producto
        const productPrice = document.createElement("p");
        productPrice.textContent = producto.precio;
        productPrice.classList.add("product-price");

        // Descripción del producto
        const productDescription = document.createElement("div");
        productDescription.textContent = producto.descripcion;
        productDescription.classList.add("product-description");

        // Evento para mostrar descripción
        productCard.addEventListener("click", () => {
            productCard.classList.toggle("active");
        });

        // Añadir elementos a la tarjeta
        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);
        productCard.appendChild(productDescription);

        // Añadir la tarjeta al contenedor
        productsContainer.appendChild(productCard);
    });
}

// Llamar a la función para cargar los productos
cargarProductos();

