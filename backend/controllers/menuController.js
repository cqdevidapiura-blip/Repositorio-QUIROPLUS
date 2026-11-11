const pool = require('../config/db');

const obtenerServicios = async (req, res) => {
    try {
        // Trae todo: quiroprácticas y terapia física
        const result = await pool.query('SELECT * FROM servicios ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
};

const obtenerPasantes = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM pasantes WHERE estado = 'Activo' ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener pasantes' });
    }
};

const obtenerVacantes = async (req, res) => {
    try {
        // Documentación solicita validar estado Activo/Inactivo
        const result = await pool.query("SELECT * FROM vacantes WHERE estado = 'Activa' ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener vacantes' });
    }
};

const obtenerConvenios = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM convenios ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener convenios' });
    }
};

module.exports = { obtenerServicios, obtenerPasantes, obtenerVacantes, obtenerConvenios };