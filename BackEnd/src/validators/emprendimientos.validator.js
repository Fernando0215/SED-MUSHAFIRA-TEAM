const Joi = require('joi');

const esquemaEmprendimiento = Joi.object({
    nombreEmprendimiento: Joi.string().min(3).max(100).required(),
    imagenEmprendimiento: Joi.string().optional(),
    infoContacto: Joi.string().min(10).max(100).required(),
    direccion: Joi.string().min(5).max(200).required(),
    descripcion: Joi.string().min(10).max(500).required(),
    correo: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required()
});

async function validarEmprendimiento(data) {
    console.log("Datos recibidos para validación:", data); // Para depuración
    const { error } = esquemaEmprendimiento.validate(data, { abortEarly: false });
    if (error) {
        console.error("Errores de validación:", error.details);
        const mensajesError = error.details.map(detalle => detalle.message).join(', ');
        throw new Error(mensajesError);
    }
}

module.exports = { validarEmprendimiento };
