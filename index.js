const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

require('./database/config').dbConnection();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Ajustar para seguridad si es necesario
        methods: ["GET", "POST"],
    }
});

// Exportar `io` para usarlo en `socket.js`
module.exports.io = io;
require('./sockets/socket');

// Rutas de la API
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));

// Servir contenido estático
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Iniciar servidor
server.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto', process.env.PORT);
});
