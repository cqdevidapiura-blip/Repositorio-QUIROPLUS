const pool = require('../config/db');

const crearCita = async (req, res) => {
    const { nombre, telefono, correo, sede_id, fecha, hora } = req.body;
    const correoFinal = correo && correo.trim() !== '' ? correo.trim() : null;

    try {
        await pool.query('BEGIN');
        let cliente_id;

        if (correoFinal) {
            const clienteExistente = await pool.query('SELECT id FROM clientes WHERE correo = $1', [correoFinal]);
            if (clienteExistente.rows.length > 0) {
                cliente_id = clienteExistente.rows[0].id;
            }
        }

        if (!cliente_id) {
            const nuevoCliente = await pool.query(
                'INSERT INTO clientes (nombre, telefono, correo) VALUES ($1, $2, $3) RETURNING id',
                [nombre, telefono, correoFinal]
            );
            cliente_id = nuevoCliente.rows[0].id;
        }

        const nuevaCita = await pool.query(
            'INSERT INTO citas (cliente_id, sede_id, fecha, hora) VALUES ($1, $2, $3, $4) RETURNING *',
            [cliente_id, sede_id, fecha, hora]
        );

        await pool.query('COMMIT');
        res.status(201).json({ mensaje: 'Cita agendada exitosamente', cita: nuevaCita.rows[0] });

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Error interno al agendar la cita' });
    }
};

module.exports = {
    crearCita
};