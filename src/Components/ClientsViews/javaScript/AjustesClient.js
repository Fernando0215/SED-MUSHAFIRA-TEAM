document.addEventListener("DOMContentLoaded", async () => {
    
    // Lógica para cargar el perfil del cliente
    const token = localStorage.getItem("authToken");
    const profileContent = document.querySelector(".profile-content");

    try {
        const response = await fetch("http://localhost:3000/clientes/perfil", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const cliente = await response.json();

        if (response.ok) {
            profileContent.innerHTML = `
                <img class="profile-img" src="${cliente.fotoPerfil || '/uploads/defaultImage.png'}" alt="Imagen de usuario">
                <h2 class="user-name">${cliente.nombre} ${cliente.apellido}</h2>
                <p>Email: ${cliente.correoElectronico}</p>
                <p>Numero de telefono: ${cliente.infoContacto}</p>
                <button id="edit-profile">Editar perfil</button>
            `;

            document.getElementById("edit-profile").addEventListener("click", () => {
                openEditModal(cliente);
            });
        } else {
            console.error("Error al obtener el perfil:", cliente.error);
        }
    } catch (error) {
        console.error("Error al cargar el perfil:", error);
    }
});

function openEditModal(cliente) {
    const existingModal = document.getElementById("edit-modal");
    if (existingModal) return;

    const modalHTML = `
        <div id="edit-modal" class="modal">
            <div class="modal-content">
                <span id="close-modal" class="close">&times;</span>
                <h2>Editar Perfil</h2>
                <form id="edit-form">
                    <div class="form-group">
                        <label for="edit-nombre">Nombre:</label>
                        <input type="text" id="edit-nombre" value="${cliente.nombre}">
                    </div>
                    <div class="form-group">
                        <label for="edit-apellido">Apellido:</label>
                        <input type="text" id="edit-apellido" value="${cliente.apellido}">
                    </div>
                    <div class="form-group">
                        <label for="edit-email">Email:</label>
                        <input type="email" id="edit-email" value="${cliente.correoElectronico}">
                    </div>
                    <div class="form-group">
                        <label for="edit-telefono">Teléfono:</label>
                        <input type="text" id="edit-telefono" value="${cliente.infoContacto}">
                    </div>
                    <div class="form-group">
                        <label for="edit-foto">Foto de Perfil:</label>
                        <input type="file" id="edit-foto">
                    </div>
                    <button type="submit" class="save-btn">Guardar</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("edit-modal").remove();
    });

    document.getElementById("edit-form").addEventListener("submit", saveProfile);
}


async function saveProfile(event) {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("nombre", document.getElementById("edit-nombre").value);
    formData.append("apellido", document.getElementById("edit-apellido").value);
    formData.append("correoElectronico", document.getElementById("edit-email").value);
    formData.append("infoContacto", document.getElementById("edit-telefono").value);

    const fileInput = document.getElementById("edit-foto").files[0];
    if (fileInput) formData.append("fotoPerfil", fileInput);

    try {
        const response = await fetch("http://localhost:3000/clientes/perfil", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert("Perfil actualizado exitosamente.");
            location.reload();
        } else {
            const error = await response.json();
            console.error("Error al actualizar el perfil:", error);
            alert("Error al actualizar el perfil.");
        }
    } catch (error) {
        console.error("Error al guardar el perfil:", error);
        alert("Error al guardar el perfil.");
    }
}