const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar Rutas
const sedesRoutes = require('./routes/sedesRoutes');
const citasRoutes = require('./routes/citasRoutes');
const staffRoutes = require('./routes/staffRoutes');
const nosotrosRoutes = require('./routes/nosotrosRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Uso de Rutas
app.use('/api/sedes', sedesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/nosotros', nosotrosRoutes);
app.use('/api/menu', menuRoutes);   

app.get('/', (req, res) => {
    res.send('API del Centro Quiropráctico de Vida (CQV) funcionando correctamente.');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});