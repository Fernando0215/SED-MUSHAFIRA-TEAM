document.addEventListener("DOMContentLoaded", async function () {
    const profileImage = document.getElementById("profile-image");
    const username = document.querySelector(".username");
    const uploadLabel = document.querySelector(".upload-label-profile");

    const emprendimientoId = "673bc0da14756a6865c17cea"; // ID del emprendimiento

    try {
        const response = await fetch(`http://localhost:3000/emprendimientos/${emprendimientoId}`);
        if (!response.ok) {
            throw new Error("Emprendimiento no encontrado");
        }

        const emprendimiento = await response.json();

        if (emprendimiento.imagenEmprendimiento) {
            profileImage.src = `http://localhost:3000${emprendimiento.imagenEmprendimiento}`;
            profileImage.style.display = "block";
            uploadLabel.style.display = "none";
        }

        username.textContent = emprendimiento.nombreEmprendimiento || "Nombre";
    } catch (error) {
        console.error("Error al cargar la imagen de perfil:", error);
    }
});
