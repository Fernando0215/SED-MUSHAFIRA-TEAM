// src/javaScript/explorarClient.js

function loadCards() {
    const searchInput = document.getElementById("searchInput");
    const cardData = [
        {
            title: "El Corral",
            description: "Lorem ipsum dolor sit amet",
            imageUrl: "/SED-MUSHAFIRA-TEAM/src/images/iglesiaIcon.jpeg",
            likes: 21300,
            comments: 12400
        },
        {
            title: "Coffee Place",
            description: "Aliquam pretium sit odio non Aliquam pretium sit odio nonAliquam pretium sit odio non",
            imageUrl: "/SED-MUSHAFIRA-TEAM/src/images/iglesiaIcon.jpeg",
            likes: 21000,
            comments: 12000
        },
        {
            title: "Food Express",
            description: "Ullamcorper amet dolor donec",
            imageUrl: "/SED-MUSHAFIRA-TEAM/src/images/iglesiaIcon.jpeg",
            likes: 21500,
            comments: 12500
        },

        {
            title: "Food Express",
            description: "Ullamcorper amet dolor donec",
            imageUrl: "../../../images/iglesiaIcon.jpeg",
            likes: 21500,
            comments: 12500
        },

        {
            title: "Food Express",
            description: "Ullamcorper amet dolor donec",
            imageUrl: "/SED-MUSHAFIRA-TEAM/src/images/iglesiaIcon.jpeg",
            likes: 21500,
            comments: 12500
        }
        // Agrega más objetos según sea necesario
    ];

    const cardGrid = document.getElementById("cardGrid");

    cardData.forEach(data => {
        // Crear el elemento de tarjeta
        const card = document.createElement("div");
        card.classList.add("card");

        // Contenido HTML de cada tarjeta
        card.innerHTML = `
            <img src="${data.imageUrl}" alt="${data.title}">
            <div class="card-content">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                <div class="card-icons">
                    <span>❤️ ${data.likes.toLocaleString()}</span>
                    <span>💬 ${data.comments.toLocaleString()}</span>
                </div>
            </div>
        `;

        // Añadir la tarjeta al grid
        cardGrid.appendChild(card);


    });

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredEmprendimientos = emprendimientos.filter(emp =>
            emp.nombre.toLowerCase().includes(query)
        );
        displayEmprendimientos(filteredEmprendimientos);
    });
}
