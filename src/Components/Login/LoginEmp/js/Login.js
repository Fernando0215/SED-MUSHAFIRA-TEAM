const form = document.getElementById("login-form");
const errorMessagesContainer = document.createElement('div');
errorMessagesContainer.classList.add('error-messages');
form.prepend(errorMessagesContainer);

const showErrorMessages = (messages) => {
    errorMessagesContainer.innerHTML = '';
    messages.forEach((message) => {
        const errorElement = document.createElement('p');
        errorElement.textContent = '⚠️ ' + message;
        errorMessagesContainer.appendChild(errorElement);
    });
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const correoElectronico = document.getElementById("user-name").value;
    const contrasenna = document.getElementById("user-password").value;
    const errorMessages = [];

    if (!correoElectronico) {
        errorMessages.push("El correo no puede estar vacío.");
    }
    if (!contrasenna) {
        errorMessages.push("La contraseña no puede estar vacía.");
    }


    // Validate that inputs are not empty
    if (!correo) {
        errorMessages.push("User cannot be empty.");
    }
    if (!validateEmail(correo)) {
        errorMessages.push('Porfavor ingresa un correo electrónico válido');
    } 
    if (!password) {
        errorMessages.push("Password cannot be empty.");
    }

    const formData = new FormData(form);
    


    // Show error messages if any are present and stop the submission
    if (errorMessages.length > 0) {
        showErrorMessages(errorMessages);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ correoElectronico, contrasenna }),

            body: JSON.stringify({ correo, password })

        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            if (data.role === 'cliente') {
                window.location.href = "/src/Components/ClientsViews/html/HomeClient.html";

            } else if (data.role === 'emprendedor') {
                window.location.href = '/src/Components/EmprendedorViews/html/emprendedormenu.html';
            }
        } else {
            const errorMsg = data.message || "Invalid email or password. Please try again.";
            showErrorMessages([errorMsg]);
        }
        
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        showErrorMessages(["Ocurrió un error. Por favor, inténtalo de nuevo."]);
    }
});

function closeView() {
    window.location.href = 'HomeClient.html';  // Or your desired redirect URL
}


    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

