const express = require('express');
const router = express.Router();
const { crearCita } = require('../controllers/citasController');

router.post('/', crearCita);

module.exports = router;