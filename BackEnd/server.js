require('dotenv').config();
const http = require('http');
const url = require('url');
const { getDB, connectDB } = require('./src/config/db.config.js');
const { validarEmprendimiento } = require('./src/validators/emprendimientos.validator');
const { validarCliente } = require('./src/validators/clientes.validator');
const { verificarToken } = require('./src/middlewares/auth.middleware');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const formidable = require('formidable');
const { subirImagen, obtenerImagen } = require('./src/routes/images.router.js'); // Asegúrate de importar bien
const fs = require('fs');
const fsPath = require('path');
const { login } = require('../BackEnd/src/controllers/auth.controller.js')
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', promise, 'reason:', reason);
});


const UPLOADS_DIR = fsPath.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
// Función para leer el cuerpo de la solicitud
async function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        const contentType = req.headers['content-type'];

        if (contentType.startsWith('application/json')) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
        } else if (contentType.startsWith('multipart/form-data')) {
            const form = new formidable.IncomingForm({
                multiples: true, // Permitir múltiples archivos
                uploadDir: UPLOADS_DIR, // Carpeta donde se guardarán los archivos
                keepExtensions: true, // Mantener la extensión original de los archivos
            });

            form.parse(req, (err, fields, files) => {
                if (err) {
                    return reject(err);
                }

                const file = files.bannerImage || files.imagenProducto;

                // Validar que el archivo tenga un nombre válido
                if (file && !file.originalFilename) {
                    return reject(new Error('El archivo no tiene un nombre válido.'));
                }

                resolve({ fields, files });
            });
        } else {
            reject(new Error('Unsupported content type'));
        }
    });
}



