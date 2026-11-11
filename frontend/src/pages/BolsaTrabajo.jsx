import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, 
  BookOpen, 
  Activity, 
  Trophy, 
  MapPin, 
  Briefcase, 
  Building, 
  Clock, 
  Globe,
  Search,
  X
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// ==========================================
// 1. DATOS MOCKUP
// ==========================================
const mockBeneficios = [
  { id: 1, icon: Trophy, titulo: 'Trabajo', desc: 'Valoramos el esfuerzo, la iniciativa, la disciplina y el compromiso de hacer bien las cosas.' },
  { id: 2, icon: HeartHandshake, titulo: 'Honestidad', desc: 'Respetamos a nuestros compañeros, pacientes, recursos y compromisos. Actuamos con integridad.' },
  { id: 3, icon: BookOpen, titulo: 'Verdad', desc: 'Hablamos con transparencia, asumimos nuestros errores y cumplimos nuestra palabra.' },
  { id: 4, icon: Activity, titulo: 'Desarrollo y Crecimiento', desc: 'Promovemos el aprendizaje continuo, reconociendo el talento, el esfuerzo y el compromiso de nuestro equipo.' }
];

const mockTestimonios = [
  {
    id: 1,
    nombre: 'Martin Quiroz',
    cargo: 'Gerente',
    imagen: '/images/menu/directivo1.avif',
    texto: '"La estabilidad de trabajar en una empresa seria, enfocada en la salud de las personas, me ha brindado excelentes oportunidades de crecimiento continuo. Me siento muy orgulloso de liderar este proyecto y me considero afortunado por el gran equipo humano con el que trabajo a diario en QuiroPlus."',
    videoId: 'hO3qVV-ChsA' // <-- ID extraído para la carga optimizada
  },
  {
    id: 2,
    nombre: 'Perla Mogollón',
    cargo: 'Asistente de ventas',
    imagen: '/images/menu/directiva11.avif', 
    texto: '"Me siento muy feliz de pertenecer a QuiroPlus porque desde mi rol puedo aportar a incentivar nuestros valores institucionales y brindar una excelente atención a nuestros pacientes. Trabajar aquí me permite desarrollarme personal y profesionalmente en un ambiente increíble."',
    videoId: 'fNzbFQqpjoU' // <-- ID extraído para la carga optimizada
  }
];

// Datos reales basados en los requerimientos
const mockVacantes = [
  { 
    id: 1, 
    titulo: 'Asesora de Ventas', 
    empresa: 'Centro Quiropráctico de Vida',
    ubicacion: 'Piura, Sullana, Tumbes, Talara, Tacna',
    jornada: 'Full Time',
    modalidad: 'Presencial',
    contrato: 'Ingreso a planilla',
    publicado: 'reciente',
    disponible: true
  },
  { 
    id: 2, 
    titulo: 'Asistente Administrativa', 
    empresa: 'Centro Quiropráctico de Vida',
    ubicacion: 'Piura, Sullana',  
    jornada: 'Full Time',
    modalidad: 'Presencial',
    contrato: 'Ingreso a planilla',
    publicado: 'reciente',
    disponible: true
  }
];

