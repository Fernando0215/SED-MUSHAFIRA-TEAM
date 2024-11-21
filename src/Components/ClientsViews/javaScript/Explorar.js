async function loadCards() {
    const cardGrid = document.getElementById("cardGrid");
    const searchInput = document.getElementById("searchInput");

    // Fetch los emprendimientos desde el servidor
    async function fetchEmprendimientos() {
        try {
            const response = await fetch("http://localhost:3000/emprendimientos");
            if (!response.ok) throw new Error("No se pudieron cargar los emprendimientos.");
           
           
            return await response.json();
        } catch (error) {
            console.error("Error al cargar emprendimientos:", error);
            return [];
        }
    }

    // Renderizar las cards
    function renderCards(emprendimientos) {
        cardGrid.innerHTML = ""; // Limpiar contenido previo
        emprendimientos.forEach(emp => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="http://localhost:3000${emp.imagenEmprendimiento || '/uploads/defaultImage.png'}" alt="${emp.nombreEmprendimiento}">
                <div class="card-content">
                    <h3>${emp.nombreEmprendimiento}</h3>
                    <p>${emp.descripcion}</p>
                    <div class="card-icons">
                        <button class="like-button" data-id="${emp._id}">❤️</button>
                        <button class="details-button" data-id="${emp._id}">Ver Detalle</button>
                    </div>
                </div>
            `;
            cardGrid.appendChild(card);
        });

        // Agregar eventos a los botones de like y detalles
        document.querySelectorAll(".like-button").forEach(button => {
            button.addEventListener("click", handleLike);
        });

        document.querySelectorAll(".details-button").forEach(button => {
            button.addEventListener("click", handleDetails);
        });
    }

    // Manejar "like"
    async function handleLike(event) {
        const emprendimientoId = event.target.dataset.id;
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:3000/clientes/likes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ emprendimientoId }),
            });

            if (!response.ok) throw new Error("Error al dar like.");
            console.log("Like agregado correctamente");
        } catch (error) {
            console.error("Error al dar like:", error);
        }
    }

    // Manejar "Ver Detalle"
    function handleDetails(event) {
        const emprendimientoId = event.target.dataset.id;
        window.location.href = `./emprendimiento.html?id=${emprendimientoId}`;
    }

    // Filtro de búsqueda
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredCards = emprendimientos.filter(emp =>
            emp.nombreEmprendimiento.toLowerCase().includes(query)
        );
        renderCards(filteredCards);
    });

    // Cargar y renderizar cards al inicio
    const emprendimientos = await fetchEmprendimientos();
    
    const emprendimientosHabilitados = emprendimientos.filter(emp => emp.habilitado === true);
  
    renderCards(emprendimientosHabilitados);
}

document.addEventListener("DOMContentLoaded", loadCards);
