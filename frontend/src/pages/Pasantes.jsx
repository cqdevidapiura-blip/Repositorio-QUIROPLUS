import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// Datos de prueba para las vacantes
const mockPosiciones = [
  { 
    id: 1, 
    area: 'ÁREA DE REHABILITACIÓN', 
    titulo: 'Pasante de Terapia Física', 
    requisitos: [
      'Estudiante de últimos ciclos',
      'Interés en biomecánica',
      'Vocación de servicio',
      'Disponibilidad part-time'
    ]
  },
  { 
    id: 2, 
    area: 'ÁREA ADMINISTRATIVA', 
    titulo: 'Asistente Administrativo y/o Ventas', 
    requisitos: [
      'Conocimiento en Meta Business',
      'Nivel intermedio en excel',
      'Apoyo en oficina de trabajo',
      'Capacitación constante incluida'
    ]
  },
  { 
    id: 3, 
    area: 'COMUNICACIONES', 
    titulo: 'Pasante de Marketing', 
    requisitos: [
      'Manejo de redes sociales',
      'Toma de foto y video',
      'Conocimientos en CapCut y DaVinci',
      'Interés en salud y bienestar'
    ]
  }
];

// OPTIMIZACIÓN LCP: Se cambia "videoUrl" por "videoId" para usar el patrón Facade
const TESTIMONIOS_LIST = [
  {
    id: 'm1',
    nombre: 'Lesly Neira',
    rol: 'Pasante de Marketing (2026)',
    cita: '"Mi pasantía me ha permitido participar en la creación de contenido para distintas filiales, fortaleciendo mis habilidades en edición, diseño y redes sociales."',
    imagen: '/images/menu/lesly.avif',
    videoId: '7oMofavlO4o' 
  },
  {
    id: 'm2',
    nombre: 'Dana Sosa',
    rol: 'Pasante de Marketing (2026)',
    cita: '"Esta experiencia me ha enseñado a organizar mejor mi tiempo, trabajar con objetivos y desarrollar habilidades como la creatividad, comunicación y trabajo en equipo."',
    imagen: 'https://placehold.co/400x400/e2e8f0/475569?text=DS',
    videoId: '7w1vFcZxJl0' 
  },
  {
    id: 'a1',
    nombre: 'Keila Chuquihuanga',
    rol: 'Atención al Cliente (2026)',
    cita: '"El ambiente de trabajo es increíble. Desde el primer mes sientes que formas parte de un equipo que realmente cambia la vida de los pacientes brindando un trato humano y cercano."',
    imagen: '/images/menu/Keila.avif',
    videoId: '7fHV0rT2_vM' 
  },
  {
    id: 'ad1',
    nombre: 'Emile Pingo',
    rol: 'Asistente Administrativo (2026)',
    cita: '"Ver cómo funciona la clínica desde adentro y apoyar en la gestión diaria me dio herramientas invaluables. Los procesos aquí son ordenados y se aprende muchísimo."',
    imagen: '/images/menu/Emili.avif',
    videoId: '-Xub9D_fT4I' 
  },
  {
    id: 'ad2',
    nombre: 'Audelia Calle',
    rol: 'Gestión de Servicios (2026)',
    cita: '"Me encantó la responsabilidad que te dan. No solo vienes a hacer papeleo, realmente analizas datos, usas sistemas y contribuyes a que el centro mejore cada día."',
    imagen: '/images/menu/Audelia.png',
    videoId: 'HsbkRHJXKRs' 
  }
];

const ITEMS_POR_PAGINA = 2;

