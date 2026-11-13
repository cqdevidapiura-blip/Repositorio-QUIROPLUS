import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://repositorio-quiroplus-production.up.railway.app';

const INITIAL_SEDE = {
  nombre: '',
  direccion: '',
  telefono: '',
  url_maps: '',
  whatsapp: ''
};

const INITIAL_STAFF = {
  nombre: '',
  categoria: 'especialistas',
  cargo: '',
  estudios: '',
  sexo: 'F',
  imagenBase64: null,
  imagenNombre: null,
  imagenActual: null,
  quitarImagen: false
};

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [operadorActivo, setOperadorActivo] = useState('');

  // Login State
  const [loginData, setLoginData] = useState({ operador: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Navegación Superior: 'staff' | 'sedes' | 'auditoria'
  const [vista, setVista] = useState('staff');
  const [filtroCategoriaStaff, setFiltroCategoriaStaff] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Datos
  const [sedes, setSedes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [logs, setLogs] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  // Panel Deslizable (Drawer) para Crear/Editar
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [formSede, setFormSede] = useState(INITIAL_SEDE);
  const [formStaff, setFormStaff] = useState(INITIAL_STAFF);
  const [guardando, setGuardando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState({ tipo: '', texto: '' });

  // Confirmación de eliminación
  const [itemEliminar, setItemEliminar] = useState(null);

  // Etiqueta meta noindex para ocultar de motores de búsqueda
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Consola de Gestión Interna | QUIROPLUS S.R.L.';

    verificarSesionActiva();

    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  const verificarSesionActiva = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/session`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAutenticado(true);
        setOperadorActivo(data.operador);
        cargarTodo();
      }
    } catch {
      setAutenticado(false);
    } finally {
      setVerificando(false);
    }
  };

  const cargarTodo = async () => {
    setCargandoDatos(true);
    try {
      const [resSedes, resStaff] = await Promise.all([
        fetch(`${API_BASE}/api/sedes`),
        fetch(`${API_BASE}/api/staff`)
      ]);
      if (resSedes.ok) setSedes(await resSedes.json());
      if (resStaff.ok) setStaff(await resStaff.json());
    } catch (err) {
      console.error('Error al sincronizar datos:', err);
    } finally {
      setCargandoDatos(false);
    }
  };

  const cargarAuditoria = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/logs`, { credentials: 'include' });
      if (res.status === 401) return manejarSesionExpirada();
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const manejarSesionExpirada = () => {
    setAutenticado(false);
    setPanelAbierto(false);
    setLoginError('Su sesión ha finalizado por seguridad. Ingrese nuevamente.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Error de autenticación.');
      } else {
        setAutenticado(true);
        setOperadorActivo(data.operador);
        setLoginData({ operador: '', password: '' });
        cargarTodo();
      }
    } catch {
      setLoginError('No se pudo establecer conexión con el servidor.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/admin/logout`, { method: 'POST', credentials: 'include' });
    setAutenticado(false);
  };

  // Validación estricta de formato .avif y conversión a Base64
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nombreArchivo = file.name.toLowerCase();
    const esAvif = nombreArchivo.endsWith('.avif') || file.type === 'image/avif';

    if (!esAvif) {
      setMensajeEstado({
        tipo: 'error',
        texto: 'Formato no permitido. El sistema únicamente acepta imágenes en formato .avif de bajo peso. Utilice el enlace de Squoosh adjunto para convertir su archivo antes de subirlo.'
      });
      e.target.value = '';
      setFormStaff((prev) => ({
        ...prev,
        imagenBase64: null,
        imagenNombre: null
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMensajeEstado({
        tipo: 'error',
        texto: 'El archivo .avif supera el límite de 2 MB. Comprímalo en Squoosh antes de subirlo.'
      });
      e.target.value = '';
      return;
    }

    setMensajeEstado({ tipo: '', texto: '' });

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      setFormStaff((prev) => ({
        ...prev,
        imagenBase64: base64String,
        imagenNombre: file.name,
        quitarImagen: false
      }));
    };
    reader.readAsDataURL(file);
  };

  // Abrir formulario para Crear o Editar
  const abrirNuevo = () => {
    setMensajeEstado({ tipo: '', texto: '' });
    setModoEdicion(false);
    setIdEdicion(null);
    if (vista === 'sedes') {
      setFormSede(INITIAL_SEDE);
    } else {
      setFormStaff(INITIAL_STAFF);
    }
    setPanelAbierto(true);
  };

  const abrirEdicion = (item) => {
    setMensajeEstado({ tipo: '', texto: '' });
    setModoEdicion(true);
    setIdEdicion(item.id);
    if (vista === 'sedes') {
      setFormSede({
        nombre: item.nombre || '',
        direccion: item.direccion || '',
        telefono: item.telefono || '',
        url_maps: item.url_maps || '',
        whatsapp: item.whatsapp || ''
      });
    } else {
      setFormStaff({
        nombre: item.nombre || '',
        categoria: item.categoria || 'especialistas',
        cargo: item.cargo || '',
        estudios: item.estudios || '',
        sexo: item.sexo || 'F',
        imagenBase64: null,
        imagenNombre: null,
        imagenActual: item.imagen_url || null,
        quitarImagen: false
      });
    }
    setPanelAbierto(true);
  };

  // Guardar Sede
  const guardarSede = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensajeEstado({ tipo: '', texto: '' });

    const url = modoEdicion ? `${API_BASE}/api/admin/sedes/${idEdicion}` : `${API_BASE}/api/admin/sedes`;
    const method = modoEdicion ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formSede)
      });

      if (res.status === 401) return manejarSesionExpirada();
      const data = await res.json();

      if (!res.ok) {
        setMensajeEstado({ tipo: 'error', texto: data.error || 'Error al guardar la sede.' });
      } else {
        await cargarTodo();
        setPanelAbierto(false);
      }
    } catch {
      setMensajeEstado({ tipo: 'error', texto: 'Error de red al guardar los cambios.' });
    } finally {
      setGuardando(false);
    }
  };

  // Guardar Staff
  const guardarStaff = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensajeEstado({ tipo: '', texto: '' });

    const url = modoEdicion ? `${API_BASE}/api/admin/staff/${idEdicion}` : `${API_BASE}/api/admin/staff`;
    const method = modoEdicion ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formStaff)
      });

      if (res.status === 401) return manejarSesionExpirada();
      const data = await res.json();

      if (!res.ok) {
        setMensajeEstado({ tipo: 'error', texto: data.error || 'Error al guardar el registro.' });
      } else {
        await cargarTodo();
        setPanelAbierto(false);
      }
    } catch {
      setMensajeEstado({ tipo: 'error', texto: 'Error de conexión con el servidor.' });
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar Registro
  const confirmarEliminacion = async () => {
    if (!itemEliminar) return;
    const { tipo, id } = itemEliminar;
    try {
      const res = await fetch(`${API_BASE}/api/admin/${tipo}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.status === 401) return manejarSesionExpirada();
      if (res.ok) {
        setItemEliminar(null);
        cargarTodo();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const staffFiltrado = staff.filter((item) => {
    const coincideCat = filtroCategoriaStaff === 'todos' || item.categoria === filtroCategoriaStaff;
    const coincideTexto =
      item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.cargo?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideTexto;
  });

  if (verificando) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-zinc-500 text-sm font-sans">
        Verificando credenciales de seguridad...
      </div>
    );
  }

  // VISTA 1: LOGIN CORPORATIVO MINIMALISTA
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-zinc-100 flex flex-col justify-center items-center px-4 font-sans text-zinc-900">
        <div className="w-full max-w-md bg-white border border-zinc-200 p-8 sm:p-10 shadow-xs">
          <div className="border-b border-zinc-200 pb-5 mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1">
              QUIROPLUS S.R.L.
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Acceso al Sistema Gestor de Datos
            </h1>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-zinc-900 text-white text-xs leading-relaxed border-l-4 border-red-500">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                Responsable de sesión
              </label>
              <input
                type="text"
                required
                maxLength={50}
                placeholder="Ej. Gerencia General / Administración"
                value={loginData.operador}
                onChange={(e) => setLoginData({ ...loginData, operador: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Este nombre quedará registrado en la bitácora de auditoría.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                Clave de Autorización
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-widest py-3.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loginLoading ? 'Verificando...' : 'Ingresar al Panel'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-5 border-t border-zinc-100 flex justify-between items-center text-[11px] text-zinc-400">
            <span>Conexión Cifrada SSL</span>
            <span>Protección Activa</span>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: CONSOLA ADMINISTRATIVA (SIN SIDEBAR, ESTILO BANCA CORPORATIVA)
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col">
      {/* BARRA SUPERIOR INSTITUCIONAL */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-zinc-900 block">
                QUIROPLUS S.R.L.
              </span>
              <span className="text-[11px] text-zinc-400 block">
                Administración de Base de Datos
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1 border-l border-zinc-200 pl-6">
              <button
                type="button"
                onClick={() => setVista('staff')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  vista === 'staff'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Directorio de Staff ({staff.length})
              </button>
              <button
                type="button"
                onClick={() => setVista('sedes')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  vista === 'sedes'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Sedes Nacionales ({sedes.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setVista('auditoria');
                  cargarAuditoria();
                }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  vista === 'auditoria'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Registro de Actividad
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-zinc-500">
              Operador: <strong className="text-zinc-800 font-medium">{operadorActivo}</strong>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-zinc-300 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="flex md:hidden border-t border-zinc-200 bg-zinc-50">
          <button
            onClick={() => setVista('staff')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase ${
              vista === 'staff' ? 'bg-zinc-900 text-white' : 'text-zinc-600'
            }`}
          >
            Staff ({staff.length})
          </button>
          <button
            onClick={() => setVista('sedes')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase ${
              vista === 'sedes' ? 'bg-zinc-900 text-white' : 'text-zinc-600'
            }`}
          >
            Sedes ({sedes.length})
          </button>
          <button
            onClick={() => {
              setVista('auditoria');
              cargarAuditoria();
            }}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase ${
              vista === 'auditoria' ? 'bg-zinc-900 text-white' : 'text-zinc-600'
            }`}
          >
            Auditoría
          </button>
        </div>
      </header>

      {/* CONTENIDO CENTRAL */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* SECCIÓN 1: GESTIÓN DE STAFF */}
        {vista === 'staff' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Directorio de Personal (Tabla: staff)</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Las fotografías en formato .avif se sincronizan automáticamente en el repositorio oficial; Vercel publica el cambio en ~60 segundos.
                </p>
              </div>
              <button
                type="button"
                onClick={abrirNuevo}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 transition-colors shrink-0 cursor-pointer"
              >
                + Registrar Personal
              </button>
            </div>

            {/* Controles de Filtro */}
            <div className="py-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="flex gap-1 bg-zinc-200/70 p-1">
                {['todos', 'especialistas', 'directiva', 'ventas'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFiltroCategoriaStaff(cat)}
                    className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer ${
                      filtroCategoriaStaff === cat
                        ? 'bg-white text-zinc-900 shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Filtrar por nombre o cargo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-3.5 py-2 text-xs bg-white border border-zinc-300 focus:outline-none focus:border-zinc-900 sm:w-64"
              />
            </div>

            {/* Tabla de Staff */}
            <div className="bg-white border border-zinc-200 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-3.5 px-4">Nombre y Grado</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Cargo</th>
                    <th className="py-3.5 px-4">Procedencia</th>
                    <th className="py-3.5 px-4">Sexo</th>
                    <th className="py-3.5 px-4">Fotografía</th>
                    <th className="py-3.5 px-4 text-right">Operaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-xs">
                  {cargandoDatos ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-zinc-400">
                        Cargando registros desde Supabase...
                      </td>
                    </tr>
                  ) : staffFiltrado.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-zinc-400">
                        No se encontraron registros que coincidan con el criterio.
                      </td>
                    </tr>
                  ) : (
                    staffFiltrado.map((persona) => (
                      <tr key={persona.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-zinc-900">{persona.nombre}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 text-[11px] uppercase tracking-wider bg-zinc-100 border border-zinc-200 text-zinc-700">
                            {persona.categoria}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-600">{persona.cargo}</td>
                        <td className="py-3.5 px-4 text-zinc-600">{persona.estudios}</td>
                        <td className="py-3.5 px-4 text-zinc-600">{persona.sexo}</td>
                        <td className="py-3.5 px-4 text-zinc-500">
                          {persona.imagen_url ? (
                            <span className="text-zinc-900 font-medium">Asignada (.avif)</span>
                          ) : (
                            <span className="text-zinc-400">Silueta automática</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => abrirEdicion(persona)}
                            className="text-zinc-900 font-medium underline hover:text-zinc-600 cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemEliminar({ tipo: 'staff', id: persona.id, nombre: persona.nombre })}
                            className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: GESTIÓN DE SEDES */}
        {vista === 'sedes' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Directorio de Sedes (Tabla: sedes)</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Los cambios realizados en esta tabla se actualizan de forma instantánea en la página web pública.
                </p>
              </div>
              <button
                type="button"
                onClick={abrirNuevo}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 transition-colors shrink-0 cursor-pointer"
              >
                + Registrar Nueva Sede
              </button>
            </div>

            <div className="bg-white border border-zinc-200 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-3.5 px-4">Nombre de Sede</th>
                    <th className="py-3.5 px-4">Dirección Física</th>
                    <th className="py-3.5 px-4">Teléfono Público</th>
                    <th className="py-3.5 px-4">WhatsApp</th>
                    <th className="py-3.5 px-4 text-right">Operaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-xs">
                  {sedes.map((sede) => (
                    <tr key={sede.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-zinc-900 whitespace-nowrap">{sede.nombre}</td>
                      <td className="py-3.5 px-4 text-zinc-600">{sede.direccion}</td>
                      <td className="py-3.5 px-4 text-zinc-600 whitespace-nowrap">{sede.telefono}</td>
                      <td className="py-3.5 px-4 text-zinc-600 font-mono">{sede.whatsapp}</td>
                      <td className="py-3.5 px-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(sede)}
                          className="text-zinc-900 font-medium underline hover:text-zinc-600 cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemEliminar({ tipo: 'sedes', id: sede.id, nombre: sede.nombre })}
                          className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: AUDITORÍA */}
        {vista === 'auditoria' && (
          <div>
            <div className="pb-6 border-b border-zinc-200 mb-6">
              <h2 className="text-xl font-semibold text-zinc-900">Bitácora de Seguridad y Cambios</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Últimos 25 eventos registrados con dirección IP y responsable de sesión.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="py-3 px-4">Fecha y Hora</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4">Acción Ejecutada</th>
                    <th className="py-3 px-4">Dirección IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-xs">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                        {new Date(log.fecha).toLocaleString('es-PE')}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-900">{log.operador || '—'}</td>
                      <td className="py-3 px-4 font-mono text-zinc-700">{log.accion}</td>
                      <td className="py-3 px-4 font-mono text-zinc-500">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* PANEL DESLIZABLE DERECHO (FORMULARIO GUIADO) */}
      {panelAbierto && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl border-l border-zinc-200 flex flex-col justify-between">
            <div>
              {/* Cabecera del Formulario */}
              <div className="p-6 border-b border-zinc-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block">
                    {vista === 'sedes' ? 'Tabla: SEDES' : 'Tabla: STAFF'}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {modoEdicion ? 'Modificar Registro Existente' : 'Nuevo Registro'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPanelAbierto(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              {mensajeEstado.texto && (
                <div className="mx-6 mt-6 p-3.5 bg-zinc-900 text-white text-xs leading-relaxed border-l-4 border-red-500">
                  {mensajeEstado.texto}
                </div>
              )}

              {/* FORMULARIO DE SEDES */}
              {vista === 'sedes' ? (
                <form id="form-gestor" onSubmit={guardarSede} className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Nombre de la Sede *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Ej: Sede Piura - San Felipe"
                      value={formSede.nombre}
                      onChange={(e) => setFormSede({ ...formSede, nombre: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción: Inicie siempre con la palabra "Sede" seguida de la ciudad o zona.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Dirección Física Completa *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={300}
                      placeholder="Ej: Av. Ramón Mujica D-7 (Frente al hotel Río Verde)"
                      value={formSede.direccion}
                      onChange={(e) => setFormSede({ ...formSede, direccion: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción: Escriba la avenida o calle exacta. Puede agregar una referencia breve entre paréntesis.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Teléfono para mostrar en Web *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="Ej: 073-600167 o 923516358"
                      value={formSede.telefono}
                      onChange={(e) => setFormSede({ ...formSede, telefono: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción: Si es teléfono fijo incluya el código de ciudad con guion (ej. 073-323837).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Número de WhatsApp de la Sede *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      placeholder="Ej: 51936305507"
                      value={formSede.whatsapp}
                      onChange={(e) => setFormSede({ ...formSede, whatsapp: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción obligatoria: Coloque el código de Perú (51) seguido de los 9 dígitos del celular, sin espacios ni símbolo "+".
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Enlace de Ubicación en Google Maps *
                    </label>
                    <textarea
                      rows="3"
                      required
                      placeholder="https://www.google.com/maps/place/..."
                      value={formSede.url_maps}
                      onChange={(e) => setFormSede({ ...formSede, url_maps: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción: Abra Google Maps en el navegador, busque el local de la sede, copie toda la dirección web que aparece en la barra superior (debe empezar con https://) y péguela aquí.
                    </p>
                  </div>
                </form>
              ) : (
                /* FORMULARIO DE STAFF */
                <form id="form-gestor" onSubmit={guardarStaff} className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Nombre Completo y Grado *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Ej: Lic. Martín Junior Quiroz Peña"
                      value={formStaff.nombre}
                      onChange={(e) => setFormStaff({ ...formStaff, nombre: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción: Si cuenta con título abreviado (Lic., Dr.), escríbalo al inicio seguido de nombres y apellidos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        Área / Categoría *
                      </label>
                      <select
                        value={formStaff.categoria}
                        onChange={(e) => setFormStaff({ ...formStaff, categoria: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 bg-white focus:outline-none focus:border-zinc-900"
                      >
                        <option value="especialistas">Especialistas</option>
                        <option value="directiva">Directiva</option>
                        <option value="ventas">Ventas</option>
                      </select>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Define en qué pestaña de la web aparecerá.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        Sexo *
                      </label>
                      <select
                        value={formStaff.sexo}
                        onChange={(e) => setFormStaff({ ...formStaff, sexo: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 bg-white focus:outline-none focus:border-zinc-900"
                      >
                        <option value="F">Femenino (F)</option>
                        <option value="M">Masculino (M)</option>
                      </select>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Asigna la silueta formal si no sube fotografía.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Cargo o Especialidad *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Ej: Quiropráctico / Fisioterapeuta / Asesora de Ventas"
                      value={formStaff.cargo}
                      onChange={(e) => setFormStaff({ ...formStaff, cargo: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción: Puesto exacto que desempeña en la empresa.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Procedencia (Ciudad, País) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={150}
                      placeholder="Ej: Piura, Perú  o  México"
                      value={formStaff.estudios}
                      onChange={(e) => setFormStaff({ ...formStaff, estudios: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-zinc-900"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Instrucción: Indique ciudad y país separados por coma (ej: Tacna, Perú) o únicamente el país si es extranjero.
                    </p>
                  </div>

                  {/* SECCIÓN DE FOTOGRAFÍA EXCLUSIVA .AVIF CON RECORDATORIO DE SQUOOSH */}
                  <div className="pt-4 border-t border-zinc-200">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                      Fotografía del Personal — Exclusivo Formato .AVIF (Opcional)
                    </label>

                    {/* Cuadro de Recordatorio y Enlace Directo a Squoosh */}
                    <div className="mb-3.5 p-3.5 bg-zinc-50 border border-zinc-300 text-xs text-zinc-700 space-y-2">
                      <p className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                        Requisito de optimización de imagen (.avif)
                      </p>
                      <p className="text-[11px] text-zinc-600 leading-relaxed">
                        Por rendimiento del servidor y velocidad de carga web, este campo <strong>únicamente acepta archivos con extensión .avif</strong>. Si su fotografía está en formato .jpg o .png, conviértala gratuitamente antes de subirla:
                      </p>
                      <div className="pt-1">
                        <a
                          href="https://squoosh.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-semibold uppercase tracking-wider px-3.5 py-2 transition-colors"
                        >
                          Abrir convertidor Squoosh.app ↗
                        </a>
                      </div>
                    </div>

                    {modoEdicion && formStaff.imagenActual && !formStaff.quitarImagen && (
                      <div className="mb-3 p-3 bg-white border border-zinc-200 flex items-center justify-between text-xs">
                        <span className="text-zinc-600 truncate mr-2">
                          Ruta actual: <code className="text-zinc-900 font-mono">{formStaff.imagenActual}</code>
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormStaff({ ...formStaff, quitarImagen: true, imagenBase64: null, imagenNombre: null })}
                          className="text-red-600 underline shrink-0 cursor-pointer"
                        >
                          Quitar y usar silueta
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      accept=".avif,image/avif"
                      onChange={handleFileChange}
                      className="w-full text-xs text-zinc-600 file:mr-4 file:py-2.5 file:px-4 file:border file:border-zinc-900 file:text-xs file:font-semibold file:bg-white file:text-zinc-900 hover:file:bg-zinc-100 cursor-pointer"
                    />

                    {formStaff.imagenNombre && (
                      <p className="text-[11px] text-zinc-900 font-medium mt-2">
                        Archivo validado listo para sincronizar: <span className="font-mono">{formStaff.imagenNombre}</span>
                      </p>
                    )}

                    <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                      El sistema sincronizará el archivo <code className="text-zinc-800">.avif</code> en la carpeta pública del proyecto y registrará el mismo nombre automáticamente en la base de datos. Si deja este campo vacío, se asignará la silueta formal según el sexo seleccionado.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Pie del Formulario */}
            <div className="p-6 border-t border-zinc-200 bg-zinc-50 flex justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setPanelAbierto(false)}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-gestor"
                disabled={guardando}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-white disabled:opacity-50 cursor-pointer"
              >
                {guardando ? 'Sincronizando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {itemEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white border border-zinc-200 max-w-md w-full p-6 shadow-xl">
            <h4 className="text-base font-semibold text-zinc-900 mb-2">Confirmar eliminación de registro</h4>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              ¿Está seguro de que desea eliminar permanentemente a{' '}
              <strong className="text-zinc-900">{itemEliminar.nombre}</strong> de la base de datos? Esta acción quedará registrada en la bitácora.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemEliminar(null)}
                className="px-4 py-2 text-xs font-semibold uppercase border border-zinc-300 text-zinc-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminacion}
                className="px-5 py-2 text-xs font-semibold uppercase bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}