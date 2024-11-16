const { verificarToken } = require('../middlewares/auth.middleware');
const {
    crearEmprendimiento,
    actualizarEmprendimientoAutenticado,
    eliminarEmprendimientoAutenticado,
    agregarReview
} = require('../controllers/emprendimientos.controller');

function emprendimientosRouter(app) {
    app.post('/emprendimientos', verificarToken, crearEmprendimiento); // Crear emprendimiento
    app.put('/emprendimientos', verificarToken, actualizarEmprendimientoAutenticado); // Actualizar propio emprendimiento
    app.delete('/emprendimientos', verificarToken, eliminarEmprendimientoAutenticado); // Eliminar propio emprendimiento
    app.post('/emprendimientos/reviews', verificarToken, agregarReview); // Agregar review
}

module.exports = emprendimientosRouter;
