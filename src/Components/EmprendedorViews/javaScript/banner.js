document.addEventListener("DOMContentLoaded", async () => {
    const uploadInput = document.getElementById('upload-banner');
    const bannerImage = document.getElementById('banner-image');
    const uploadLabel = document.querySelector('.upload-label');

    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error("No se encontró un token. Asegúrate de iniciar sesión.");
        return;
    }

    // Subir un nuevo banner
    uploadInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("bannerImage", file);

            try {
                const response = await fetch("http://localhost:3000/emprendimientos/banner", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || "Error desconocido al actualizar el banner");
                }

                // Actualizar el banner en la interfaz
                console.log("Banner actualizado:", result.bannerImage);
                bannerImage.src = `http://localhost:3000${result.bannerImage}`;
                bannerImage.style.display = "block";
                uploadLabel.style.display = "none";
            } catch (error) {
                console.error("Error al actualizar el banner:", error);
                alert(`Error al subir el banner: ${error.message}`);
            }
        }
    });
});
