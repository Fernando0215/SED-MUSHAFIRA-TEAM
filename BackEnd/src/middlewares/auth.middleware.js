const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    // Obtener el encabezado de autorización
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Encabezado de autorización no proporcionado' });
    }

    // Comprobar que el encabezado tiene el formato correcto
    const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado en el encabezado' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Agregar los datos decodificados a la solicitud
        next(); // Continuar al siguiente middleware o controlador
    } catch (error) {
        // Detectar el tipo de error
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido' });
        }
        return res.status(500).json({ error: 'Error interno al verificar el token' });
    }
}

module.exports = { verificarToken };
