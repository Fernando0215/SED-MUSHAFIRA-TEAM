const Joi = require('joi');

const esquemaCliente = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    correo: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    infoContacto: Joi.string().required(),
    fechaRegistro: Joi.date().iso().required(), // Validación ISO 8601 para fechas
    fotoPerfil: Joi.string().optional(), // Campo opcional
});

async function validarCliente(data) {
    console.log("Datos recibidos para validación:", data);
    const { error } = esquemaCliente.validate(data);
    if (error) {
        console.error("Error de validación:", error.details[0].message);
        throw new Error(error.details[0].message); // Genera un mensaje claro de error
    }
}
module.exports = { validarCliente };
