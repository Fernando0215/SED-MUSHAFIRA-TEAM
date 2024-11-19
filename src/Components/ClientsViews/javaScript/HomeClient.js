fetchClientePerfil();


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

async function fetchClientePerfil() {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('jwtToken'); // Or sessionStorage or any other secure place

    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        // Make the GET request to the /clientes/perfil route
        const response = await fetch('http://localhost:3000/clientes/perfil', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add the token to the Authorization header
            }
        });

        // Check if the response is OK (status code 200)
        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized - Please login again');
                // Handle the case where the token is invalid or expired
                return;
            }
            throw new Error('Failed to fetch cliente perfil');
        }

        // Parse the JSON response
        const clienteData = await response.json();

        // Display the cliente profile data (you can update the UI with the data)
        console.log('Cliente data:', clienteData);

        // Example of how you might display it on the page
        document.getElementById('clienteName').innerText = clienteData.nombre;
        document.getElementById('clienteEmail').innerText = clienteData.email;
        // Continue to display other profile data as needed

    } catch (error) {
        console.error('Error fetching cliente perfil:', error);
    }
}

// Call the fetchClientePerfil function to load the profile
