const pool = require('../config/db');

// Función que ya tienes
const obtenerStaff = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, nombre, cargo, categoria, imagen_url, biografia, estudios, sexo 
            FROM staff 
            ORDER BY id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener el staff' });
    }
};

const obtenerStaffPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT id, nombre, cargo, categoria, imagen_url, biografia, estudios, sexo 
            FROM staff 
            WHERE id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener el detalle del profesional' });
    }
};

module.exports = { obtenerStaff, obtenerStaffPorId };