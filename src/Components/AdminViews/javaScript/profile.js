document.addEventListener("DOMContentLoaded", () => {
    // Elementos de la imagen y los inputs de archivo
    const profileImageNav = document.getElementById("profile-image");
    const profileImageForm = document.getElementById("profile-image-form");
    const uploadProfileNav = document.getElementById("upload-profile");
    const uploadProfileForm = document.getElementById("upload-profile-form");
    const uploadLabelNav = document.querySelector(".upload-label-profile"); // Label para la imagen en el nav
    const uploadLabelForm = document.querySelector(".upload-label-profile-form"); // Label para la imagen en el formulario (asegúrate de tener esta clase en el HTML)

    // Elementos para actualizar el nombre
    const usernameSidebar = document.getElementById("username-sidebar");
    const businessNameInput = document.getElementById("business-name");
    
    // Función para actualizar ambas imágenes
    function updateProfileImage(event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            // Actualiza la imagen en ambas ubicaciones
            profileImageNav.src = imageUrl;
            profileImageForm.src = imageUrl;
            profileImageNav.style.display = "block";
            profileImageForm.style.display = "block";
            uploadLabelNav.style.display = "none";
            uploadLabelForm.style.display = "none";
        }
    }

    // Escucha los cambios en ambos inputs de archivo y aplica la actualización
    uploadProfileNav.addEventListener("change", updateProfileImage);
    uploadProfileForm.addEventListener("change", updateProfileImage);

    // Permitir hacer clic en las imágenes para abrir el explorador de archivos
    profileImageNav.addEventListener("click", () => {
        uploadProfileNav.click();
    });

    profileImageForm.addEventListener("click", () => {
        uploadProfileForm.click();
    });

    // Función para actualizar el nombre en la barra lateral
    document.getElementById("save-settings").addEventListener("click", () => {
        // Obtener el valor del input de nombre
        const newName = businessNameInput.value;
        // Actualizar el nombre en la barra lateral
        usernameSidebar.textContent = newName;
    });
});
