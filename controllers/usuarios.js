const { response } = require('express');
const Usuario = require('../models/usuario');

const getUsuarios = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;

    try {
        const usuarios = await Usuario.find({ _id: { $ne: req.uid } })
            .sort('-online')
            .skip(desde)
            .limit(20);

        console.log(`Usuarios obtenidos desde ${desde}:`, usuarios);

        res.json({
            ok: true,
            usuarios,
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener usuarios, contacte al administrador.',
        });
    }
};

module.exports = {
    getUsuarios,
};
