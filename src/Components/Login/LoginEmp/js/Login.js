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

    const username = document.getElementById("user-name").value;
    const password = document.getElementById("user-password").value;
    const errorMessages = [];

    // Validate that inputs are not empty
    if (!username) {
        errorMessages.push("User cannot be empty.");
    }
    if (!password) {
        errorMessages.push("Password cannot be empty.");
    }

    // Show error messages if any are present and stop the submission
    if (errorMessages.length > 0) {
        errorMessagesContainer.style.display = 'block'; // Mostrar el contenedor
        showErrorMessages(errorMessages);
        console.log(errorMessages);
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            if (data.userType === 'cliente') {
                window.location.href = "/loggedin";
            } else if (data.userType === 'emprendedor') {
                window.location.href = "/loggedin";
            }
        } else {
            showErrorMessages([data.message || "Invalid email or password. Please try again."]);
        }
    } catch (error) {
        console.error("Error during login:", error);
        showErrorMessages(["An error occurred. Please try again later."]);
    }
});

function closeView() {
    window.location.href = 'HomeClient.html';  // Or your desired redirect URL
}
