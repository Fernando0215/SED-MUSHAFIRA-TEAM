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
      

        // Sending data to the server using fetch (POST request)
        try {
            const response = await fetch('http://192.168.77.39/emprendimientos/register', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hubo un error al procesar la solicitud');
            }

            // Show confirmation message
            alert('Solicitud enviada con éxito');
           // form.reset(); // Reset form fields

            // Optionally, redirect to login page after success
            window.location.href = '../../../Login/LoginEmp/html/LoginEmprendedor.html';
        } catch (error) {
            showErrorMessages([error.message]);
        }
    });

    // Form validation function
    const validateForm = (data) => {
        const errors = [];

        // Check if passwords match
        if (formData.get('password') != formData.get('confirmpassword')) {
            errors.push('Las contraseñas no coinciden');
        }

        // Check if email is valid
        if (!validateEmail(formData.get('correoElectronico'))) {
            errors.push('Por favor ingrese un correo electrónico válido');
        }



        // Verificar campos vacíos
        ['nombreEmprendimiento', 'infoContacto', 'correo', 'imagenEmprendimiento', 'direccion', 'password', 'confirmpassword', 'descripcion' ].forEach((key) => {
            if (!formData.get(key)) {
                errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} es obligatorio`);
            }
        });


         // Validar imagen
         const fotoPerfil = formData.get('imagenEmprendimiento');
         if (fotoPerfil && !['image/png', 'image/jpeg'].includes(fotoPerfil.type)) {
             errors.push('La imagen debe ser PNG o JPEG');
         }

        return errors;
    };

    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };
});
