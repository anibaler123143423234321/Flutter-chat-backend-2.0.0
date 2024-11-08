const Mensaje = require('../models/mensaje');

const obtenerChat = async (req, res) => {
    const miId = req.uid;
    const mensajesDe = req.params.de;

    try {
        const last30 = await Mensaje.find({
            $or: [{ de: miId, para: mensajesDe }, { de: mensajesDe, para: miId }],
        })
            .sort({ createdAt: 'desc' })
            .limit(30);

        console.log(`Últimos 30 mensajes entre ${miId} y ${mensajesDe}:`, last30);

        res.json({
            ok: true,
            mensajes: last30,
        });
    } catch (error) {
        console.error('Error al obtener el chat:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el chat, contacte al administrador.',
        });
    }
};

module.exports = {
    obtenerChat,
};
