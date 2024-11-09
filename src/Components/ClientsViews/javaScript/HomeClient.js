document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://red-lucky-cuttlefish.cyclic.app/api/v1";
    const cardsContainer = document.getElementById("cards");

    // Función para obtener los emprendimientos de la API
    const fetchEmprendimientos = async () => {
        try {
            const response = await fetch(`${BASE_URL}/emprendimientos`);
            const data = await response.json();
            renderEmprendimientos(data.data);
        } catch (error) {
            console.error("Error al obtener productos", error);
        }
    };

    // Función para renderizar los emprendimientos en la página
    const renderEmprendimientos = (emprendimientos) => {
        cardsContainer.innerHTML = ""; // Limpiar contenido previo
        emprendimientos.forEach((emprendimiento) => {
            const card = document.createElement("section");
            card.classList.add("main-card");
            card.innerHTML = `
                <div class="card-content">
                    <div class="content-left">
                        <button>
                            <img class="full-img" src="${emprendimiento.imagenEmprendimiento}" alt="${emprendimiento.nombreEmprendimiento}">
                        </button>
                    </div>
                    <div class="content-right">
                        <h2 class="EmprenName">${emprendimiento.nombreEmprendimiento}</h2>
                        <p>${emprendimiento.descripcion}</p>
                        <button class="like-button" data-id="${emprendimiento._id}">
                            <div class="tag">
                                <img class="icon" src="../images/heartIcon.png" alt="Corazón">
                            </div>
                        </button>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    };

    // Función para manejar el clic en el botón "like"
    const handleLikeClick = (emprendimientoId) => {
        const likeButton = document.querySelector(`button[data-id="${emprendimientoId}"] .icon`);
        if (likeButton.src.includes("heartIcon.png")) {
            likeButton.src = "images/heartFullIcon.png";
        } else {
            likeButton.src = "images/heartIcon.png";
        }
    };

    // Evento para capturar los clics en los botones "like"
    cardsContainer.addEventListener("click", (e) => {
        if (e.target.closest(".like-button")) {
            const emprendimientoId = e.target.closest(".like-button").dataset.id;
            handleLikeClick(emprendimientoId);
        }
    });

    // Ejecutar la función para obtener y mostrar los emprendimientos al cargar la página
    fetchEmprendimientos();
});