// Servidor HTTP
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const db = getDB();



    // **Agregar encabezados para CORS**
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos

    // Manejar solicitudes preflight (opcional)
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return; // Salir después de manejar el preflight
    }


    // Nueva lista de palabras prohibidas
    const palabrasProhibidas = [
        'tonto', 'idiota', 'imbécil', 'estúpido', 'grosero', 'malnacido', 'infeliz',
        'pendejo', 'cabrón', 'chinga', 'güey', 'mamada', 'pinche', 'culero', 'chingada',
        'boludo', 'pelotudo', 'forro', 'gil', 'puto', 'conchudo', 'chupamedias', 'garca',
        'gilipollas', 'joder', 'coño', 'hijo de puta', 'mamón', 'pringado',
        'gonorrea', 'carechimba', 'huevón', 'malparido', 'chimba', 'ñero',
        'weón', 'culiao', 'conchetumadre', 'maraco', 'puta madre',
        'mamabicho', 'jodón', 'bicho', 'cabrón', 'pendejo',
        'coño', 'gafo', 'pajuo', 'mamaguevo',
        'cerote', 'chucho', 'mulas', 'hueco', 'culero', 'pijudo', 'puñal', 'cachimbon',
        'vergón', 'culiado', 'burro', 'chavacán', 'perra', 'pendejete', 'boludo',
        'culicagado', 'malacate', 'maceta', 'carnicero', 'culicorto', 'pizarrín',
        'lengua floja', 'pistoludo', 'cara de cuete', 'metido', 'maldito'

    ];

    try {
        // RUTA: Subir imagen
        if (path === '/upload' && method === 'POST') {
            const { files } = await parseRequestBody(req);

            if (!files || !files.fotoPerfil) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No se subió ninguna imagen' }));
                return;
            }

            const file = files.fotoPerfil;
            const fileExtension = fsPath.extname(file.originalFilename); // Obtener la extensión
            const fileName = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;
            const filePath = fsPath.join(UPLOADS_DIR, fileName);

            // Mover el archivo a la carpeta final
            fs.renameSync(file.filepath, filePath);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ruta: `/uploads/${fileName}` }));
        }
        else if (path.startsWith('/uploads/') && method === 'GET') {
            const filePath = fsPath.join(__dirname, path);

            if (!fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Imagen no encontrada' }));
                return;
            }

            const mimeType = 'image/jpeg'; // Cambiar según el tipo de archivo
            res.writeHead(200, { 'Content-Type': mimeType });
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
        }

        // RUTA: Crear cliente
        else if (path === '/clientes/register' && method === 'POST') {
            const { fields, files } = await parseRequestBody(req);
            const { nombre, apellido, infoContacto, correoElectronico, contrasenna, confirmcontrasenna } = fields;

            if (contrasenna !== confirmcontrasenna) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Las contraseñas no coinciden' }));
                return;
            }

            delete fields.confirmcontrasenna;
            await validarCliente(fields);

            const clientesCollection = db.collection('clientes');

            const clienteExistente = await clientesCollection.findOne({
                $or: [
                    { correoElectronico },
                ]
            });
            if (clienteExistente) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(
                    JSON.stringify({
                        error: clienteExistente.correoElectronico === correoElectronico
                            ? 'El correo ya está registrado. Intente con otro correo.'
                            : ''
                    })
                );
                return;
            }

            let fotoPerfil = null;
            if (files && files.fotoPerfil) {
                const file = files.fotoPerfil;

                if (file.filepath) {
                    const uploadDir = fsPath.join(__dirname, 'uploads');

                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir);
                    }

                    const fileName = `${Date.now()}-${file.originalFilename}`;
                    const filePath = fsPath.join(uploadDir, fileName);

                    fs.renameSync(file.filepath, filePath);

                    fotoPerfil = `/uploads/${fileName}`; // Ruta relativa de la imagen
                } else {
                    console.error('El archivo no tiene una ruta válida.');
                }
            }


            const hashContrasenna = crypto.createHash('sha256').update(contrasenna).digest('hex');

            const cliente = {
                nombre,
                apellido,
                infoContacto,
                correoElectronico,
                contrasenna: hashContrasenna,
                fotoPerfil,
            };

            const resultado = await clientesCollection.insertOne(cliente);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente registrado exitosamente', clienteId: resultado.insertedId }));
        }
        // RUTA: Obtener perfil del cliente autenticado
        else if (path === '/clientes/perfil' && method === 'GET') {
            await verificarToken(req, res, async () => {
                try {
                    const clienteId = new ObjectId(req.usuario.id);
                    const cliente = await db.collection('clientes').findOne({ _id: clienteId });

                    if (!cliente) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
                        return;
                    }

                    // Ajustar la ruta de la imagen de perfil si es necesaria
                    if (cliente.fotoPerfil && !cliente.fotoPerfil.startsWith('http')) {
                        cliente.fotoPerfil = `http://localhost:3000${cliente.fotoPerfil}`;
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(cliente));
                } catch (error) {
                    console.error('Error al obtener el perfil del cliente:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error interno del servidor' }));
                }
            });

        }

        else if (path === '/clientes/perfil' && method === 'PUT') {
            await verificarToken(req, res, async () => {
                const { fields, files } = await parseRequestBody(req);

                try {
                    const clienteId = new ObjectId(req.usuario.id);
                    const updates = {
                        nombre: fields.nombre,
                        apellido: fields.apellido,
                        correoElectronico: fields.correoElectronico,
                        infoContacto: fields.infoContacto,
                    };

                    if (files && files.fotoPerfil) {
                        const file = files.fotoPerfil;

                        if (file.filepath && file.originalFilename) {
                            const fileExtension = fsPath.extname(file.originalFilename).toLowerCase();

                            // Validar formato del archivo
                            if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                return res.end(JSON.stringify({ error: 'Formato de archivo no permitido' }));
                            }

                            const fileName = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;
                            const filePath = fsPath.join(UPLOADS_DIR, fileName);

                            // Mover archivo
                            fs.renameSync(file.filepath, filePath);
                            updates.fotoPerfil = `/uploads/${fileName}`;
                        } else {
                            console.error("Ruta del archivo no válida.");
                        }
                    }

                    const resultado = await db.collection("clientes").updateOne(
                        { _id: clienteId },
                        { $set: updates }
                    );

                    if (resultado.matchedCount === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Perfil actualizado exitosamente" }));
                } catch (error) {
                    console.error("Error al actualizar el perfil:", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error interno del servidor" }));
                }
            });
        }


        else if (path === '/clientes/likes' && method === 'POST') {
            await verificarToken(req, res, async () => {
                try {
                    const { emprendimientoId } = await parseRequestBody(req);
                    const clienteId = new ObjectId(req.usuario.id);

                    const clientesCollection = db.collection('clientes');

                    // Agregar el emprendimiento a la lista de likes del cliente
                    await clientesCollection.updateOne(
                        { _id: clienteId },
                        { $addToSet: { likes: emprendimientoId } } // Asegurarse de que no haya duplicados
                    );

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Like agregado correctamente" }));
                } catch (error) {
                    console.error("Error al guardar el like:", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error interno del servidor" }));
                }
            });
        }


        else if (path === '/clientes/favoritos' && method === 'GET') {
            await verificarToken(req, res, async () => {
                try {
                    const clienteId = new ObjectId(req.usuario.id);
                    const cliente = await db.collection('clientes').findOne({ _id: clienteId });

                    if (!cliente || !cliente.likes) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify([])); // Sin favoritos
                        return;
                    }

                    const emprendimientosCollection = db.collection('emprendimientos');
                    const favoritos = await emprendimientosCollection
                        .find({ _id: { $in: cliente.likes.map(id => new ObjectId(id)) } })
                        .toArray();

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(favoritos));
                } catch (error) {
                    console.error("Error al obtener favoritos:", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error interno del servidor" }));
                }
            });
        }

        else if (path === '/clientes/favoritos' && method === 'DELETE') {
            await verificarToken(req, res, async () => {
                try {
                    const { emprendimientoId } = await parseRequestBody(req);
                    const clienteId = new ObjectId(req.usuario.id);

                    const resultado = await db.collection('clientes').updateOne(
                        { _id: clienteId },
                        { $pull: { likes: emprendimientoId } } // Eliminar el emprendimiento de los favoritos
                    );

                    if (resultado.modifiedCount === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Emprendimiento no encontrado en favoritos' }));
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Favorito eliminado correctamente" }));
                } catch (error) {
                    console.error("Error al eliminar favorito:", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error interno del servidor" }));
                }
            });
        }




        // RUTA: Crear emprendimiento
        else if (path === '/emprendimientos/register' && method === 'POST') {
            const { fields, files } = await parseRequestBody(req);
            const { nombreEmprendimiento, infoContacto, correo, direccion, password, confirmpassword, descripcion } = fields;

            try {
                if (password !== confirmpassword) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Las contraseñas no coinciden' }));
                    return;
                }

                delete fields.confirmpassword;
                await validarEmprendimiento(fields);

                const emprendimientosCollection = db.collection('emprendimientos');
                const emprendimientoExistente = await emprendimientosCollection.findOne({ correo });

                if (emprendimientoExistente) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'El correo ya está registrado. Intente con otro correo.' }));
                    return;
                }

                let imagenEmprendimiento = null;
                if (files && files.imagenEmprendimiento && files.imagenEmprendimiento[0].filepath) {
                    const file = files.imagenEmprendimiento[0];
                    const fileExtension = fsPath.extname(file.originalFilename || '.jpeg');
                    const fileName = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;
                    const filePath = fsPath.join(UPLOADS_DIR, fileName);

                    fs.renameSync(file.filepath, filePath);
                    imagenEmprendimiento = `/uploads/${fileName}`;
                }

                const hashPassword = crypto.createHash('sha256').update(password).digest('hex');
                const emprendimiento = {
                    nombreEmprendimiento,
                    infoContacto,
                    correo,
                    direccion,
                    password: hashPassword,
                    descripcion,
                    imagenEmprendimiento,
                };

                const resultado = await emprendimientosCollection.insertOne(emprendimiento);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Emprendimiento registrado exitosamente', emprendimientoId: resultado.insertedId }));
            } catch (error) {
                console.error("Error al registrar el emprendimiento:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Error interno del servidor" }));
            }
        }


        // login de ambos 


        else if (path === '/login' && method === 'POST') {
            console.log('Login request received');
            try {
                const body = await parseRequestBody(req);
                const { correo, password } = body.fields || body;

                const clientesCollection = db.collection('clientes');
                const emprendimientosCollection = db.collection('emprendimientos');

                // Buscar cliente
                const cliente = await clientesCollection.findOne({ correoElectronico: correo });
                const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
                if (cliente && cliente.contrasenna === hashedPassword) {
                    const token = jwt.sign({ id: cliente._id, role: 'cliente' }, jwtSecret, { expiresIn: '3h' });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Cliente autenticado', token, role: 'cliente' }));
                }

                // Buscar emprendimiento
                const emprendimiento = await emprendimientosCollection.findOne({ correo });
                if (emprendimiento && emprendimiento.password === hashedPassword) {
                    const token = jwt.sign({ id: emprendimiento._id, role: 'emprendedor' }, jwtSecret, { expiresIn: '3h' });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Emprendedor autenticado', token, role: 'emprendedor' }));
                }

                // Si no se encuentra el usuario
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado o contraseña incorrecta' }));

            } catch (error) {
                console.error('Error en autenticación:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error interno en el servidor' }));
            }
        }
        // RUTA: Obtener perfil del emprendimiento autenticado
        else if (path === '/emprendimientos/perfil' && method === 'GET') {
            await verificarToken(req, res, async () => {
                const emprendimientoId = req.usuario.id;
                const emprendimiento = await db.collection('emprendimientos').findOne({ _id: emprendimientoId });

                if (!emprendimiento) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Emprendimiento no encontrado' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(emprendimiento));
            });
        }

        else if (path.startsWith('/emprendimientos/') && method === 'GET') {
            const parts = path.split('/');
            const emprendimientoId = parts[2];

            if (!ObjectId.isValid(emprendimientoId)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'ID del emprendimiento no es válido' }));
                return;
            }

            const emprendimientosCollection = db.collection('emprendimientos');
            const emprendimiento = await emprendimientosCollection.findOne({ _id: new ObjectId(emprendimientoId) });

            if (!emprendimiento) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Emprendimiento no encontrado' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(emprendimiento));
        }

        else if (path === '/emprendimientos/banner' && method === 'POST') {
            await verificarToken(req, res, async () => {
                try {
                    const { files } = await parseRequestBody(req);
        
                    if (!files || !files.bannerImage) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'No se subió ninguna imagen de banner' }));
                        return;
                    }
        
                    const file = files.bannerImage;
        
                    if (!file.originalFilename) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'El archivo no tiene un nombre válido' }));
                        return;
                    }
        
                    const fileExtension = fsPath.extname(file.originalFilename).toLowerCase();
                    const fileName = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;
                    const filePath = fsPath.join(UPLOADS_DIR, fileName);
        
                    // Mover el archivo al directorio final
                    fs.renameSync(file.filepath, filePath);
        
                    const bannerPath = `/uploads/${fileName}`;
                    const emprendimientosCollection = db.collection('emprendimientos');
        
                    const result = await emprendimientosCollection.updateOne(
                        { _id: new ObjectId(req.usuario.id) },
                        { $set: { bannerImage: bannerPath } }
                    );
        
                    if (result.matchedCount === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Emprendimiento no encontrado' }));
                        return;
                    }
        
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Banner actualizado exitosamente', bannerImage: bannerPath }));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error interno al actualizar el banner' }));
                }
            });
        }
        
        

        // RUTA: Obtener todos los emprendimientos
        else if (path === '/emprendimientos' && method === 'GET') {
            const emprendimientosCollection = db.collection('emprendimientos');
            const emprendimientos = await emprendimientosCollection.find().toArray();

            // Eliminar duplicados basados en el nombre del emprendimiento
            const emprendimientosUnicos = Array.from(
                new Map(emprendimientos.map(emp => [emp.nombreEmprendimiento, emp])).values()
            );

            // Verificar que la imagen sea válida; usar una imagen predeterminada si no existe
            emprendimientos.forEach(emp => {
                if (!emp.imagenEmprendimiento || !fs.existsSync(fsPath.join(__dirname, emp.imagenEmprendimiento))) {
                    emp.imagenEmprendimiento = '/uploads/defaultImage.png'; // Imagen predeterminada
                }
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(emprendimientos));
        }

        // RUTA: Obtener productos de un emprendimiento específico
        else if (path.startsWith('/emprendimientos/') && path.endsWith('/productos') && method === 'GET') {
            const parts = path.split('/');
            const emprendimientoId = parts[2];

            if (!ObjectId.isValid(emprendimientoId)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'ID del emprendimiento no es válido' }));
                return;
            }

            const productosCollection = db.collection('productos');
            const productos = await productosCollection.find({ emprendimientoId }).toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(productos));
        }


        // Ruta: Obtener productos de un emprendimiento autenticado
        else if (path === '/productos' && method === 'GET') {
            await verificarToken(req, res, async () => {
                const emprendimientoId = req.usuario.id; // ID del emprendimiento autenticado
                console.log("ID del emprendimiento autenticado:", emprendimientoId);

                const productosCollection = db.collection('productos');

                // Asegúrate de comparar emprendimientoId como string
                const productos = await productosCollection.find({ emprendimientoId: emprendimientoId }).toArray();

                console.log("Productos encontrados:", productos);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(productos));
            });
        }


        // RUTA: Ver detalle de un producto específico
        else if (path.startsWith('/productos/') && method === 'GET') {
            const parts = path.split('/');
            const productoId = parts[2];

            const productosCollection = db.collection('productos');
            const producto = await productosCollection.findOne({ _id: productoId });

            if (!producto) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Producto no encontrado' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(producto));
        }

        // RUTA: Crear producto
        else if (path === '/productos' && method === 'POST') {
            await verificarToken(req, res, async () => {
                try {
                    const { fields, files } = await parseRequestBody(req);
                    const { nombre, descripcion, precio } = fields;

                    if (!nombre || !descripcion || !precio || !files || !files.imagenProducto) {
                        console.error("Faltan campos requeridos:", { nombre, descripcion, precio });
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Faltan campos requeridos o archivo de imagen' }));
                        return;
                    }

                    const file = files.imagenProducto;

                    // Validar que el archivo tenga un nombre original
                    if (!file.originalFilename) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'El archivo no tiene un nombre válido' }));
                        return;
                    }

                    const fileExtension = fsPath.extname(file.originalFilename);
                    const fileName = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;
                    const filePath = fsPath.join(UPLOADS_DIR, fileName);

                    fs.renameSync(file.filepath, filePath);

                    const nuevoProducto = {
                        nombre,
                        descripcion,
                        precio: parseFloat(precio),
                        imagenProducto: `/uploads/${fileName}`,
                        emprendimientoId: req.usuario.id,
                    };

                    const productosCollection = db.collection('productos');
                    const resultado = await productosCollection.insertOne(nuevoProducto);

                    console.log("Producto creado correctamente:", nuevoProducto);

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Producto creado exitosamente',
                        producto: { id: resultado.insertedId, ...nuevoProducto },
                    }));

                } catch (error) {
                    console.error("Error al crear producto:", error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error interno al crear el producto' }));
                }
            });
        }



        // RUTA: Crear comentario en un emprendimiento
        // RUTA: Crear comentario en un emprendimiento
        else if (path.startsWith('/emprendimientos/') && path.endsWith('/comentarios') && method === 'POST') {
            await verificarToken(req, res, async () => {
                const parts = path.split('/');
                const emprendimientoId = parts[2];

                // Validar que el emprendimientoId sea válido y exista
                if (!ObjectId.isValid(emprendimientoId)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'El ID del emprendimiento no es válido' }));
                    return;
                }

                const emprendimiento = await db.collection('emprendimientos').findOne({ _id: new ObjectId(emprendimientoId) });
                if (!emprendimiento) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Emprendimiento no encontrado' }));
                    return;
                }

                const newComentario = await parseRequestBody(req);

                if (!newComentario.contenido || newComentario.contenido.trim() === '') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'El comentario no puede estar vacío' }));
                    return;
                }

                const comentariosCollection = db.collection('comentarios');
                const clientesCollection = db.collection('clientes');

                // Limpiar palabras prohibidas
                const palabras = newComentario.contenido.split(/\s+/);
                let tienePalabrasProhibidas = false;

                const contenidoFiltrado = palabras
                    .map(palabra => {
                        if (palabrasProhibidas.includes(palabra.toLowerCase())) {
                            tienePalabrasProhibidas = true;
                            return '****';
                        }
                        return palabra;
                    })
                    .join(' ');

                // Manejar el contador del cliente si hay palabras prohibidas
                const clienteId = req.usuario.id;
                const cliente = await clientesCollection.findOne({ _id: new ObjectId(clienteId) });

                if (tienePalabrasProhibidas) {
                    const nuevoContador = (cliente.contadorComentariosMalos || 0) + 1;

                    // Actualizar el contador en la base de datos
                    await clientesCollection.updateOne(
                        { _id: new ObjectId(clienteId) },
                        { $set: { contadorComentariosMalos: nuevoContador } }
                    );

                    // Manejar las sanciones según el número de incidencias
                    if (nuevoContador === 1) {
                        res.writeHead(403, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            error: 'Has sido bloqueado temporalmente de comentar por 1 hora debido a lenguaje inapropiado'
                        }));
                        return;
                    } else if (nuevoContador === 2) {
                        res.writeHead(403, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            error: 'Has sido bloqueado temporalmente de comentar por 3 días debido a reincidencia'
                        }));
                        return;
                    } else if (nuevoContador >= 3) {
                        // Crear alerta para el administrador
                        const adminAlertsCollection = db.collection('admin_alerts');
                        await adminAlertsCollection.insertOne({
                            clienteId: clienteId,
                            comentario: contenidoFiltrado,
                            emprendimientoId: emprendimientoId,
                            timestamp: new Date()
                        });

                        res.writeHead(403, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            error: 'Has sido reportado al administrador. Tu cuenta podría ser eliminada'
                        }));
                        return;
                    }
                }

                // Guardar el comentario
                await comentariosCollection.insertOne({
                    clienteId: clienteId,
                    emprendimientoId: emprendimientoId,
                    contenido: contenidoFiltrado,
                    timestamp: new Date()
                });

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Comentario creado exitosamente' }));
            });
        }

        // RUTA: Obtener comentarios de un emprendimiento específico
        else if (path.startsWith('/emprendimientos/') && path.endsWith('/comentarios') && method === 'GET') {
            const parts = path.split('/');
            const emprendimientoId = parts[2];

            const comentariosCollection = db.collection('comentarios');
            const comentarios = await comentariosCollection.find({ emprendimientoId: emprendimientoId }).toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comentarios));
        }

        // RUTA: Administrador - Ver comentarios reportados
        else if (path === '/admin/comentarios-reportados' && method === 'GET') {
            const adminAlertsCollection = db.collection('admin_alerts');
            const reportes = await adminAlertsCollection.find().toArray();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(reportes));
        }

        // RUTA: Administrador - Eliminar cliente reportado
        else if (path.startsWith('/admin/clientes/') && method === 'DELETE') {
            const parts = path.split('/');
            const clienteId = parts[3];

            const clientesCollection = db.collection('clientes');
            const resultado = await clientesCollection.deleteOne({ _id: new ObjectId(clienteId) });

            if (resultado.deletedCount === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Cliente no encontrado' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cliente eliminado exitosamente' }));
        }


        // RUTA NO ENCONTRADA
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
});

// Conectar a MongoDB e iniciar el servidor
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('No se pudo conectar a MongoDB:', error);
    });
