async function loadEmprendimientos() {
    const emprendimientosContainer = document.getElementById("emprendimientosContainer");
    const searchInput = document.getElementById("searchInput");

    // Fetch the client profile data from the server
    async function fetchClientProfile() {
        try {
            const token = localStorage.getItem("authToken"); // Adjust this based on where you store the token
            if (!token) {
                throw new Error("Authorization token not found");
            }

            const response = await fetch('http://localhost:3000/clientes/perfil', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching client profile:", errorData);
                return;
            }

            const cliente = await response.json();
            console.log("Client Profile:", cliente);
            // You could display client info here if needed, e.g., name in the UI.
        } catch (error) {
            console.error("Failed to load client profile:", error.message);
        }
    }

    // Sample emprendimientos array
    const emprendimientos = [
        { id: 1, nombre: "El corral", descripcion: "Lorem ipsum dolor sit amet", imagen: "/SED-MUSHAFIRA-TEAM/src/images/ImgChat.png" },
        { id: 2, nombre: "Coffee Place", descripcion: "Aliquam pretium sit odio non", imagen: "/SED-MUSHAFIRA-TEAM/src/images/lessIcon.png" },
        { id: 3, nombre: "Food Express", descripcion: "Ullamcorper amet dolor donec", imagen: "/SED-MUSHAFIRA-TEAM/src/images/ImgChat.png" },
    ];

    function displayEmprendimientos(filteredEmprendimientos) {
        emprendimientosContainer.innerHTML = ""; // Clear the container

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

    // Display all emprendimientos initially
    displayEmprendimientos(emprendimientos);

    // Event to filter emprendimientos based on search input
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredEmprendimientos = emprendimientos.filter(emp =>
            emp.nombre.toLowerCase().includes(query)
        );
        displayEmprendimientos(filteredEmprendimientos);
    });

    // Fetch the client profile data when the page loads
    await fetchClientProfile();
}

// Call loadEmprendimientos on page load
document.addEventListener("DOMContentLoaded", loadEmprendimientos);
