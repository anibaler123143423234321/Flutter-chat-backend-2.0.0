const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const Usuario = require('../models/usuario'); // Importa el modelo para listar usuarios

io.on('connection', async (client) => {
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    if (!valido) {
        return client.disconnect();
    }

    console.log(`Cliente conectado: ${uid}`);
    await usuarioConectado(uid);

    // Emitir la lista actualizada a todos los clientes
    io.emit('lista-usuarios', await Usuario.find().sort('-online'));

    client.join(uid);

    client.on('disconnect', async () => {
        console.log(`Cliente desconectado: ${uid}`);
        await usuarioDesconectado(uid);
        io.emit('lista-usuarios', await Usuario.find().sort('-online'));
    });
     // Evento para manejar mensajes personales
     client.on('mensaje-personal', async (payload) => {
        console.log('Mensaje recibido:', payload);  // Para verificar si el mensaje llega al servidor
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);  // Emitir mensaje al destinatario
    });
});



