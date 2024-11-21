const Joi = require('joi');

const schemaProducto = Joi.object({
    nombre: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 3 caracteres.',
        'string.max': 'El nombre no puede exceder los 100 caracteres.',
        'any.required': 'El nombre es obligatorio.'
    }),
    descripcion: Joi.string().min(10).max(500).required().messages({
        'string.empty': 'La descripción no puede estar vacía.',
        'string.min': 'La descripción debe tener al menos 10 caracteres.',
        'string.max': 'La descripción no puede exceder los 500 caracteres.',
        'any.required': 'La descripción es obligatoria.'
    }),
    precio: Joi.number().positive().required().messages({
        'number.base': 'El precio debe ser un número.',
        'number.positive': 'El precio debe ser un número positivo.',
        'any.required': 'El precio es obligatorio.'
    }),
    emprendimientoId: Joi.string().required().messages({
        'string.empty': 'El ID del emprendimiento no puede estar vacío.',
        'any.required': 'El ID del emprendimiento es obligatorio.'
    })
});

async function validarProducto(productoData) {
    try {
        await schemaProducto.validateAsync(productoData, { abortEarly: false });
    } catch (error) {
        const mensajesError = error.details.map(detalle => detalle.message);
        throw new Error(mensajesError.join(', '));
    }
}

module.exports = { validarProducto };
