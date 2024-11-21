document.addEventListener("DOMContentLoaded", () => {
    // Elementos compartidos
    const profileImageNav = document.getElementById("profile-image");
    const usernameSidebar = document.getElementById("username-sidebar");
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

    // Elementos específicos de la vista de Ajustes
    const profileImageForm = document.getElementById("profile-image-form");
    const uploadProfileForm = document.getElementById("upload-profile-form");
    const businessNameInput = document.getElementById("business-name");
    const businessAddressInput = document.getElementById("business-address");
    const businessEmailInput = document.getElementById("business-email");
    const businessPhoneInput = document.getElementById("business-phone");
    const saveSettingsBtn = document.getElementById("save-settings");

    // Datos del emprendimiento
    let emprendimientoData = {};

    // Función para cargar los datos del emprendimiento
    async function loadBusinessData() {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://192.68.134.131/emprendimientos/perfil", {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token
                },
            });
    
            if (!response.ok) {
                throw new Error("No se pudo cargar el perfil del emprendimiento.");
            }
    
            const emprendimientoData = await response.json();
    
            // Actualiza los campos con la información del emprendimiento
            usernameSidebar.textContent = emprendimientoData.nombreEmprendimiento || "Nombre";
            profileImageNav.src = `http://192.68.134.131${emprendimientoData.imagenEmprendimiento}`;
            businessNameInput.value = emprendimientoData.nombreEmprendimiento || "";
            businessAddressInput.value = emprendimientoData.direccion || "";
            businessEmailInput.value = emprendimientoData.correo || "";
            businessPhoneInput.value = emprendimientoData.telefono || "";
        } catch (error) {
            console.error("Error al cargar datos del emprendimiento:", error);
            alert("No se pudo cargar la información del emprendimiento.");
        }
    }
    
    

    // Función para actualizar la imagen de perfil
    function updateProfileImage(event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            profileImageNav.src = imageUrl;
            profileImageNav.style.display = "block";

            if (profileImageForm) {
                profileImageForm.src = imageUrl;
                profileImageForm.style.display = "block";
            }
        }
    }

    // Guardar cambios desde la vista de Ajustes
    async function saveBusinessSettings() {
        const formData = new FormData();
        formData.append("nombre", businessNameInput.value);
        formData.append("direccion", businessAddressInput.value);
        formData.append("correo", businessEmailInput.value);
        formData.append("telefono", businessPhoneInput.value);

        const file = uploadProfileForm.files[0];
        if (file) {
            formData.append("imagenEmprendimiento", file);
        }

        try {
            const response = await fetch("http://192.68.134.131/emprendimientos/actualizar", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar el emprendimiento.");
            }

            alert("Información del emprendimiento actualizada exitosamente.");
            await loadBusinessData(); // Recargar los datos actualizados
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            alert("Error al guardar cambios: " + error.message);
        }
    }

    // Eventos
    if (uploadProfileForm) {
        uploadProfileForm.addEventListener("change", updateProfileImage);
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", saveBusinessSettings);
    }

    // Cargar los datos al inicio
    loadBusinessData();
});
