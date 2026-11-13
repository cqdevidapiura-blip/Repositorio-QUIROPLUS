const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CATEGORIAS_VALIDAS = ['especialistas', 'directiva', 'ventas'];
const SEXOS_VALIDOS = ['M', 'F'];

// Helper para subir imágenes directamente al repositorio de GitHub
async function subirImagenAGithub(base64Content, originalName) {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // Formato: "usuario-empresa/nombre-repo"
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token || !repo) {
        throw new Error('Faltan variables GITHUB_TOKEN o GITHUB_REPO en el servidor.');
    }

    const ext = (originalName.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const baseName = originalName
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_')
        .slice(0, 30);

    const fileName = `staff_${Date.now()}_${baseName}.${ext}`;
    const filePath = `frontend/public/images/menu/${fileName}`;
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'Quiroplus-Admin-System'
        },
        body: JSON.stringify({
            message: `Admin: Subida de imagen de staff (${fileName})`,
            content: base64Content,
            branch: branch
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'No se pudo subir la imagen a GitHub');
    }

    return `/images/menu/${fileName}`;
}

// 1. AUTENTICACIÓN Y SESIÓN
const loginAdmin = async (req, res) => {
    const { password, operador } = req.body;
    const nombreOperador = (operador || 'No especificado').trim().slice(0, 60);
    const hashGuardado = process.env.ADMIN_PASSWORD_HASH;

    if (!hashGuardado || !process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'Servidor sin credenciales configuradas.' });
    }

    const ok = await bcrypt.compare(password || '', hashGuardado);

    await pool.query(
        'INSERT INTO admin_log (operador, accion, ip, user_agent) VALUES ($1, $2, $3, $4)',
        [nombreOperador, ok ? 'login_ok' : 'login_fallido', req.ip, req.headers['user-agent']]
    );

    if (!ok) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ admin: true, operador: nombreOperador }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.cookie('admin_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 2 * 60 * 60 * 1000 // 2 horas
    });

    res.json({ ok: true, operador: nombreOperador });
};

const logoutAdmin = (req, res) => {
    res.clearCookie('admin_token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ ok: true });
};

const verificarSesion = (req, res) => {
    res.json({ ok: true, operador: req.adminData?.operador || 'Administrador' });
};

const obtenerLogs = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, fecha, operador, accion, ip FROM admin_log ORDER BY fecha DESC LIMIT 25');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener registros de auditoría.' });
    }
};

// 2. CRUD DE SEDES
const crearSede = async (req, res) => {
    const { nombre, direccion, telefono, url_maps, whatsapp } = req.body;

    if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 100)
        return res.status(400).json({ error: 'El nombre de la sede debe tener entre 3 y 100 caracteres.' });
    if (typeof direccion !== 'string' || direccion.trim().length < 5 || direccion.trim().length > 300)
        return res.status(400).json({ error: 'La dirección es obligatoria (máx. 300 caracteres).' });
    if (typeof telefono !== 'string' || telefono.trim().length < 6 || telefono.trim().length > 50)
        return res.status(400).json({ error: 'Ingrese un teléfono válido.' });
    if (typeof url_maps !== 'string' || !url_maps.trim().startsWith('https://'))
        return res.status(400).json({ error: 'El enlace de Google Maps debe iniciar con https://' });
    if (typeof whatsapp !== 'string' || !/^51\d{9}$/.test(whatsapp.trim()))
        return res.status(400).json({ error: 'El WhatsApp debe tener 11 dígitos e iniciar con 51 (ej: 51987654321).' });

    try {
        // Sincronizar secuencia de IDs por seguridad tras la migración SQL
        await pool.query("SELECT setval('public.sedes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.sedes))");

        const nueva = await pool.query(
            'INSERT INTO sedes (nombre, direccion, telefono, url_maps, whatsapp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre.trim(), direccion.trim(), telefono.trim(), url_maps.trim(), whatsapp.trim()]
        );

        await pool.query(
            'INSERT INTO admin_log (operador, accion, ip, user_agent, detalle) VALUES ($1, $2, $3, $4, $5)',
            [req.adminData.operador, 'crear_sede', req.ip, req.headers['user-agent'], JSON.stringify({ despues: nueva.rows[0] })]
        );

        res.status(201).json(nueva.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno al registrar la sede.' });
    }
};

const editarSede = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, url_maps, whatsapp } = req.body;

    if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 100)
        return res.status(400).json({ error: 'Nombre de sede inválido.' });
    if (typeof direccion !== 'string' || direccion.trim().length < 5 || direccion.trim().length > 300)
        return res.status(400).json({ error: 'Dirección inválida.' });
    if (typeof telefono !== 'string' || telefono.trim().length < 6 || telefono.trim().length > 50)
        return res.status(400).json({ error: 'Teléfono inválido.' });
    if (typeof url_maps !== 'string' || !url_maps.trim().startsWith('https://'))
        return res.status(400).json({ error: 'El enlace de Google Maps debe iniciar con https://' });
    if (typeof whatsapp !== 'string' || !/^51\d{9}$/.test(whatsapp.trim()))
        return res.status(400).json({ error: 'El WhatsApp debe tener 11 dígitos e iniciar con 51.' });

    try {
        const antes = await pool.query('SELECT * FROM sedes WHERE id = $1', [id]);
        if (antes.rows.length === 0) return res.status(404).json({ error: 'Sede no encontrada.' });

        const actualizada = await pool.query(
            'UPDATE sedes SET nombre=$1, direccion=$2, telefono=$3, url_maps=$4, whatsapp=$5 WHERE id=$6 RETURNING *',
            [nombre.trim(), direccion.trim(), telefono.trim(), url_maps.trim(), whatsapp.trim(), id]
        );

        await pool.query(
            'INSERT INTO admin_log (operador, accion, ip, user_agent, detalle) VALUES ($1, $2, $3, $4, $5)',
            [req.adminData.operador, 'editar_sede', req.ip, req.headers['user-agent'], JSON.stringify({ antes: antes.rows[0], despues: actualizada.rows[0] })]
        );

        res.json(actualizada.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno al actualizar la sede.' });
    }
};

