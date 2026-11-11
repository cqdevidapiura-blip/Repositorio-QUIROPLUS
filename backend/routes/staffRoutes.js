const express = require('express');
const router = express.Router();
const { obtenerStaff, obtenerStaffPorId } = require('../controllers/staffController');
router.get('/', obtenerStaff);
router.get('/:id', obtenerStaffPorId)
module.exports = router;