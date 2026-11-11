const pool = require('../config/db');

const obtenerSedes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sedes ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener las sedes' });
    }
};

module.exports = {
    obtenerSedes
};