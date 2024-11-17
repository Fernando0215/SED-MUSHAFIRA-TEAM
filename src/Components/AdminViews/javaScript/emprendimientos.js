// Simulación de datos dinámicos
const emprendimientos = [
    {
        nombre: "El corral",
        direccion: "1ª CALLE ORIENTE 11, Santa Tecla",
        telefono: "74887817",
        correo: "corral@gmail.com",
        descripcion: "Somos una empresa de asados",
        imagen: "../../../images/emprendimiento.png"
    },
    {
        nombre: "Food Express",
        direccion: "1ª CALLE ORIENTE 11, Santa Tecla",
        telefono: "74887817",
        correo: "foodexpress@gmail.com",
        descripcion: "Somos un restaurante de comida rápida china",
        imagen: "../../../images/emprendimiento.png"
    },
    {
        nombre: "La Pizzeria",
        direccion: "Av. Sur 21, San Salvador",
        telefono: "75678911",
        correo: "pizzeria@gmail.com",
        descripcion: "Deliciosas pizzas italianas",
        imagen: "../../../images/emprendimiento.png"
    }
];

// Contenedor de tarjetas
const container = document.getElementById("emprendimientos-container");

// Barra de búsqueda
const searchInput = document.querySelector(".search-bar");

// Función para mostrar los emprendimientos en el contenedor
function displayEmprendimientos(emprendimientos) {
    // Limpiar el contenedor antes de agregar nuevas tarjetas
    container.innerHTML = "";

    emprendimientos.forEach(emprendimiento => {
        // Crear elementos
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = emprendimiento.imagen;
        img.alt = emprendimiento.nombre;

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info";

        const title = document.createElement("h3");
        title.textContent = emprendimiento.nombre;

        const direccion = document.createElement("p");
        direccion.textContent = `Dirección: ${emprendimiento.direccion}`;

        const telefono = document.createElement("p");
        telefono.textContent = `Teléfono: ${emprendimiento.telefono}`;

        const correo = document.createElement("p");
        correo.textContent = `Correo: ${emprendimiento.correo}`;

        const descripcion = document.createElement("p");
        descripcion.textContent = `Descripción: ${emprendimiento.descripcion}`;

        const buttons = document.createElement("div");
        buttons.className = "card-buttons";

        const acceptBtn = document.createElement("button");
        acceptBtn.className = "button-accept";
        acceptBtn.textContent = "Aceptar";

        const declineBtn = document.createElement("button");
        declineBtn.className = "button-decline";
        declineBtn.textContent = "Declinar";

        // Agregar elementos al DOM
        cardInfo.append(title, direccion, telefono, correo, descripcion);
        buttons.append(acceptBtn, declineBtn);
        card.append(img, cardInfo, buttons);
        container.appendChild(card);
    });
}

// Renderizar los emprendimientos iniciales
displayEmprendimientos(emprendimientos);

// Evento para filtrar cuando el usuario escribe en la barra de búsqueda
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredEmprendimientos = emprendimientos.filter(emp =>
        emp.nombre.toLowerCase().includes(query)
    );
    displayEmprendimientos(filteredEmprendimientos);
});

