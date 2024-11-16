function loadEmprendimientos() {
    const emprendimientosContainer = document.getElementById("emprendimientosContainer");
    const searchInput = document.getElementById("searchInput");

    const emprendimientos = [
        { id: 1, nombre: "El corral", descripcion: "Lorem ipsum dolor sit amet", imagen: "/SED-MUSHAFIRA-TEAM/src/images/ImgChat.png" },
        { id: 2, nombre: "Coffee Place", descripcion: "Aliquam pretium sit odio non", imagen: "/SED-MUSHAFIRA-TEAM/src/images/lessIcon.png" },
        { id: 3, nombre: "Food Express", descripcion: "Ullamcorper amet dolor donec", imagen: "/SED-MUSHAFIRA-TEAM/src/images/ImgChat.png" },
        { id: 4, nombre: "Food Express", descripcion: "Ullamcorper amet dolor donec", imagen: "/SED-MUSHAFIRA-TEAM/src/images/ImgChat.png" },
        { id: 5, nombre: "Food Express", descripcion: "Ullamcorper amet dolor donec", imagen: "/SED-MUSHAFIRA-TEAM/src/images/ImgChat.png" },
        { id: 6, nombre: "Food Express", descripcion: "Ullamcorper amet dolor donec", imagen: "/SED-MUSHAFIRA-TEAM/src/images/ImgChat.png" },

    ];

    function displayEmprendimientos(filteredEmprendimientos) {
        emprendimientosContainer.innerHTML = ""; // Limpiar contenedor

        filteredEmprendimientos.forEach(emp => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${emp.imagen}" alt="${emp.nombre}">
                <div class="content">
                    <h3>${emp.nombre}</h3>
                    <p>${emp.descripcion}</p>
                </div>
                <button class="like-button">❤️</button>
            `;

            emprendimientosContainer.appendChild(card);
        });
    }

    // Mostrar todos los emprendimientos al cargar la página
    displayEmprendimientos(emprendimientos);

    // Evento para filtrar cuando el usuario escribe en la barra de búsqueda
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredEmprendimientos = emprendimientos.filter(emp =>
            emp.nombre.toLowerCase().includes(query)
        );
        displayEmprendimientos(filteredEmprendimientos);
    });
}
