const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const {
    loginAdmin,
    logoutAdmin,
    verificarSesion,
    obtenerLogs,
    crearSede,
    editarSede,
    eliminarSede,
    crearStaff,
    editarStaff,
    eliminarStaff
} = require('../controllers/adminController');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: { error: 'Demasiados intentos de acceso. Por seguridad, espere 15 minutos.' }
});

function requireAdmin(req, res, next) {
    try {
        const payload = jwt.verify(req.cookies.admin_token, process.env.JWT_SECRET);
        req.adminData = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Sesión expirada o no autorizada.' });
    }
}

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/session', requireAdmin, verificarSesion);
router.get('/logs', requireAdmin, obtenerLogs);

router.post('/sedes', requireAdmin, crearSede);
router.put('/sedes/:id', requireAdmin, editarSede);
router.delete('/sedes/:id', requireAdmin, eliminarSede);

router.post('/staff', requireAdmin, crearStaff);
router.put('/staff/:id', requireAdmin, editarStaff);
router.delete('/staff/:id', requireAdmin, eliminarStaff);

module.exports = router;