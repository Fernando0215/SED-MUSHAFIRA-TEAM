document.addEventListener("DOMContentLoaded", async function () {
    const commentsContainer = document.getElementById("comments-container");
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");
    const urlParams = new URLSearchParams(window.location.search);
    const emprendimientoId = urlParams.get("id"); // Obtener ID del emprendimiento desde la URL
    const token = localStorage.getItem("authToken");

    if (!emprendimientoId) {
        console.error("No se proporcionó el ID del emprendimiento.");
        return;
    }

    // Función para cargar comentarios
    async function loadComments() {
        try {
            const response = await fetch(`http://192.168.77.39:3000/comentarios.html?id=${emprendimientoId}`);
            if (!response.ok) {throw new Error("No se pudieron cargar los comentarios.");

            }

            const data = await response.json();
    
            
            commentsContainer.innerHTML = ""; // Limpiar contenedor

            data.forEach(comentario => {
                const commentCard = `
                    <div class="comment-card">
                        <p>${comentario.contenido}</p>
                        <small>Publicado el: ${new Date(comentario.timestamp).toLocaleDateString()}</small>
                    </div>
                `;
                commentsContainer.innerHTML += commentCard;
            });
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
            commentsContainer.innerHTML = `<p>No se encontraron comentarios.</p>`;
        }
    }

    // Función para enviar un comentario
    async function submitComment(event) {
        event.preventDefault();
        const contenido = commentInput.value.trim();

        if (!contenido) return;

        try {
            const response = await fetch(`http://192.168.77.39:3000/emprendimientos/${emprendimientoId}/comentarios`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contenido }),
            });

            if (response.ok) {
                commentInput.value = ""; // Limpiar campo de texto
                loadComments(); // Recargar comentarios
            } else {
                const error = await response.json();
                console.error("Error al enviar comentario:", error);
                alert("No se pudo enviar el comentario.");
            }
        } catch (error) {
            console.error("Error al enviar comentario:", error);
        }
    }

    // Inicializar
    loadComments();
    commentForm.addEventListener("submit", submitComment);
});
