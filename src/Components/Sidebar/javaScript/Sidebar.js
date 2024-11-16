// src/Sidebar/javaScript/Sidebar.js

function loadSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // HTML del sidebar con rutas relativas a la carpeta 'html'
    const sidebarHTML = `
        <div class="sidebar">
            <div class="user-info">
                <img src="SED-MUSHAFIRA-TEAM/src/images/userIcon.png" alt="Usuario" class="avatar">
                <p>Usuario</p>
            </div>
            <ul class="menu">
                <li><a href="../../ClientsViews/html/HomeClient.html"><span>🏠</span> Home</a></li>
                <li><a href="../../ClientsViews/html/index.html"><span>📷</span> Ajustes</a></li>
                <li><a href="../../ClientsViews/html/explorar.html"><span>🌍</span> Explorar</a></li>
            </ul>
        </div>
    `;

    // Inserta el HTML en el contenedor especificado
    container.innerHTML = sidebarHTML;
}
