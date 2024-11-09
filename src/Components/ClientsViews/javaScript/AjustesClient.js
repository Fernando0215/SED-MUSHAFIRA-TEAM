document.addEventListener("DOMContentLoaded", function() {
    // Sidebar logic and interactions if needed
    const userIcon = document.querySelector(".avatar");
    userIcon.src = "/src/images/userIcon.png"; // Ruta a la imagen del usuario
    
    const sidebar = document.querySelector(".sidebar");
    sidebar.innerHTML = `
        <div class="user-info">
            <img src="/src/images/userIcon.png" alt="Usuario" class="avatar">
            <p>Usuario</p>
        </div>
        <ul class="menu">
            <li><a href="/Home-Cliente"><span>🏠</span> Home</a></li>
            <li><a href="/Ajustes-Cliente"><span>📷</span> Ajustes</a></li>
            <li><a href="/Explorar-Cliente"><span>🌍</span> Explorar</a></li>
        </ul>
    `;
});
