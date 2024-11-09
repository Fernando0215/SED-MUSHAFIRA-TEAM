// src/Sidebar/javaScript/Sidebar.js

function loadSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Define el HTML del sidebar
    const sidebarHTML = `
        <div class="sidebar">
            <div class="user-info">
                <img src="../../images/userIcon.png" alt="Usuario" class="avatar">
                <p>Usuario</p>
            </div>
            <ul class="menu">
                <li><a href="../html/HomeClient.html"><img src="../../images/home-icon.png" alt="Home"> Home</a></li>
                <li><a href="../html/ajustesClient.html"><img src="../../images/camera-icon.png" alt="Ajustes"> Ajustes</a></li>
                <li><a href="../html/explorarClient.html"><img src="../../images/public-icon.png" alt="Explorar"> Explorar</a></li>
            </ul>
        </div>
    `;

    // Inserta el HTML en el contenedor especificado
    container.innerHTML = sidebarHTML;
}
