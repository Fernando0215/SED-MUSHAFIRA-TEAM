const express = require('express');
const { crearCliente, obtenerCliente, actualizarCliente, eliminarCliente } = require('../controllers/clientes.controller');
const { validarCliente } = require('../validators/clientes.validator');
const { autenticarUsuario } = require('../middlewares/auth.middleware');
const { generarToken } = require('../utils/jwt.tools');

const router = express.Router();

// Crear un cliente
router.post('/', async (req, res) => {
    try {
        await validarCliente(req.body);
        const clienteId = await crearCliente(req.body);

        // Generar token JWT para el cliente creado
        const token = generarToken({ id: clienteId, correoElectronico: req.body.correoElectronico });

        res.status(201).json({
            mensaje: 'Cliente creado exitosamente',
            clienteId,
            token, // Devuelve el token para autenticación inmediata
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(400).json({ mensaje: 'Error al crear cliente', error: error.message });
    }
});

// Obtener el cliente logueado
router.get('/me', autenticarUsuario, async (req, res) => {
    try {
        const cliente = await obtenerCliente(req.usuario.correoElectronico);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
    }
});

// Actualizar el cliente logueado
router.put('/me', autenticarUsuario, async (req, res) => {
    try {
        await validarCliente(req.body);
        const clienteActualizado = await actualizarCliente(req.usuario.correoElectronico, req.body);
        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado para actualizar' });
        }
        res.json({ mensaje: 'Cliente actualizado exitosamente', cliente: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(400).json({ mensaje: 'Error al actualizar cliente', error: error.message });
    }
});

// Eliminar el cliente logueado
router.delete('/me', autenticarUsuario, async (req, res) => {
    try {
        const clienteEliminado = await eliminarCliente(req.usuario.correoElectronico);
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado para eliminar' });
        }
        res.json({ mensaje: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
    }
});

module.exports = router;
