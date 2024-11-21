document.addEventListener("DOMContentLoaded", () => {
    fetchClientes();  // Load emprendimientos on page load
});

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

       
        // Agregar elementos al DOM
        buttons.append(deleteBtn, disableBtn);
        card.append(name, comment, faltas, buttons);
        clientsContainer.appendChild(card);

        // Agregar evento para deshabilitar cliente
        disableBtn.addEventListener("click", () => {
            // Llamar a la función para deshabilitar el emprendimiento
            disableCliente(cliente._id); 
             // Refresh the list after disabling // Asegúrate de que 'id' es el identificador único de cada emprendimiento
        });

        
    });
}

// Renderizar los clientes iniciales
//displayClientes(clientes);





async function disableCliente(id) {
    try {
        // Realizar la solicitud PATCH (o PUT dependiendo de la API)
        const response = await fetch(`http://192.168.77.39:3000/admin/clientes/${id}`, { // Reemplaza con la URL de tu API
            method: "PATCH",  // O usa "PUT" si es necesario
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                habilitado: false,  // Cambiar el campo 'habilitado' a false
            }),
        });
        console.log("Deshabilitar emprendimiento con ID:", id);  // Verificar que el ID se pasa correctamente
        console.log(response);
        if (!response.ok) {
            throw new Error("No se pudo deshabilitar el emprendimiento");
        }

        // Si la solicitud es exitosa, puedes actualizar la vista o realizar otras acciones
        alert("Emprendimiento deshabilitado exitosamente");
        fetchClientes();  // Vuelve a cargar los emprendimientos actualizados
    } catch (error) {
        console.error("Error al deshabilitar el cliente:", error);
    }
}

// Función para obtener los emprendimientos habilitados
async function fetchClientes() {
    try {
        
        const response = await fetch("http://192.168.77.39:3000/clientes", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }); // Reemplaza con la URL de tu API
        const data = await response.json();
        console.log(data);

        
       // Filter only enabled emprendimientos
       const clientesHabilitados = data.filter(cliente => cliente.habilitado === true);
       displayClientes(clientesHabilitados);

    
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
    }
}




// Evento para filtrar clientes cuando el usuario escribe en la barra de búsqueda
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(query)
    );
    displayClientes(filteredClientes);
});
