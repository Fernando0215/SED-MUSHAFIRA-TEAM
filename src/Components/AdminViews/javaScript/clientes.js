// Simulación de datos dinámicos
const clientes = [
    {
        nombre: "Estrellita 101",
        comentario: "Es que son unos hijos de puta",
        faltas: 0
    },
    {
        nombre: "Luna Azul",
        comentario: "No entregaron mi pedido a tiempo, no se que les pasa que no hacen bien su trabajo",
        faltas: 2
    },
    {
        nombre: "Brillo de Sol",
        comentario: "La comida estaba fría",
        faltas: 1
    }
];

// Contenedor de tarjetas
const clientsContainer = document.getElementById("clients-container");

// Barra de búsqueda
const searchInput = document.querySelector(".search-bar");

// Función para mostrar los clientes en el contenedor
function displayClientes(clientes) {
    // Limpiar el contenedor antes de agregar nuevas tarjetas
    clientsContainer.innerHTML = "";

    clientes.forEach(cliente => {
        // Crear elementos
        const card = document.createElement("div");
        card.className = "card";

        const name = document.createElement("h3");
        name.textContent = cliente.nombre;

        const comment = document.createElement("p");
        comment.textContent = `Comentario: ${cliente.comentario}`;

        const faltas = document.createElement("p");
        faltas.textContent = `Faltas: ${cliente.faltas}`;

        const buttons = document.createElement("div");
        buttons.className = "card-buttons";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "button-delete";
        deleteBtn.textContent = "Borrar comentario";

        const disableBtn = document.createElement("button");
        disableBtn.className = "button-disable";
        disableBtn.textContent = "Deshabilitar inmediatamente";

        // Agregar evento para borrar comentario
        deleteBtn.addEventListener("click", () => {
            alert(`Comentario de "${cliente.nombre}" eliminado.`);
            cliente.comentario = "Comentario eliminado";
            displayClientes(clientes); // Volver a renderizar las tarjetas
        });

        // Agregar evento para deshabilitar cliente
        disableBtn.addEventListener("click", () => {
            alert(`Cliente "${cliente.nombre}" deshabilitado.`);
            clientes.splice(clientes.indexOf(cliente), 1); // Eliminar cliente
            displayClientes(clientes); // Volver a renderizar las tarjetas
        });

        // Agregar elementos al DOM
        buttons.append(deleteBtn, disableBtn);
        card.append(name, comment, faltas, buttons);
        clientsContainer.appendChild(card);
    });
}

// Renderizar los clientes iniciales
displayClientes(clientes);

// Evento para filtrar clientes cuando el usuario escribe en la barra de búsqueda
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(query)
    );
    displayClientes(filteredClientes);
});
