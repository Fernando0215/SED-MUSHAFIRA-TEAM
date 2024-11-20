document.addEventListener("DOMContentLoaded", async function () {
    const profileImage = document.getElementById("profile-image");
    const username = document.querySelector(".username");
    const uploadLabel = document.querySelector(".upload-label-profile");

    // Obtener el token almacenado tras el login
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error("No se encontró un token. Por favor, inicia sesión.");
        return;
    }

    try {
        // Decodificar el token para obtener el ID del emprendimiento
        const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
        const emprendimientoId = tokenPayload.id; // Asegúrate de que el ID esté incluido en el token

        // Hacer una solicitud para obtener el perfil del emprendimiento autenticado
        const response = await fetch(`http://localhost:3000/emprendimientos/${emprendimientoId}`, {
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
            profileImage.src = `http://localhost:3000${emprendimiento.imagenEmprendimiento}`;
            profileImage.style.display = "block";
            uploadLabel.style.display = "none";
        }

        // Mostrar el nombre del emprendimiento
        username.textContent = emprendimiento.nombreEmprendimiento || "Nombre";

    } catch (error) {
        console.error("Error al cargar el perfil del emprendimiento:", error);
    }
});
