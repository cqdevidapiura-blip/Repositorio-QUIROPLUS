const express = require('express');
const router = express.Router();
const { 
    obtenerServicios, 
    obtenerPasantes, 
    obtenerVacantes, 
    obtenerConvenios 
} = require('../controllers/menuController');

router.get('/servicios', obtenerServicios);
router.get('/pasantes', obtenerPasantes);
router.get('/vacantes', obtenerVacantes);
router.get('/convenios', obtenerConvenios);

module.exports = router;