const Pasantes = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [isCargandoCorreo, setIsCargandoCorreo] = useState(false);
  const testimoniosRef = useRef(null);
  const timeoutRef = useRef(null);

  // Limpieza del temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Lógica de Paginación
  const totalPaginas = Math.ceil(TESTIMONIOS_LIST.length / ITEMS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const testimoniosVisibles = TESTIMONIOS_LIST.slice(indiceInicio, indiceInicio + ITEMS_POR_PAGINA);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      if (testimoniosRef.current) {
        testimoniosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Función que maneja el click en "Postular" con limpieza de timer
  const handlePostularClick = (e, posicion) => {
    e.preventDefault();
    setIsCargandoCorreo(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const asunto = encodeURIComponent(`Postulación a vacante: ${posicion.titulo}`);
      window.location.href = `mailto:cqdevidapiura@gmail.com?subject=${asunto}`;
      setIsCargandoCorreo(false);
    }, 3500);
  };

  return (
    <div className="bg-stone-50 font-sans min-h-screen flex flex-col relative">
      <style>{`
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: floating 4s ease-in-out infinite;
        }
      `}</style>
      <Header setActiveModal={setActiveModal} />

      {/* --- MODAL DE INDICACIONES DE CORREO (CARGANDO) --- */}
      {isCargandoCorreo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center animate-[scaleIn_0.5s_ease-out]">
            <div className="w-14 h-14 border-4 border-stone-200 border-t-[#009baf] rounded-full animate-spin mb-5"></div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Preparando tu correo...</h2>
            
            <div className="bg-[#f8fbff] p-5 rounded-2xl border border-[#009baf]/20 w-full mb-5 text-left">
              <p className="text-slate-800 font-bold mb-2 text-sm text-center">
                Recuerda adjuntar los siguientes datos:
              </p>
              <ul className="text-slate-600 text-sm space-y-2 font-medium">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf]"></span> Nombres completos</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf]"></span> N° de DNI</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf]"></span> Estudios que estás realizando</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf]"></span> Tu CV actualizado</li>
              </ul>
            </div>
            
            <p className="text-xs text-stone-500 font-medium">
              Abriendo tu aplicación de correo en unos segundos...
            </p>
          </div>
        </div>
      )}

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden">
          <img 
            src="/images/menu/portada-pasantes.jpg" 
            alt="Equipo de Pasantes" 
            className="absolute inset-0 w-full h-full object-cover object-top"
            width="1200"
            height="450"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-teal-800/50"></div>
          
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-4 animate-[scaleIn_0.6s_ease-out]">
            <div className="text-white/90 text-sm md:text-base font-medium tracking-wide mb-2 drop-shadow-md">
              <a href="/" className="hover:underline hover:text-white transition-colors">Inicio</a>
              <span className="mx-2">/</span>
              <span className="text-white">Pasantes</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
              Construye tu futuro
            </h1>
            <p className="text-white text-lg md:text-xl font-medium drop-shadow-md max-w-2xl mx-auto">
              El talento necesita oportunidades para crecer. Descubre todo lo que eres capaz de lograr en nuestro equipo.
            </p>
          </div>
        </section>

        {/* 2. NUEVA SECCIÓN: ÁREAS DE DESARROLLO (CON IMÁGENES ANIMADAS) */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
                Aprende haciendo. <br className="md:hidden"/> Descubre tu potencial.
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                Abrimos nuestras puertas para que lleves tus conocimientos a la práctica y asumas nuevos retos en diferentes áreas de nuestra organización:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Tarjeta 1 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-float">
                  <img 
                    src="/images/menu/pasantia-marketing.avif" 
                    alt="Marketing y ventas" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Marketing y ventas</h3>
                <p className="text-stone-600 text-sm leading-relaxed px-4">
                  Participa en la creación de contenidos, estrategias digitales, campañas publicitarias y comunicación de marca.
                </p>
              </div>

              {/* Tarjeta 2 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-float" style={{animationDelay: '1s'}}>
                  <img 
                    src="/images/menu/pasantia-administracion.avif" 
                    alt="Administración" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Administración</h3>
                <p className="text-stone-600 text-sm leading-relaxed px-4">
                  Conoce de cerca la gestión empresarial, organización de procesos, coordinación de equipos y resultados.
                </p>
              </div>

              {/* Tarjeta 3 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-float" style={{animationDelay: '2s'}}>
                  <img 
                    src="/images/menu/pasantia-terapia.avif" 
                    alt="Terapia física" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Terapia física</h3>
                <p className="text-stone-600 text-sm leading-relaxed px-4">
                  Fortalece tus conocimientos mediante aprendizaje y participación supervisada con pacientes reales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SECCIÓN: INTRODUCCIÓN AL PROGRAMA (TEXTOS RESUMIDOS) */}
        <section className="py-16 md:py-20 px-6 bg-stone-50 border-y border-stone-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mb-6">
              Una experiencia que va más allá
            </h2>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed mb-6">
              Buscamos ofrecerte acompañamiento, orientación y los beneficios necesarios para enriquecer tu preparación hacia el mundo laboral. Aprenderás a trabajar en equipo y a enfrentarte a situaciones reales de una empresa.
              Creemos en reconocer el talento y brindar oportunidades a quienes demuestran compromiso, iniciativa y ganas de superarse.

              Por eso, dependiendo de las necesidades de la empresa, las vacantes disponibles y el desempeño del participante, existe la posibilidad de continuar formando parte de nuestro equipo e iniciar una nueva etapa como trabajador de Quiro Plus.
            </p>

          </div>
        </section>

        {/* 4. SECCIÓN: TESTIMONIOS CON PAGINACIÓN */}
        <section ref={testimoniosRef} className="py-16 md:py-24 px-6 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                Testimonios
              </h2>
            </div>

            {/* Grilla de Testimonios (2 por página) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {testimoniosVisibles.map((testimonio) => (
                <div 
                  key={testimonio.id} 
                  className="bg-stone-50 rounded-3xl p-6 md:p-8 border border-stone-200/70 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-5">
                    {/* Perfil: Foto + Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <img 
                        src={testimonio.imagen} 
                        alt={testimonio.nombre} 
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border border-stone-200 shrink-0 bg-[#e2e8f0]"
                        width="144"
                        height="144"
                        loading="lazy"
                      />
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-stone-900">{testimonio.nombre}</h3>
                        <p className="text-stone-500 font-medium text-sm md:text-base mt-1">
                          {testimonio.rol}
                        </p>
                      </div>
                    </div>

                    {/* Cita */}
                    <p className="text-stone-700 text-base md:text-lg italic leading-relaxed pt-2">
                      {testimonio.cita}
                    </p>
                  </div>

                  {/* Video YouTube (SHORTS - Formato Vertical Centrado) */}
                  <div className="w-full max-w-[260px] sm:max-w-[300px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-stone-200 bg-black mt-8 shadow-sm flex-shrink-0 relative">
                    <iframe 
                      className="w-full h-full absolute inset-0"
                      src={`https://www.youtube-nocookie.com/embed/${testimonio.videoId}`} 
                      srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}img{object-fit:cover;height:100%}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black;background:rgba(0,0,0,0.5);border-radius:10px;padding:0 15px}</style><a href=https://www.youtube-nocookie.com/embed/${testimonio.videoId}?autoplay=1><img src=https://img.youtube.com/vi/${testimonio.videoId}/hqdefault.jpg alt='Video Testimonio'><span>▶</span></a>`}
                      title={`Testimonio ${testimonio.nombre}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className="mt-12 flex items-center justify-center border-t border-stone-100 pt-8">
              <div className="flex items-center gap-2">
                
                {/* Botón Anterior */}
                <button
                  type="button"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold border border-stone-200 bg-white text-stone-700 shadow-xs hover:bg-stone-50 hover:border-stone-300 hover:text-[#009baf] transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-stone-200 disabled:hover:text-stone-700 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Anterior</span>
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1.5 mx-1">
                  {Array.from({ length: totalPaginas }, (_, index) => {
                    const numeroPagina = index + 1;
                    const esActiva = paginaActual === numeroPagina;
                    return (
                      <button
                        type="button"
                        key={numeroPagina}
                        onClick={() => cambiarPagina(numeroPagina)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                          esActiva
                            ? 'bg-[#009baf] text-white shadow-sm scale-105'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300'
                        }`}
                        aria-label={`Página ${numeroPagina}`}
                        aria-current={esActiva ? "page" : undefined}
                      >
                        {numeroPagina}
                      </button>
                    );
                  })}
                </div>

                {/* Botón Siguiente */}
                <button
                  type="button"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold border border-stone-200 bg-white text-stone-700 shadow-xs hover:bg-stone-50 hover:border-stone-300 hover:text-[#009baf] transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-stone-200 disabled:hover:text-stone-700 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>Siguiente</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

              </div>
            </div>

          </div>
        </section>

        {/* 5. SECCIÓN REQUISITOS / PROCESO */}
        <section className="py-20 px-6 max-w-7xl mx-auto bg-stone-50">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <div className="aspect-[3/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white relative">
                <img 
                  src="/images/menu/proceso-pasantes.avif" 
                  alt="Proceso de selección" 
                  className="w-full h-full object-cover"
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Cómo ser parte del equipo?</h2>
                <p className="text-slate-600 leading-relaxed">
                  Crecer profesionalmente comienza con una oportunidad. Sigue estos pasos para iniciar tu proceso y ser parte de nuestra próxima generación de talentos.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-teal-600 pl-5 py-1">
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Paso a paso</h4>
                  <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                    <p><strong className="text-slate-900">1. Conoce la convocatoria:</strong> Mantente al tanto en nuestras redes sociales o revisa las vacantes disponibles abajo.</p>
                    <p><strong className="text-slate-900">2. Envía tu postulación:</strong> Haz clic en el botón de postular para enviarnos tu CV por correo electrónico indicando el área de tu interés.</p>
                    <p><strong className="text-slate-900">3. Entrevista:</strong> Si tu perfil hace match con nosotros, te contactaremos para coordinar una entrevista presencial.</p>
                  </div>
                </div>

                <div className="border-l-4 border-cyan-500 pl-5 py-1">
                  <h4 className="font-bold text-slate-800 text-lg mb-1">¡Empieza tu experiencia!</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Una vez completado el proceso y de acuerdo a nuestra disponibilidad, iniciaremos juntos esta nueva etapa de aprendizaje.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SECCIÓN POSICIONES */}
        <section className="py-20 px-6 bg-[#f8fbff] border-t border-stone-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Posiciones Disponibles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockPosiciones.map((posicion) => (
                <div 
                  key={posicion.id} 
                  className="bg-white rounded-3xl p-8 border border-stone-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <span className="text-[#00b4c5] text-[11px] font-bold tracking-widest uppercase mb-3 block">
                    {posicion.area}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                    {posicion.titulo}
                  </h3>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    {posicion.requisitos.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-[#00b4c5] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-600 text-sm font-medium leading-snug">{req}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto flex flex-col items-center">
                    <button 
                      type="button"
                      onClick={(e) => handlePostularClick(e, posicion)}
                      className="w-full bg-[#009baf] text-white font-bold py-3.5 rounded-full hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Postular
                    </button>
                    <span className="mt-4 text-stone-500 font-medium text-sm text-center">
                      Recuerda tener tu CV listo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
};

export default Pasantes;