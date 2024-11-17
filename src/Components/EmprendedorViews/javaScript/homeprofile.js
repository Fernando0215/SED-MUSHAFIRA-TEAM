document.addEventListener("DOMContentLoaded", () => {
    const profileImageNav = document.getElementById("profile-image");
    const uploadProfileNav = document.getElementById("upload-profile");
    const uploadLabelNav = document.querySelector(".upload-label-profile");

    // Función para actualizar la imagen del perfil
    function updateProfileImage(event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            profileImageNav.src = imageUrl;
            profileImageNav.style.display = "block";
            uploadLabelNav.style.display = "none";
        }
    }

    uploadProfileNav.addEventListener("change", updateProfileImage);

    // Permitir hacer clic en la imagen para abrir el explorador de archivos
    profileImageNav.addEventListener("click", () => {
        uploadProfileNav.click();
    });
});
