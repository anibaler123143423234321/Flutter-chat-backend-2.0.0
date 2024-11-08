const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            console.log(`Intento de registro con correo ya existente: ${email}`);
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }

        const usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        console.log(`Usuario creado: ${usuario.nombre}`);

        res.json({
            ok: true,
            usuario,
            token,
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            console.log(`Intento de login con email inexistente: ${email}`);
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado',
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            console.log(`Intento de login con contraseña incorrecta para: ${email}`);
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida',
            });
        }

        const token = await generarJWT(usuarioDB.id);

        console.log(`Usuario logueado: ${usuarioDB.nombre}`);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const renewToken = async (req, res = response) => {
    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    console.log(`Token renovado para usuario: ${usuario.nombre}`);

    res.json({
        ok: true,
        usuario,
        token,
    });
};

module.exports = {
    crearUsuario,
    login,
    renewToken,
};
