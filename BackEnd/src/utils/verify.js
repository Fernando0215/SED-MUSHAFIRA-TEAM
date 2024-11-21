const crypto = require('crypto');



// Función para verificar la contraseña
function verifyPassword(storedHash, storedSalt, inputPassword) {
    const hash = crypto.pbkdf2Sync(inputPassword, storedSalt, 1000, 64, 'sha512').toString('hex');
    return storedHash === hash;
}

module.exports = { verifyPassword };
