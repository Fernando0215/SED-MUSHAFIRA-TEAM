// Select the form and add an event listener for form submission
const form = document.getElementById("login-form");
const errorMessagesContainer = document.createElement('div');
errorMessagesContainer.classList.add('error-messages');
form.prepend(errorMessagesContainer); // Add the error message container to the form

const showErrorMessages = (messages) => {
    errorMessagesContainer.innerHTML = ''; // Clear previous messages
    messages.forEach((message) => {
        const errorElement = document.createElement('p');
        errorElement.textContent = '⚠️ ' + message; // Add icon before the message
        errorMessagesContainer.appendChild(errorElement);
    });
};

form.addEventListener("submit", async  (event)  => {
    event.preventDefault();

    const correo = document.getElementById("user-correo").value;
    const password = document.getElementById("user-password").value;
    const errorMessages = [];

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
        errorMessagesContainer.style.display = 'block'; // Mostrar el contenedor
        showErrorMessages(errorMessages);
        console.log(errorMessages);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            if (data.role === 'cliente') {
                window.location.href = "../../../ClientsViews/html/HomeClient.html";

            } else if (data.role === 'emprendedor') {
                window.location.href = '../../../EmprendedorViews/html/emprendedormenu.html';
            }
        } else {
            const errorMsg = data.message || "Invalid email or password. Please try again.";
            showErrorMessages([errorMsg]);
        }
    } catch (error) {
        console.error("Error during login:", error);
        showErrorMessages(["An error occurred. Please try again later."]);
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
