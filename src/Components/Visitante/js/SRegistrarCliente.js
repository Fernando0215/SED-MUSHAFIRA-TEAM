async function loadCards() {
    const searchInput = document.getElementById("searchInput");
    const cardGrid = document.getElementById("cardGrid");

    // Limpiar el grid antes de cargar
    cardGrid.innerHTML = '';

    try {
        // Solicitud a la API para obtener los emprendimientos
        const response = await fetch('http://localhost:3000/emprendimientos');
        
        if (!response.ok) {
            throw new Error('Error al cargar los emprendimientos desde la API');
        }

        // Convertir respuesta en JSON
        const emprendimientos = await response.json();

        // Generar las tarjetas con los datos obtenidos
        emprendimientos.forEach(emp => {
            const card = document.createElement("div");
            card.classList.add("card");

            // Contenido HTML de la tarjeta
            card.innerHTML = `
                <img src="/SED-MUSHAFIRA-TEAM/src/images/defaultImage.png" alt="${emp.nombre}">
                <div class="card-content">
                    <h3>${emp.nombre}</h3>
                    <p>${emp.descripcion || "Sin descripción disponible"}</p>
                    <div class="card-icons">
                        <span>❤️ 0</span> <!-- Placeholder para likes -->
                        <span>💬 0</span> <!-- Placeholder para comentarios -->
                    </div>
                </div>
            `;

            cardGrid.appendChild(card);
        });

        // Filtrado de búsqueda (ya implementado)
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filteredEmprendimientos = emprendimientos.filter(emp =>
                emp.nombre.toLowerCase().includes(query)
            );
            displayEmprendimientos(filteredEmprendimientos);
        });
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al cargar los emprendimientos.');
    }
}

function displayEmprendimientos(emprendimientos) {
    const cardGrid = document.getElementById("cardGrid");
    cardGrid.innerHTML = ''; // Limpiar el grid

    emprendimientos.forEach(emp => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="/SED-MUSHAFIRA-TEAM/src/images/defaultImage.png" alt="${emp.nombre}">
            <div class="card-content">
                <h3>${emp.nombre}</h3>
                <p>${emp.descripcion || "Sin descripción disponible"}</p>
                <div class="card-icons">
                    <span>❤️ 0</span>
                    <span>💬 0</span>
                </div>
            </div>
        `;
        cardGrid.appendChild(card);
    });
}

// Llamar a la función al cargar la página
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadCards();
} else {
    window.addEventListener('DOMContentLoaded', loadCards);
}
