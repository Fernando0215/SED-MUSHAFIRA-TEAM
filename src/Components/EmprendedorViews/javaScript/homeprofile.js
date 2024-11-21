document.addEventListener("DOMContentLoaded", async function () {
    const profileImage = document.getElementById("profile-image");
    const username = document.querySelector(".username");
    const uploadLabel = document.querySelector(".upload-label-profile");
    const commentsContainer = document.getElementById("comments-container");

    // Obtener el token almacenado tras el login
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error("No se encontró un token. Por favor, inicia sesión.");
        return;
    }

    // Obtener el ID del emprendimiento
    let emprendimientoId = localStorage.getItem("emprendimientoId");

    if (!emprendimientoId) {
        try {
            // Si el ID no está en el localStorage, obténlo del token
            const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
            emprendimientoId = tokenPayload.id;

            // Guarda el ID en el localStorage para usos futuros
            localStorage.setItem("emprendimientoId", emprendimientoId);
        } catch (error) {
            console.error("No se pudo decodificar el token para obtener el ID del emprendimiento:", error);
            return;
        }
    }

    try {
        // Hacer una solicitud para obtener el perfil del emprendimiento autenticado
        const response = await fetch(`http://192.68.134.131/emprendimientos/${emprendimientoId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener el perfil del emprendimiento");
        }

        const emprendimiento = await response.json();

        // Mostrar imagen de perfil si existe
        if (emprendimiento.imagenEmprendimiento) {
            profileImage.src = emprendimiento.imagenEmprendimiento;
            profileImage.style.display = "block";
            uploadLabel.style.display = "none";
        } else {
            profileImage.style.display = "none";
            uploadLabel.style.display = "block";
        }

        // Mostrar el nombre del emprendimiento
        username.textContent = emprendimiento.nombreEmprendimiento || "Nombre";

        // Cargar los comentarios del emprendimiento
        await loadComments(emprendimientoId, token);
    } catch (error) {
        console.error("Error al cargar el perfil del emprendimiento:", error);
    }

    // Función para cargar comentarios
    async function loadComments(emprendimientoId, token) {
        try {
            const response = await fetch(`http://192.68.134.131/comentarios?id=${emprendimientoId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al cargar los comentarios.");
            }

            const comentarios = await response.json();

            commentsContainer.innerHTML = ""; // Limpia el contenedor

            if (Array.isArray(comentarios) && comentarios.length > 0) {
                comentarios.forEach(comentario => {
                    const commentCard = document.createElement("div");
                    commentCard.classList.add("comment-card");
                    commentCard.innerHTML = `
                        <p>${comentario.contenido}</p>
                        <small>Publicado el: ${new Date(comentario.timestamp).toLocaleDateString()}</small>
                    `;
                    commentsContainer.appendChild(commentCard);
                });
            } else {
                commentsContainer.innerHTML = "<p>No hay comentarios para este emprendimiento.</p>";
            }
        } catch (error) {
            console.error("Error al cargar los comentarios:", error);

            if (commentsContainer) {
                commentsContainer.innerHTML = "<p>Error al cargar los comentarios.</p>";
            }
        }
    }
});
