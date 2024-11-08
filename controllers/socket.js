const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');

const usuarioConectado = async (uid = '') => {
    try {
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            console.log(`Usuario con uid ${uid} no encontrado`);
            return;
        }

        console.log(`Antes de actualizar: ${JSON.stringify(usuario)}`);

        usuario.online = true; // Marcar como conectado
        await usuario.save();  // Guardar en la base de datos

        console.log(`Después de actualizar: ${JSON.stringify(usuario)}`);
        console.log(`Usuario ${usuario.nombre} ahora está online.`);
    } catch (error) {
        console.error('Error al conectar usuario:', error);
    }
};

const usuarioDesconectado = async (uid = '') => {
    try {
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            console.log(`Usuario con uid ${uid} no encontrado`);
            return;
        }

        usuario.online = false; // Marcar como desconectado
        await usuario.save();

        console.log(`Usuario ${usuario.nombre} ahora está offline.`);
    } catch (error) {
        console.error('Error al desconectar usuario:', error);
    }
};

const grabarMensaje = async (payload) => {
    try {
        const mensaje = new Mensaje(payload);
        await mensaje.save();
        console.log(`Mensaje de ${payload.de} para ${payload.para} grabado.`);
        return true;
    } catch (error) {
        console.error('Error al grabar mensaje:', error);
        return false;
    }
};

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    grabarMensaje,
};
