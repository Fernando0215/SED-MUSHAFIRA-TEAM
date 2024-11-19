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

    if (errorMessages.length > 0) {
        showErrorMessages(errorMessages);
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correoElectronico, contrasenna })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirigir al usuario dependiendo del rol
            window.location.href = data.redirectUrl;
        } else {
            showErrorMessages([data.error || "Correo o contraseña inválidos."]);
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        showErrorMessages(["Ocurrió un error. Por favor, inténtalo de nuevo."]);
    }
});
