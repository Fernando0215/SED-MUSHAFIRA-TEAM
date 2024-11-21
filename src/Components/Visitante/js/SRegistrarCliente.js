async function loadCards() {
    const searchInput = document.getElementById("searchInput");
    const cardGrid = document.getElementById("cardGrid");

    cardGrid.innerHTML = '';

    try {
        const response = await fetch('http://192.68.134.131/emprendimientos');
        if (!response.ok) {
            throw new Error('Error al cargar los emprendimientos desde la API');
        }

        const emprendimientos = await response.json();

        emprendimientos.forEach(emp => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="http://192.68.134.131${emp.imagenEmprendimiento || '/uploads/defaultImage.png'}" alt="${emp.nombreEmprendimiento}">
                <div class="card-content">
                    <h3>${emp.nombreEmprendimiento}</h3>
                    <p>${emp.descripcion || "Sin descripción disponible"}</p>
                    <div class="card-icons">
                        <button class="like-btn">❤️</button>
                    </div>
                </div>
            `;

            // Redirigir al detalle del emprendimiento
            card.addEventListener('click', () => {
                window.location.href = `../../ClientsViews/html/emprendimiento.html?id=${emp._id}`;
            });

            // Manejar el botón de like
            const likeBtn = card.querySelector('.like-btn');
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar redirección al detalle
                const isRegistered = false; // Cambia según tu lógica de autenticación
                if (!isRegistered) {
                    alert('Si deseas guardar el emprendimiento como favorito, regístrate');
                } else {
                    alert(`¡Diste like a ${emp.nombreEmprendimiento}!`);
                }
            });

            cardGrid.appendChild(card);
        });

        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filteredEmprendimientos = emprendimientos.filter(emp =>
                emp.nombreEmprendimiento.toLowerCase().includes(query)
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
            <img src="http://192.68.134.131${emp.imagenEmprendimiento}" alt="${emp.nombreEmprendimiento}">
            <div class="card-content">
                <h3>${emp.nombreEmprendimiento}</h3>
                <p>${emp.descripcion || "Sin descripción disponible"}</p>
                <div class="card-icons">
                    <button class="like-btn">❤️</button>
                </div>
            </div>
        `;

        // Redirigir al detalle del emprendimiento
        card.addEventListener('click', () => {
            window.location.href = `../../ClientsViews/html/emprendimiento.html?id=${emp._id}`;
        });

        // Manejar el botón de like
        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar redirección al detalle
            const isRegistered = false; // Cambia según tu lógica de autenticación
            if (!isRegistered) {
                alert('Si deseas guardar el emprendimiento como favorito, regístrate');
            } else {
                alert(`¡Diste like a ${emp.nombreEmprendimiento}!`);
            }
        });

        cardGrid.appendChild(card);
    });
}

// Función para manejar la barra de búsqueda
function attachSearchHandler(emprendimientos) {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredEmprendimientos = emprendimientos.filter(emp =>
            emp.nombreEmprendimiento.toLowerCase().includes(query)
        );
        displayEmprendimientos(filteredEmprendimientos);
    });
}

// Cargar tarjetas desde la API
async function loadCards() {
    const cardGrid = document.getElementById("cardGrid");
    cardGrid.innerHTML = '';

    try {
        const response = await fetch('http://192.68.134.131/emprendimientos');
        if (!response.ok) {
            throw new Error('Error al cargar los emprendimientos desde la API');
        }

        const emprendimientos = await response.json();
        displayEmprendimientos(emprendimientos);
        attachSearchHandler(emprendimientos);
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al cargar los emprendimientos.');
    }
}

// Llamar a la función al cargar la página
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadCards();
} else {
    window.addEventListener('DOMContentLoaded', loadCards);
}