export default function BolsaTrabajo() {
  const [activeModal, setActiveModal] = useState(null);
  
  // Estados para la Cartilla de Carga (correo)
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCargandoCorreo, setIsCargandoCorreo] = useState(false);
  
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // Limpiar el timeout si el componente se desmonta
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Función que procesa el click en POSTULAR directo al correo
  const handlePostularClick = (vacante) => {
    if (!vacante.disponible) return;
    
    setSelectedJob(vacante);
    setIsCargandoCorreo(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Esperamos 3.5 segundos para que lean las instrucciones y abrimos el correo
    timeoutRef.current = setTimeout(() => {
      const asunto = encodeURIComponent(`Postulación a vacante: ${vacante.titulo}`);
      window.location.href = `mailto:cqdevidapiura@gmail.com?subject=${asunto}`;
      setIsCargandoCorreo(false); 
      setSelectedJob(null);
    }, 3500);
  };

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col text-slate-800 overflow-x-hidden relative">
      <Header setActiveModal={setActiveModal} />

      {/* --- MODAL INFORMATIVO (CARTILLA DE CARGA - 3.5s) --- */}
      {isCargandoCorreo && selectedJob && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center animate-[scaleIn_0.2s_ease-out]">
            <div className="w-14 h-14 border-4 border-stone-200 border-t-[#009baf] rounded-full animate-spin mb-5"></div>
            
            {/* Accesibilidad: Corregido a h2 para respetar el orden */}
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Preparando tu correo...</h2>
            
            <div className="bg-[#f8fbff] p-5 rounded-2xl border border-[#009baf]/20 w-full mb-5 text-left">
              <p className="text-slate-800 font-bold mb-3 text-sm text-center">
                Para esta vacante, recuerda adjuntar:
              </p>
              <ul className="text-slate-600 text-sm space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> CV actualizado documentado
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> Copia de tu DNI
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> Certificados de estudios o trabajo
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> Referencias laborales
                </li>
              </ul>
            </div>
            
            <p className="text-xs text-stone-500 font-medium">
              Abriendo tu aplicación de correo en unos segundos...
            </p>
          </div>
        </div>
      )}
      {/* ------------------------------------------------ */}

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* ==========================================
            1. HERO SECTION
        ========================================== */}
        <section className="w-full bg-[#f8fbff] relative border-b border-stone-200">
          <div className="absolute inset-y-0 right-0 w-full md:w-[60%] z-0 pointer-events-none">
            <img 
              src="/images/menu/trabaja-con-nosotros.avif" 
              alt="Trabaja con nosotros" 
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              width="1006" 
              height="754"
              onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=Foto+Portada" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8fbff] via-[#f8fbff]/50 md:via-[#f8fbff]/10 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 flex">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-slate-500 hover:text-[#009baf] transition-colors cursor-pointer"
                >
                  Inicio
                </button>
                <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-800">
                  Trabaja con Nosotros
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight leading-[1.1]">
                Crece y construye <br className="hidden lg:block"/>
                en <span className="text-[#009baf]">QuiroPlus</span>
              </h1>
              
              <p className="text-slate-900 text-lg leading-relaxed max-w-sm font-medium">
                No buscamos solamente colaboradores. Buscamos personas que quieran crecer y construir algo importante.
              </p>

              <div className="pt-2">
                <button 
                  type="button"
                  onClick={() => document.getElementById('vacantes-section').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#009baf] text-white font-bold px-8 py-3.5 rounded-full hover:bg-teal-700 transition-colors shadow-md relative z-20"
                >
                  Postula ahora
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            2. SOBRE NOSOTROS
        ========================================== */}
        <section className="py-20 px-6 max-w-7xl mx-auto bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-normal text-stone-700 leading-tight">
              Nuestra <br/>
              <span className="text-[#009baf] font-bold text-4xl tracking-tight">Historia</span>
            </h2>
          </div>
          
          <div className="max-w-5xl mb-12">
            <p className="text-stone-600 leading-relaxed text-base md:text-lg">
              En Quiro Plus creemos que una empresa crece cuando las personas que la integran también tienen oportunidades para desarrollarse. Somos una empresa peruana con una trayectoria que se construye desde 2013.<br className="mb-3"/>
              Durante estos años hemos crecido, superado desafíos y llevado nuestros servicios a diferentes ciudades del país. Pero sabemos que nuestro mayor valor no está solamente en nuestra historia, sino en las personas que hacen posible cada paso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-[4/3] md:aspect-square overflow-hidden bg-stone-100 rounded-xl">
              <img src="/images/menu/sobre-nosotros-1.jpg" loading="lazy" decoding="async" alt="Colaborador QuiroPlus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Foto+1" }} />
            </div>
            <div className="aspect-[4/3] md:aspect-square overflow-hidden bg-stone-100 rounded-xl">
              <img src="/images/menu/sobre-nosotros-2.jpg" loading="lazy" decoding="async" alt="Colaborador QuiroPlus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Foto+2" }} />
            </div>
            <div className="aspect-[4/3] md:aspect-square overflow-hidden bg-stone-100 rounded-xl">
              <img src="/images/menu/sobre-nosotros-3.jpg" loading="lazy" decoding="async" alt="Colaborador QuiroPlus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Foto+3" }} />
            </div>
          </div>
        </section>

        {/* ==========================================
            3. NUESTROS BENEFICIOS -> PRINCIPIOS
        ========================================== */}
        <section className="py-20 px-6 max-w-7xl mx-auto bg-white border-t border-stone-100">
          <div className="mb-14">
            <h2 className="text-3xl font-normal text-stone-700 leading-tight">
              Nuestros <br/>
              <span className="text-[#009baf] font-bold text-4xl tracking-tight">Principios</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
            {mockBeneficios.map((ben) => (
              <div key={ben.id} className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <ben.icon className="w-7 h-7 text-[#009baf]" aria-hidden="true" strokeWidth={2.5} />
                  <h3 className="text-xl font-bold text-slate-800">{ben.titulo}</h3>
                </div>
                <p className="text-stone-600 font-medium pl-10 text-base">{ben.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            4. TESTIMONIOS 
        ========================================== */}
        <section className="py-24 px-6 bg-stone-50 border-y border-stone-200">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:mb-20 text-center md:text-left max-w-3xl">
              <h2 className="text-3xl font-normal text-stone-700 leading-tight mb-4">
                Conoce a algunos de<br/>
                <span className="text-[#009baf] font-bold text-4xl tracking-tight">Nuestros colaboradores</span>
              </h2>
              {/* --- PÁRRAFO AÑADIDO --- */}
              <p className="text-stone-600 text-lg leading-relaxed">
                Aquí puedes desarrollar mucho más que una experiencia laboral. Queremos que cada integrante encuentre oportunidades para fortalecer sus habilidades, asumir nuevas responsabilidades y descubrir su potencial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-14 max-w-5xl mx-auto">
              {mockTestimonios.map((testimonio) => (
                <div key={testimonio.id} className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 flex flex-col relative pt-16 hover:shadow-lg transition-shadow">
                  
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <img 
                      src={testimonio.imagen} 
                      alt={`Foto de ${testimonio.nombre}`} 
                      loading="lazy"
                      decoding="async"
                      width="168"
                      height="168"
                      className="w-21 h-26 rounded-full object-cover border-4 border-white shadow-md"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                    />
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-[#009baf] font-bold text-xl">{testimonio.nombre}</h3>
                    <p className="text-slate-800 font-bold text-sm mt-1">{testimonio.cargo}</p>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed text-justify mb-8 flex-grow">
                    {testimonio.texto}
                  </p>

                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-black mt-auto border border-stone-200">
                    {/* OPTIMIZACIÓN YOUTUBE: Facade con srcDoc para evitar los 2MB de carga de JS */}
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${testimonio.videoId}`} 
                      srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black;background:rgba(0,0,0,0.5);border-radius:10px;padding:0 15px}</style><a href=https://www.youtube-nocookie.com/embed/${testimonio.videoId}?autoplay=1><img src=https://img.youtube.com/vi/${testimonio.videoId}/hqdefault.jpg alt='Video Testimonio'><span>▶</span></a>`}
                      title={`Testimonio de ${testimonio.nombre}`}
                      loading="lazy"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            5. LISTADO DE VACANTES
        ========================================== */}
        <section id="vacantes-section" className="py-24 px-6 max-w-5xl mx-auto bg-white">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-normal text-stone-700 leading-tight mb-2">
              Únete a <br/>
              <span className="text-[#009baf] font-bold text-4xl tracking-tight">Nuestro equipo</span>
            </h2>
            <p className="text-stone-600 font-medium text-lg">
              El siguiente paso de tu carrera puede comenzar aquí. ¿Estás listo?
            </p>
          </div>

          <div className="border border-stone-200 rounded-md p-4 mb-10 flex flex-col md:flex-row gap-4 items-center bg-stone-50 text-sm font-medium text-stone-500 justify-between">
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
              <button type="button" className="flex items-center gap-1 cursor-pointer hover:text-[#009baf] focus:outline-none"><MapPin className="w-4 h-4" aria-hidden="true"/> Ubicación</button>
              <button type="button" className="flex items-center gap-1 cursor-pointer hover:text-[#009baf] focus:outline-none"><Briefcase className="w-4 h-4" aria-hidden="true"/> Área</button>
              <button type="button" className="flex items-center gap-1 cursor-pointer hover:text-[#009baf] focus:outline-none"><Building className="w-4 h-4" aria-hidden="true"/> Empresa</button>
              <button type="button" className="flex items-center gap-1 cursor-pointer hover:text-[#009baf] focus:outline-none"><Clock className="w-4 h-4" aria-hidden="true"/> Jornada laboral</button>
              <button type="button" className="flex items-center gap-1 cursor-pointer hover:text-[#009baf] focus:outline-none"><Globe className="w-4 h-4" aria-hidden="true"/> Modalidad</button>
            </div>
            <div className="flex items-center gap-2 border-b border-stone-300 pb-1 px-2 w-full md:w-auto mt-4 md:mt-0">
              <Search className="w-4 h-4 text-stone-400" aria-hidden="true" />
              <input type="text" placeholder="Buscar" aria-label="Buscar vacantes" className="bg-transparent outline-none w-full text-stone-700 placeholder-stone-400" />
            </div>
          </div>

          <div className="space-y-0">
            {mockVacantes.map((vacante, idx) => (
              <div 
                key={vacante.id} 
                className={`py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${idx !== mockVacantes.length - 1 ? 'border-b border-stone-200' : ''}`}
              >
                <div className="space-y-3 flex-1 w-full">
                  <h3 className="text-[#009baf] font-bold text-xl hover:underline cursor-pointer">
                    {vacante.titulo}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                    <div className="w-6 h-6 bg-teal-100 rounded text-teal-800 flex items-center justify-center text-[10px] font-bold" aria-hidden="true">QP</div>
                    {vacante.empresa}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-stone-500 text-sm font-medium">
                    <span className="flex items-center font-bold text-slate-700">
                      <span className="text-red-600 mr-1" aria-hidden="true">I I</span> {vacante.ubicacion}
                    </span>
                    <span className="text-stone-300 hidden md:inline" aria-hidden="true">|</span>
                    <span>{vacante.jornada}</span>
                    <span className="text-stone-300 hidden md:inline" aria-hidden="true">|</span>
                    <span>{vacante.modalidad}</span>
                    <span className="text-stone-300 hidden md:inline" aria-hidden="true">|</span>
                    <span>{vacante.contrato}</span>
                  </div>

                  <p className="text-stone-400 text-xs font-medium pt-1">
                    Lo más {vacante.publicado}
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto flex justify-end">
                  {vacante.disponible ? (
                    <button 
                      type="button"
                      onClick={() => handlePostularClick(vacante)}
                      className="bg-[#009baf] hover:bg-teal-700 text-white font-bold py-3 md:py-2.5 px-8 rounded shadow-sm transition-colors w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
                    >
                      POSTULAR
                    </button>
                  ) : (
                    <button 
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="bg-stone-200 text-stone-500 font-bold py-3 md:py-2.5 px-8 rounded shadow-sm cursor-not-allowed w-full md:w-auto"
                    >
                      NO DISPONIBLE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
}