const eliminarSede = async (req, res) => {
    const { id } = req.params;
    try {
        const antes = await pool.query('SELECT * FROM sedes WHERE id = $1', [id]);
        if (antes.rows.length === 0) return res.status(404).json({ error: 'Sede no encontrada.' });

        await pool.query('DELETE FROM sedes WHERE id = $1', [id]);

        await pool.query(
            'INSERT INTO admin_log (operador, accion, ip, user_agent, detalle) VALUES ($1, $2, $3, $4, $5)',
            [req.adminData.operador, 'eliminar_sede', req.ip, req.headers['user-agent'], JSON.stringify({ eliminado: antes.rows[0] })]
        );

        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar sede.' });
    }
};

// 3. CRUD DE STAFF (Sin tocar biografía, con subida de imagen a GitHub)
const crearStaff = async (req, res) => {
    const { nombre, categoria, cargo, estudios, sexo, imagenBase64, imagenNombre } = req.body;

    if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 100)
        return res.status(400).json({ error: 'El nombre debe tener entre 3 y 100 caracteres.' });
    if (!CATEGORIAS_VALIDAS.includes(categoria))
        return res.status(400).json({ error: 'Categoría no permitida.' });
    if (typeof cargo !== 'string' || cargo.trim().length < 2 || cargo.trim().length > 100)
        return res.status(400).json({ error: 'El cargo es obligatorio (máx. 100 caracteres).' });
    if (typeof estudios !== 'string' || estudios.trim().length < 2 || estudios.trim().length > 150)
        return res.status(400).json({ error: 'Indique la procedencia (Ciudad, País).' });
    if (!SEXOS_VALIDOS.includes(sexo))
        return res.status(400).json({ error: 'Seleccione un sexo válido (M o F).' });

    try {
        let rutaImagen = null;
        if (imagenBase64 && imagenNombre) {
            rutaImagen = await subirImagenAGithub(imagenBase64, imagenNombre);
        }

        // Sincronizar secuencia de IDs de staff
        await pool.query("SELECT setval('public.staff_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.staff))");

        const nuevo = await pool.query(
            `INSERT INTO staff (nombre, imagen_url, biografia, estudios, categoria, cargo, sexo) 
             VALUES ($1, $2, NULL, $3, $4, $5, $6) RETURNING *`,
            [nombre.trim(), rutaImagen, estudios.trim(), categoria, cargo.trim(), sexo]
        );

        await pool.query(
            'INSERT INTO admin_log (operador, accion, ip, user_agent, detalle) VALUES ($1, $2, $3, $4, $5)',
            [req.adminData.operador, 'crear_staff', req.ip, req.headers['user-agent'], JSON.stringify({ despues: nuevo.rows[0] })]
        );

        res.status(201).json(nuevo.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Error al registrar integrante del staff.' });
    }
};

const editarStaff = async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, cargo, estudios, sexo, imagenBase64, imagenNombre, quitarImagen } = req.body;

    if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 100)
        return res.status(400).json({ error: 'Nombre inválido.' });
    if (!CATEGORIAS_VALIDAS.includes(categoria))
        return res.status(400).json({ error: 'Categoría inválida.' });
    if (typeof cargo !== 'string' || cargo.trim().length < 2 || cargo.trim().length > 100)
        return res.status(400).json({ error: 'Cargo inválido.' });
    if (typeof estudios !== 'string' || estudios.trim().length < 2 || estudios.trim().length > 150)
        return res.status(400).json({ error: 'Procedencia inválida.' });
    if (!SEXOS_VALIDOS.includes(sexo))
        return res.status(400).json({ error: 'Sexo inválido.' });

    try {
        const antes = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);
        if (antes.rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado.' });

        let rutaImagen = antes.rows[0].imagen_url;
        if (quitarImagen) {
            rutaImagen = null;
        } else if (imagenBase64 && imagenNombre) {
            rutaImagen = await subirImagenAGithub(imagenBase64, imagenNombre);
        }

        const actualizado = await pool.query(
            `UPDATE staff 
             SET nombre=$1, imagen_url=$2, estudios=$3, categoria=$4, cargo=$5, sexo=$6 
             WHERE id=$7 RETURNING *`,
            [nombre.trim(), rutaImagen, estudios.trim(), categoria, cargo.trim(), sexo, id]
        );

        await pool.query(
            'INSERT INTO admin_log (operador, accion, ip, user_agent, detalle) VALUES ($1, $2, $3, $4, $5)',
            [req.adminData.operador, 'editar_staff', req.ip, req.headers['user-agent'], JSON.stringify({ antes: antes.rows[0], despues: actualizado.rows[0] })]
        );

        res.json(actualizado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Error al actualizar el registro.' });
    }
};

const eliminarStaff = async (req, res) => {
    const { id } = req.params;
    try {
        const antes = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);
        if (antes.rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado.' });

        await pool.query('DELETE FROM staff WHERE id = $1', [id]);

        await pool.query(
            'INSERT INTO admin_log (operador, accion, ip, user_agent, detalle) VALUES ($1, $2, $3, $4, $5)',
            [req.adminData.operador, 'eliminar_staff', req.ip, req.headers['user-agent'], JSON.stringify({ eliminado: antes.rows[0] })]
        );

        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar registro del staff.' });
    }
};

module.exports = {
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
};