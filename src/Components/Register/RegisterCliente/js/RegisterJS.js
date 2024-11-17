document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('.form1');
    const errorMessagesContainer = document.createElement('div');
    errorMessagesContainer.classList.add('error-messages');
    form.prepend(errorMessagesContainer);

    const showErrorMessages = (messages) => {
        errorMessagesContainer.innerHTML = ''; // Clear previous messages
        messages.forEach((message) => {
            const errorElement = document.createElement('p');
            
        // Añadir un icono antes del mensaje
             errorElement.textContent = '⚠️ ' + message;
            errorMessagesContainer.appendChild(errorElement);
        });
    };

    function closeView() {
        // Redirigir a otra vista (por ejemplo, "otra-vista.html")
        window.location.href = 'HomeClient.html';  // O el URL al que quieras redirigir
    }



    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission


        console.log("Form submission prevented."); // Debug log
        // Clear previous error messages
        errorMessagesContainer.innerHTML = '';

        // Get form data
        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            imagenCliente: formData.get('imagenCliente'),
            infoContacto: formData.get('infoContacto'),
            correoElectronico: formData.get('correoElectronico'),
            contrasenna: formData.get('contrasenna'),
            confirmcontrasenna: formData.get('confirmcontrasenna')
        };

        console.log('Contrasenna:', data.contrasenna);
        console.log('Confirm Contrasenna:', data.confirmcontrasenna);


        // Form validation
        const validationErrors = validateForm(data);

        console.log(validationErrors);

        if (validationErrors.length > 0) {
            console.log("Errors found, showing error messages"); // Debug log
            errorMessagesContainer.style.display = 'block'; // Mostrar el contenedor
            showErrorMessages(validationErrors);
            return ; // Stop the function if there are errors
        }


        // Sending data to the server using fetch (POST request)
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hubo un error al procesar la solicitud');
            }

            // Show confirmation message
            alert('Usuario creado con éxito');
            form.reset(); // Reset form fields

            // Optionally, redirect to login page after success
            window.location.href = '/login';
        } catch (error) {
            showErrorMessages([error.message]);
        }
    });

    // Form validation function
    const validateForm = (data) => {
        const errors = [];

        // Check if passwords match
        if (data.contrasenna != data.confirmcontrasenna) {
            errors.push('Las contraseñas no coinciden');
        }

        // Check if email is valid
        if (!validateEmail(data.correoElectronico)) {
            errors.push('Por favor ingrese un correo electrónico válido');
        }

        // Check for empty fields
        Object.keys(data).forEach((key) => {
            if (!data[key]) {
                errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} es obligatorio`);
            }
        });

        return errors;
    };

    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };
});
