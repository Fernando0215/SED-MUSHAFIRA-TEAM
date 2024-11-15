// src/Components/Navbar/javaScript/MainNavbar.js

function loadNavbar(containerId, childrenContent = "") {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    // HTML del Navbar
    const navbarHTML = `
      <div class="navbar">
        <div class="navbar-container">
          <img class="logo" src="/SED-MUSHAFIRA-TEAM/src/images/logo.png" alt="Logo">
          <h3 class="title">El-Paseo-Conecta</h3>
          <div id="navbar-children">${childrenContent}</div>
        </div>
      </div>
    `;
  
    // Inserta el Navbar en el contenedor
    container.innerHTML = navbarHTML;
  }
  