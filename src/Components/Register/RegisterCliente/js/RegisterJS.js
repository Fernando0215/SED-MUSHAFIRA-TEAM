document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('.form1');
    const errorMessagesContainer = document.createElement('div');
    errorMessagesContainer.classList.add('error-messages');
    form.prepend(errorMessagesContainer);

    const showErrorMessages = (messages) => {
        errorMessagesContainer.innerHTML = ''; // Limpiar mensajes previos
        messages.forEach((message) => {
            const errorElement = document.createElement('p');
            errorElement.textContent = '⚠️ ' + message;
            errorMessagesContainer.appendChild(errorElement);
        });
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar el envío predeterminado del formulario
    
        // Limpiar mensajes de error previos
        errorMessagesContainer.innerHTML = '';
    
        // Obtener datos del formulario
        const formData = new FormData(form);
    
        try {
            // Enviar datos al servidor
            const response = await fetch('http://192.168.77.39:3000/clientes/register', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar al cliente');
            }
    
            // Redirigir al login después del registro exitoso
            alert('Usuario creado con éxito');
            window.location.href = '../../../Login/LoginEmp/html/LoginEmprendedor.html';
        } catch (error) {
            // Mostrar el error devuelto por el servidor
            showErrorMessages([error.message]);
        }
    });
    

    // Validar formulario
    const validateForm = (formData) => {
        const errors = [];

        // Verificar contraseñas coinciden
        if (formData.get('contrasenna') !== formData.get('confirmcontrasenna')) {
            errors.push('Las contraseñas no coinciden');
        }

        // Validar correo electrónico
        if (!validateEmail(formData.get('correoElectronico'))) {
            errors.push('Por favor ingrese un correo electrónico válido');
        }

        // Verificar campos vacíos
        ['nombre', 'apellido', 'infoContacto', 'correoElectronico', 'contrasenna'].forEach((key) => {
            if (!formData.get(key)) {
                errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} es obligatorio`);
            }
        });

        // Validar imagen
        const fotoPerfil = formData.get('fotoPerfil');
        if (fotoPerfil && !['image/png', 'image/jpeg'].includes(fotoPerfil.type)) {
            errors.push('La imagen debe ser PNG o JPEG');
        }

        return errors;
    };

    // Validar correo electrónico
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };
});
