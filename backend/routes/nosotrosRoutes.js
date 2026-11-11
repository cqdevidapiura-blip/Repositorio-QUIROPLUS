// routes/nosotrosRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerConfiguracionNosotros } = require('../controllers/nosotrosController');

router.get('/configuracion', obtenerConfiguracionNosotros);

module.exports = router;