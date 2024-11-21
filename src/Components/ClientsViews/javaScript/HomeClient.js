async function loadFavorites() {
    const emprendimientosContainer = document.getElementById("emprendimientosContainer");

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://192.68.134.131/clientes/favoritos", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Error al cargar favoritos:", error);
            throw new Error("Error al cargar favoritos");
        }

        const favoritos = await response.json();

        if (!Array.isArray(favoritos) || favoritos.length === 0) {
            console.warn("No se encontraron favoritos para este cliente.");
            emprendimientosContainer.innerHTML = `<p>No tienes favoritos aún.</p>`;
            return;
        }

        emprendimientosContainer.innerHTML = ""; // Limpiar contenido previo

        favoritos.forEach((emp) => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="http://192.68.134.131${emp.imagenEmprendimiento || '/uploads/defaultImage.png'}" alt="${emp.nombreEmprendimiento}">
                <div class="card-content">
                    <h3>${emp.nombreEmprendimiento}</h3>
                    <p>${emp.descripcion}</p>
                    <button class="delete-favorite" data-id="${emp._id}">Eliminar de favoritos</button>
                </div>
            `;
            emprendimientosContainer.appendChild(card);
        });

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll(".delete-favorite").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const emprendimientoId = event.target.getAttribute("data-id");
                await deleteFavorite(emprendimientoId);
            });
        });
    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        emprendimientosContainer.innerHTML = `<p>Ocurrió un error al cargar tus favoritos. Intenta nuevamente.</p>`;
    }
}

async function deleteFavorite(emprendimientoId) {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://192.68.134.131/clientes/favoritos", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ emprendimientoId }),
        });

        if (response.ok) {
            alert("Favorito eliminado correctamente");
            loadFavorites(); // Recargar favoritos después de eliminar
        } else {
            const error = await response.json();
            console.error("Error al eliminar favorito:", error);
            alert("Error al eliminar favorito.");
        }
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
    }
}

// Cargar favoritos cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", loadFavorites);
