document.addEventListener("DOMContentLoaded", () => {
    fetchEmprendimientos();  // Load emprendimientos on page load
});

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
        declineBtn.textContent = "Deshabilidar";


        

        // Agregar elementos al DOM
        cardInfo.append(title, direccion, telefono, correo, descripcion);
        buttons.append(acceptBtn, declineBtn);
        card.append(img, cardInfo, buttons);
        container.appendChild(card);

        // Agregar evento al botón "Deshabilitar"
        declineBtn.addEventListener("click", () => {
            // Llamar a la función para deshabilitar el emprendimiento
            disableEmprendimiento(emprendimiento._id); 
             // Refresh the list after disabling // Asegúrate de que 'id' es el identificador único de cada emprendimiento
        });
    });
}

// Renderizar los emprendimientos iniciales
//displayEmprendimientos(emprendimientos);




async function disableEmprendimiento(id) {
    try {
        // Realizar la solicitud PATCH (o PUT dependiendo de la API)
        const response = await fetch(`http://192.168.77.39/admin/emprendimientos/${id}`, { // Reemplaza con la URL de tu API
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
        fetchEmprendimientos();  // Vuelve a cargar los emprendimientos actualizados
    } catch (error) {
        console.error("Error al deshabilitar el emprendimiento:", error);
    }
}



// Función para obtener los emprendimientos habilitados
async function fetchEmprendimientos() {
    try {
        
        const response = await fetch("http://192.168.77.39/emprendimientos", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }); // Reemplaza con la URL de tu API
        const data = await response.json();
        console.log(data);

        
       // Filter only enabled emprendimientos
       const emprendimientosHabilitados = data.filter(emp => emp.habilitado === true);
       displayEmprendimientos(emprendimientosHabilitados);

    
    } catch (error) {
        console.error("Error al obtener los emprendimientos:", error);
    }
}



// Evento para filtrar cuando el usuario escribe en la barra de búsqueda
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredEmprendimientos = emprendimientos.filter(emp =>
        emp.nombre.toLowerCase().includes(query)
    );
    //displayEmprendimientos(filteredEmprendimientos);
 // Refresh the list after disabling // Asegúrate de que 'id' es el identificador único de cada emprendimiento

});

