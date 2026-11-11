const pool = require('../config/db');

const obtenerConfiguracionNosotros = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM configuracion WHERE seccion = 'nosotros' LIMIT 1");
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            // Fallback por si la BD está vacía
            res.json({ video_url: 'https://www.youtube.com/embed/APFA-wjtOL0' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener la configuracion de nosotros' });
    }
};

module.exports = { obtenerConfiguracionNosotros };