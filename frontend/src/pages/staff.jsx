import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// Configuración de las secciones (relacionado con la columna 'categoria' de tu BD)
const SECCIONES = [
  {
    id: 'especialistas',
    tab: 'Especialistas',
    eyebrow: 'Staff',
    heading: 'Encuentra al especialista que necesitas',
    intro: 'El equipo clínico que evalúa, trata y acompaña tu recuperación.',
  },
  {
    id: 'directiva',
    tab: 'Dirección',
    eyebrow: 'Liderazgo',
    heading: 'Conoce a nuestra área directiva',
    intro: 'El equipo que define la visión, los estándares de calidad y el crecimiento de la clínica.',
  },
  {
    id: 'ventas',
    tab: 'Ventas',
    eyebrow: 'Comercial',
    heading: 'Conoce a nuestro equipo de Ventas',
    intro: 'Quienes conectan nuestros servicios con las familias que confían en nosotros cada día.',
  },
];

const Staff = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [seccionActiva, setSeccionActiva] = useState('especialistas');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Estados para los datos del backend
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Referencia para el scroll
  const staffSectionRef = useRef(null);

  // Fetch de los datos al cargar el componente
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/staff');
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        setStaffData(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const seccion = SECCIONES.find((s) => s.id === seccionActiva);

  // Filtrado y Ordenamiento: Por categoría, barra de búsqueda y prioridad de imagen
  const personasFiltradas = useMemo(() => {
    // 1. Filtrar por categoría y búsqueda
    const filtrados = staffData.filter((persona) => {
      const coincideCategoria = persona.categoria === seccionActiva;
      const coincideNombre = persona.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      return coincideCategoria && coincideNombre;
    });

    // 2. Ordenar: los que tienen imagen primero, los que tienen null/vacío después
    return filtrados.sort((a, b) => {
      // Verificamos si tienen imagen (que no sea null y no esté vacía)
      const aTieneImagen = a.imagen_url && a.imagen_url.trim() !== '' ? 1 : 0;
      const bTieneImagen = b.imagen_url && b.imagen_url.trim() !== '' ? 1 : 0;

      if (aTieneImagen !== bTieneImagen) {
        return bTieneImagen - aTieneImagen; // El que tiene 1 (foto) va antes que el 0 (sin foto)
      }
      
      // Si ambos tienen foto, o ambos NO tienen foto, mantenemos el orden por ID
      return a.id - b.id;
    });
  }, [staffData, seccionActiva, searchTerm]);

  // Si el usuario busca, regresamos a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Lógica de Paginación
  const totalPages = Math.ceil(personasFiltradas.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const personasPaginadas = personasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const cambiarSeccion = (id) => {
    setSeccionActiva(id);
    setSearchTerm('');
    setCurrentPage(1); // Volver a la página 1 al cambiar de pestaña
    
    // Scroll suave hacia la sección de contenido, restando un margen para el header fijo
    if (staffSectionRef.current) {
      setTimeout(() => {
        const yOffset = -150; // Margen para que no quede tapado por los tabs o el header
        const y = staffSectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 50);
    }
  };

  // Función para determinar la silueta según Categoría y Sexo
  const obtenerSilueta = (categoria, sexo) => {
    const sexoNormalizado = sexo ? sexo.toUpperCase() : '';
    const categoriaNormalizada = categoria ? categoria.toLowerCase() : '';

    if (sexoNormalizado === 'M') {
      return `/images/menu/silueta-${categoriaNormalizada}-hombre.png`;
    }
    if (sexoNormalizado === 'F') {
      return `/images/menu/silueta-${categoriaNormalizada}-mujer.png`;
    }
    
    // Fallback por si la persona no tiene el sexo registrado en la BD aún
    return "/images/menu/silueta-general.png";
  };

  return (
    <div className="bg-stone-50 font-sans min-h-screen flex flex-col">
      <Header setActiveModal={setActiveModal} />

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* HERO SECTION */}
        <section className="w-full bg-[#f8fbff] relative border-b border-stone-200">
          <div className="absolute inset-y-0 right-0 w-full md:w-[60%] z-0 pointer-events-none">
            <img 
              src="/images/menu/portada-terapia.jpg" 
              alt="Staff de Especialistas" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8fbff] via-[#f8fbff]/60 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 flex">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
                <button
                  onClick={() => navigate('/')}
                  className="text-slate-500 hover:text-[#009baf] transition-colors cursor-pointer"
                >
                  Inicio
                </button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-800">
                  {seccion.eyebrow}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight leading-[1.1]">
                Nuestro Staff
              </h1>
              
              <p className="text-slate-700 text-lg leading-relaxed max-w-sm font-medium">
                Los mejores profesionales comprometidos con la excelencia.
              </p>

              <div className="pt-2">
                <button 
                  onClick={() => setActiveModal('agendar')}
                  className="bg-[#009baf] text-white font-bold px-8 py-3.5 rounded-full hover:bg-teal-700 transition-colors shadow-md relative z-20"
                >
                  Agenda tu cita
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TABS Y GRILLA DE STAFF */}
        <div className="relative" ref={staffSectionRef}>
          {/* TABS DE SECCIONES */}
          <section className="w-full bg-white border-b border-stone-200 sticky lg:static top-[85px] z-30">
            <div className="max-w-7xl mx-auto px-0 md:px-6">
              <div className="flex justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-4 px-6 md:px-1">
                {SECCIONES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => cambiarSeccion(s.id)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-colors shrink-0 ${
                      seccionActiva === s.id
                        ? 'bg-[#009baf] text-white shadow-md'
                        : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                    }`}
                  >
                    {s.tab}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECCIÓN STAFF */}
          <section className="py-16 px-6 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-teal-700 text-xs font-bold tracking-wider uppercase mb-2 block">
                {seccion.eyebrow}
              </span>
              <h2 className="text-3xl font-bold text-[#0f172a] mb-3">{seccion.heading}</h2>
              <p className="text-slate-600 mb-6">{seccion.intro}</p>
              
              {/* Barra de Búsqueda */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar por nombre..."
                  className="w-full px-6 py-4 rounded-xl border-2 border-stone-100 focus:border-[#009baf] outline-none text-slate-700 shadow-sm transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* BARRA LATERAL MINIMALISTA (Izquierda) */}
              <div className="w-full lg:w-1/4 relative">
                <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm sticky top-[160px]">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Compromiso Integral</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Nuestro equipo está en constante rotación y capacitación continua para llevar la mejor atención a todas nuestras sedes. Tu bienestar es nuestra prioridad en cualquier lugar del país.
                  </p>
                </div>
              </div>

              {/* GRILLA DE TARJETAS (Derecha) */}
              <div className="w-full lg:w-3/4">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009baf]"></div>
                  </div>
                ) : personasFiltradas.length === 0 ? (
                  <div className="bg-white rounded-3xl border-2 border-stone-100 p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No hay resultados</h3>
                    <p className="text-slate-500">
                      Aún no hemos agregado perfiles a esta sección o la búsqueda no coincide con ningún nombre.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {personasPaginadas.map((persona) => (
                        <div 
                          key={persona.id} 
                          onClick={() => navigate(`/staff/${persona.id}`)}
                          className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 group flex flex-col cursor-pointer"
                        >
                          <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden flex justify-center items-end px-4 border-b border-stone-50">
                            
                            <img 
                              src={persona.imagen_url || obtenerSilueta(persona.categoria, persona.sexo)} 
                              alt={persona.nombre} 
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 bg-stone-200"
                              onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.src = obtenerSilueta(persona.categoria, persona.sexo); 
                              }}
                            />
                            
                          </div>
                          
                          <div className="p-6 flex-grow flex flex-col bg-white">
                            <span className="text-teal-700 text-[11px] font-bold tracking-wider uppercase mb-3 block">
                              {persona.cargo}
                            </span>
                            <h4 className="text-[#0f172a] font-bold text-base leading-snug mb-5 flex-grow">
                              {persona.nombre}
                            </h4>
                            <div className="flex items-center text-[#009baf] font-semibold text-sm group-hover:text-teal-800 transition-colors cursor-pointer">
                              Conoce más 
                              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Controles de Paginación */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-12">
                        <button 
                          onClick={() => {
                            setCurrentPage(prev => Math.max(prev - 1, 1));
                            window.scrollTo({ top: staffSectionRef.current.offsetTop - 150, behavior: 'smooth' });
                          }}
                          disabled={currentPage === 1}
                          className="px-6 py-2.5 rounded-full font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-stone-100 text-slate-600 hover:bg-stone-200"
                        >
                          Anterior
                        </button>
                        <span className="text-slate-600 font-medium text-sm">
                          Página {currentPage} de {totalPages}
                        </span>
                        <button 
                          onClick={() => {
                            setCurrentPage(prev => Math.min(prev + 1, totalPages));
                            window.scrollTo({ top: staffSectionRef.current.offsetTop - 150, behavior: 'smooth' });
                          }}
                          disabled={currentPage === totalPages}
                          className="px-6 py-2.5 rounded-full font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#009baf] text-white hover:bg-teal-700 shadow-sm"
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          </section>
        </div>

        {/* SECCIÓN: PROCESO DE ATENCIÓN CON NUESTRO STAFF */}
        <section className="w-full bg-white py-16 md:py-20 border-t border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-3">
                ¿Cómo es la <span className="text-[#009baf]">atención con nuestros especialistas</span>?
              </h2>
              <p className="text-slate-600 text-lg">
                Desde tu primera consulta hasta tu recuperación, te guiamos paso a paso junto al profesional ideal para tu caso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 text-center">
              {/* Paso 1 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#e6f7f9] text-[#009baf] flex items-center justify-center font-bold mb-4">1</div>
                <img src="/images/menu/proceso-1.svg" alt="Derivación" className="h-28 md:h-32 mb-6 object-contain" />
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Derivación</h3>
                <p className="text-slate-600 text-sm max-w-[250px]">
                  Una vez confirmada tu cita se te derivará a la unidad correspondiente con el especialista indicado.
                </p>
              </div>
              {/* Paso 2 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#e6f7f9] text-[#009baf] flex items-center justify-center font-bold mb-4">2</div>
                <img src="/images/menu/proceso-2.svg" alt="Primera consulta" className="h-28 md:h-32 mb-6 object-contain" />
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Primera consulta</h3>
                <p className="text-slate-600 text-sm max-w-[250px]">
                  Consulta quiropráctica para determinar el plan de tratamiento y solicitar los estudios necesarios.
                </p>
              </div>
              {/* Paso 3 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#e6f7f9] text-[#009baf] flex items-center justify-center font-bold mb-4">3</div>
                <img src="/images/menu/proceso-3.svg" alt="Evaluación de caso" className="h-28 md:h-32 mb-6 object-contain" />
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Evaluación de caso</h3>
                <p className="text-slate-600 text-sm max-w-[250px]">
                  El especialista evaluará los resultados para definir el mejor tratamiento según tu diagnóstico.
                </p>
              </div>
              {/* Paso 4 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#e6f7f9] text-[#009baf] flex items-center justify-center font-bold mb-4">4</div>
                <img src="/images/menu/proceso-4.svg" alt="Inicio del tratamiento" className="h-28 md:h-32 mb-6 object-contain" />
                <h3 className="font-bold text-[#0f172a] text-lg mb-2">Inicio del tratamiento</h3>
                <p className="text-slate-600 text-sm max-w-[250px]">
                  Se agenda el inicio de tu tratamiento de recuperación según corresponda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BANNER INFERIOR */}
        <section className="w-full bg-[#00b4c5] relative">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-stretch justify-between">
            <div className="w-full md:w-1/2 py-12 md:py-20 text-white space-y-4 z-30 flex flex-col justify-center relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Conoce nuestras sedes y <br className="hidden md:block" /> agenda tu cita
              </h2>
              <p className="text-white/90 text-lg font-medium max-w-lg">
                Estamos presentes en más de 5 provincias a nivel nacional.
              </p>
              <div className="pt-4">
                <button 
                onClick={() => navigate('/#sedes')}
                  className="bg-white text-[#00b4c5] font-bold px-8 py-3 rounded-full hover:bg-stone-100 hover:shadow-lg transition-all duration-300"
                >
                  Ver sedes
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 h-[280px] md:h-auto relative flex justify-center md:justify-end z-20 pointer-events-none">
              <img 
                src="/images/menu/banner-sedes.png" 
                alt="Encuentra nuestras sedes" 
                className="absolute bottom-0 right-auto md:right-12 h-[340px] md:h-[400px] lg:h-[480px] object-contain origin-bottom"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </section>

      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
};

export default Staff;