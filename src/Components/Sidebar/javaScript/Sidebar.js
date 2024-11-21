async function loadSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch("http://localhost:3000/clientes/perfil", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const cliente = await response.json();

        if (response.ok) {
            const sidebarHTML = `
                <div class="user-info">
                    <img src="${cliente.fotoPerfil || '/path/to/default/image.jpg'}" alt="Usuario" class="avatar">
                    <p>${cliente.nombre} ${cliente.apellido}</p>
                </div>
                <ul class="menu">
                    <li><a href="../../ClientsViews/html/HomeClient.html"><span>🏠</span> Home</a></li>
                    <li><a href="../../ClientsViews/html/index.html"><span>📷</span> Ajustes</a></li>
                    <li><a href="../../ClientsViews/html/explorar.html"><span>🌍</span> Explorar</a></li>
                </ul>
            `;
            container.innerHTML = sidebarHTML;
        } else {
            console.error("Error al cargar el sidebar:", cliente.error);
        }
    } catch (error) {
        console.error("Error al cargar el sidebar:", error);
    }
}
