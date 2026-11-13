const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importar Rutas
const sedesRoutes = require('./routes/sedesRoutes');
const citasRoutes = require('./routes/citasRoutes');
const staffRoutes = require('./routes/staffRoutes');
const nosotrosRoutes = require('./routes/nosotrosRoutes');
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Necesario en Railway para capturar la IP real del cliente
app.set('trust proxy', 1);

// Seguridad y Middlewares
app.use(helmet());
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://quiroplus-demo.vercel.app',
    'https://quiroplusdemo.vercel.app',
    'https://quiroplus.com.pe',
    'https://www.quiroplus.com.pe'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

// Límite de 8mb para permitir la transferencia de fotografías hacia GitHub
app.use(express.json({ limit: '8mb' }));

// Uso de Rutas Públicas
app.use('/api/sedes', sedesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/nosotros', nosotrosRoutes);
app.use('/api/menu', menuRoutes);

// Uso de Rutas Administrativas Protegidas
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API del Centro Quiropráctico de Vida (CQV) funcionando correctamente.');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});