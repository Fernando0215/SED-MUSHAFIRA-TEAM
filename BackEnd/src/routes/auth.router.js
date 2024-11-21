const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

// Ruta para el login
router.post('/login', async (req, res) => {
    try {
        await login(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para el registro
router.post('/register', async (req, res) => {
    try {
        await register(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
