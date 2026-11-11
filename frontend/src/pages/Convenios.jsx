import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// ==========================================
// 1. DATA DE CONVENIOS (Unificados)
// ==========================================
const CONVENIOS = [
  {
    id: 1,
    empresa: "Estaciones San José",
    tipo: "Corporativo",
    descripcion: "Beneficios exclusivos en salud preventiva y cuidado quiropráctico para los colaboradores de Grifos PetroPeru. Contribuyendo a una cultura de prevención y un entorno laboral seguro.",
    logo: "/images/menu/logo-petroperu.png", 
  },
  {
    id: 2,
    empresa: "OL&AS Grupo Inmobiliario",
    tipo: "Corporativo",
    descripcion: "Acuerdo de descuentos corporativos y atención especializada en beneficio del equipo de OL&AS Grupo Inmobiliario, promoviendo el bienestar, la salud y la productividad.",
    logo: "/images/menu/logo-olas.png",
  },
  {
    id: 3,
    empresa: "Universidad de Piura",
    tipo: "Institucional",
    descripcion: "Beneficios exclusivos en cuidado quiropráctico y oportunidad de pasantías para la comunidad universitaria, fomentando un óptimo rendimiento académico y bienestar integral.",
    logo: "/images/menu/logo-udep.png", 
  },
  {
    id: 4,
    empresa: "Universidad Tecnológica del Perú",
    tipo: "Institucional",
    descripcion: "Acuerdo de atención especializada y descuentos orientados a estudiantes, docentes y personal administrativo, promoviendo una cultura de prevención y calidad de vida.",
    logo: "/images/menu/logo-utp.png", 
  },
  {
    id: 5,
    empresa: "Grupo Cayman",
    tipo: "Corporativo",
    descripcion: "Alianza de colaboración para promover el bienestar, el desarrollo del talento y nuevas oportunidades profesionales",
    logo: "/images/menu/logo-cayman.png", 
  },
  {
    id: 6,
    empresa: "GP MOTOS | MAVILA",
    tipo: "Corporativo",
    descripcion: "Iniciativa de colaboración empresarial enfocada en el bienestar laboral y el desarrollo integral de los equipos de trabajo.",
    logo: "/images/menu/gpmotos.avif", 
  },
  {
    id: 7,
    empresa: "Olympo Fitness Center",
    tipo: "Corporativo",
    descripcion: "Colaboración empresarial que integra la actividad física y el cuidado de la salud para fomentar el bienestar integral y un estilo de vida saludable.",
    logo: "/images/menu/olympo.avif", 
  },
  {
    id: 8,
    empresa: "Colegio de Ingenieros del Peru",
    tipo: "Institucional",
    descripcion: "Acuerdo de cooperación orientado a fomentar el bienestar integral y contribuir a la calidad de vida de los profesionales de la ingeniería.",
    logo: "/images/menu/ingenieros.png", 
  },
  {
    id: 9,
    empresa: "Colegio de Obstetras de Piura",
    tipo: "Institucional",
    descripcion: "Acuerdo de cooperación orientado a promover el bienestar integral y fortalecer el desarrollo profesional de la comunidad obstétrica.",
    logo: "/images/menu/obstetra.avif", 
  },
  {
    id: 10,
    empresa: "Sitramip Tumbes",
    tipo: "Institucional",
    descripcion: "Acuerdo de cooperación destinado a promover el bienestar integral y contribuir a la calidad de vida de los trabajadores del Ministerio Público.",
    logo: "/images/menu/sitramip.avif", 
  },
  {
    id: 11,
    empresa: "Colegios de licenciados en Administración",
    tipo: "Institucional",
    descripcion: "Beneficios que promueven el bienestar integral y contribuir a la calidad de vida de profesionales Administrativos",
    logo: "/images/menu/corlad.avif", 
  },
  {
    id: 12,
    empresa: "Casa Bonita Residencial",
    tipo: "Corporativa",
    descripcion: "Compromiso de atención especializada en beneficio del equipo de Casa Bonita Residencial, promoviendo el bienestar y la salud para sus colaboradores y clientes",
    logo: "/images/menu/casabonita.avif", 
  },
  {
    id: 13,
    empresa: "Senati",
    tipo: "Institucional",
    descripcion: "Oportunidades laborales y pasantías para la comunidad institucional, fomentando el bienestar integral y trabajo en equipo.",
    logo: "/images/menu/senati.png", 
  },
  {
    id: 14,
    empresa: "ISA INTEGRAL",
    tipo: "Institucional",
    descripcion: "Acuerdo destinado a promover la calidad de vida y el bienestar de los estudiantes, docentes y colaboradores del INSTITUTO DE EDUCACIÓN SUPERIOR PRIVADO.",
    logo: "/images/menu/isa.png", 
  },
  {
    id: 15,
    empresa: "Caja Piura",
    tipo: "Corporativo",
    descripcion: "Beneficios exclusivos en tu bienestar físico y cuidado quiropráctico para los colaboradores de la Caja Piura. Formando un entorno laboral seguro.",
    logo: "/images/menu/cajapiura.jpg", 
  },
  {
    id: 16,
    empresa: "Club Grau",
    tipo: "Corporativo",
    descripcion: "Acuerdos que integra la actividad física y el cuidado de la salud para fomentar el bienestar físico y un estilo de vida saludable.",
    logo: "/images/menu/clubgrau.jpg", 
  }
];

const PERFILES_ALIANZA = [
  {
    titulo: "Empresas privadas",
    desc: "Organizaciones que buscan promover la salud y el bienestar de sus colaboradores."
  },
  {
    titulo: "Instituciones públicas y privadas",
    desc: "Entidades interesadas en desarrollar actividades de promoción y cuidado de la salud."
  },
  {
    titulo: "Centros educativos y universidades",
    desc: "Instituciones que desean generar oportunidades de formación, prácticas e internado para futuros profesionales."
  },
  {
    titulo: "Organizaciones y asociaciones",
    desc: "Grupos que buscan acercar servicios de salud y bienestar a sus integrantes."
  }
];

const BENEFICIOS_CONVENIO = [
  {
    titulo: "Charlas educativas",
    desc: "Orientación sobre salud de la columna, postura, prevención y cuidado musculoesquelético."
  },
  {
    titulo: "Pausas activas",
    desc: "Actividades para promover el movimiento y reducir los efectos del sedentarismo laboral."
  },
  {
    titulo: "Evaluaciones de columna",
    desc: "Evaluación funcional y orientación especializada sobre el cuidado musculoesquelético."
  },
  {
    titulo: "Beneficios en servicios",
    desc: "Condiciones especiales para colaboradores y familiares directos según cada acuerdo."
  },
  {
    titulo: "Formación profesional",
    desc: "Oportunidades de prácticas e internado en fisioterapia mediante convenios interinstitucionales."
  }
];

// Cantidad de convenios por página
const ITEMS_POR_PAGINA = 8;

export default function Convenios() {
  const [activeModal, setActiveModal] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();
  
  // 1. Referencia para la sección de los logos
  const seccionLogosRef = useRef(null);

  // Enlace directo para contacto corporativo
  const whatsappNumber = "51982087005";
  const whatsappMessage = encodeURIComponent("Hola, represento a una institución/empresa y quisiera información para establecer un convenio con Quiro Plus.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // --- Lógica de paginación ---
  const totalPaginas = Math.ceil(CONVENIOS.length / ITEMS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const conveniosVisibles = CONVENIOS.slice(indiceInicio, indiceInicio + ITEMS_POR_PAGINA);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
    
    // 2. Scroll fluido hasta la sección de convenios
    if (seccionLogosRef.current) {
      seccionLogosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col overflow-x-hidden">
      <Header setActiveModal={setActiveModal} />

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* ==========================================
            1. HERO SECTION / PORTADA (Diseño Intacto)
        ========================================== */}
        <section className="w-full bg-[#f8fbff] relative border-b border-stone-200">
          <div className="absolute inset-y-0 right-0 w-full md:w-[75%] z-0 pointer-events-none">
            <img 
              src="/images/menu/convenios-portada.jpg" 
              alt="Convenios QuiroPlus" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8fbff] via-[#f8fbff]/90 md:via-[#f8fbff]/10 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10 flex">
            <div className="w-full md:w-1/2 space-y-5 md:space-y-6">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
                <button onClick={() => navigate('/')} className="text-slate-500 hover:text-[#009baf] transition-colors cursor-pointer">
                  Inicio
                </button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-slate-800">Convenios</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight leading-[1.1]">
                Alianzas que generan <br className="hidden lg:block"/>
                <span className="text-[#009baf]">bienestar</span>
              </h1>
              
              <p className="text-slate-800 md:text-slate-900 text-base md:text-lg leading-relaxed max-w-md font-medium">
                Colaboramos con empresas e instituciones para acercar servicios de prevención, evaluación y cuidado musculoesquelético.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            2. ALCANCE Y BENEFICIOS (Nuevo Diseño Minimalista)
        ========================================== */}
        <section className="py-16 md:py-24 bg-stone-50 border-b border-stone-200 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            
            {/* Intro Filosofía */}
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-[#009baf] text-xs font-bold tracking-widest uppercase">
                Propósito Compartido
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
                Salud y calidad de vida para tu organización
              </h2>
              <p className="text-stone-600 text-base md:text-lg leading-relaxed font-normal">
                Desde nuestra experiencia en quiropráctica y fisioterapia, desarrollamos propuestas de colaboración adaptadas a las necesidades de cada entidad, construyendo espacios de trabajo y aprendizaje más saludables.
              </p>
            </div>

            {/* Bloques Duales: Con quiénes trabajamos y Qué ofrecemos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Columna Izquierda: ¿Con quiénes podemos establecer convenios? */}
              <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                    ¿Con quiénes nos aliamos?
                  </h3>
                  <p className="text-stone-500 text-sm mt-1">
                    Abiertos a instituciones comprometidas con su comunidad.
                  </p>
                </div>

                <div className="space-y-5">
                  {PERFILES_ALIANZA.map((item, idx) => (
                    <div key={idx} className="border-l-2 border-[#009baf] pl-4 py-0.5">
                      <h4 className="font-bold text-stone-800 text-base">
                        {item.titulo}
                      </h4>
                      <p className="text-stone-600 text-sm leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Derecha: ¿Qué podemos ofrecer? */}
              <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                    ¿Qué ofrecemos en nuestros convenios?
                  </h3>
                  <p className="text-stone-500 text-sm mt-1">
                    Soluciones integrales de prevención, atención y desarrollo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {BENEFICIOS_CONVENIO.map((ben, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl bg-stone-50/70 border border-stone-100 ${
                        idx === BENEFICIOS_CONVENIO.length - 1 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[#009baf] shrink-0"></span>
                        <h4 className="font-bold text-slate-900 text-base">
                          {ben.titulo}
                        </h4>
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed pl-4">
                        {ben.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ==========================================
            3. LISTA DE CONVENIOS (Intacta como pediste)
        ========================================== */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 md:px-6">
            
            {/* --- SECCIÓN ÚNICA DE CONVENIOS --- */}
            <div ref={seccionLogosRef} className="mb-10 scroll-mt-[100px] lg:scroll-mt-[120px]">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px bg-stone-200 flex-grow max-w-[100px] hidden md:block"></div>
                <h3 className="text-xl md:text-2xl font-bold text-[#009baf] uppercase tracking-wider text-center">
                  Convenios Corporativos e Institucionales
                </h3>
                <div className="h-px bg-stone-200 flex-grow max-w-[100px] hidden md:block"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                {conveniosVisibles.map(convenio => (
                  <div 
                    key={convenio.id} 
                    className="bg-white border border-stone-100 rounded-2xl p-6 md:p-8 lg:p-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,155,175,0.1)] transition-all duration-300 flex flex-col items-center text-center group"
                  >
                    <div className="w-full h-24 md:h-36 mb-6 md:mb-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src={convenio.logo} 
                        alt={`Logo de ${convenio.empresa}`} 
                        className="max-w-[160px] md:max-w-[220px] max-h-full object-contain drop-shadow-sm"
                        onError={(e) => { 
                          e.target.src = "https://via.placeholder.com/250x100?text=Logo+Aquí";
                        }}
                      />
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold text-stone-800 mb-2">
                      {convenio.empresa}
                    </h4>
                    <h5 className="text-xs md:text-sm font-bold text-[#009baf] uppercase tracking-wider mb-4 border border-[#009baf]/20 bg-[#009baf]/5 px-3 py-1 rounded-full">
                      {convenio.tipo}
                    </h5>
                    <p className="text-stone-600 leading-relaxed text-sm md:text-base flex-grow">
                      {convenio.descripcion}
                    </p>
                  </div>
                ))}
              </div>

              {/* --- CONTROLES DE PAGINACIÓN --- */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 text-sm font-medium hover:border-[#009baf] hover:text-[#009baf] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:text-stone-600"
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                    <button
                      key={numero}
                      onClick={() => cambiarPagina(numero)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                        paginaActual === numero
                          ? 'bg-[#009baf] text-white border border-[#009baf]'
                          : 'border border-stone-200 text-stone-600 hover:border-[#009baf] hover:text-[#009baf]'
                      }`}
                    >
                      {numero}
                    </button>
                  ))}

                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 text-sm font-medium hover:border-[#009baf] hover:text-[#009baf] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:text-stone-600"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ==========================================
            4. CALL TO ACTION FINAL (Rediseñado Minimalista)
        ========================================== */}
        <section className="py-20 px-6 bg-stone-50 border-t border-stone-200 text-center">
          <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center">
            <span className="text-[#009baf] text-xs font-bold tracking-widest uppercase">
              Trabajemos juntos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              ¿Representas a una empresa o institución?
            </h2>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed">
              Nuestro objetivo es crear relaciones de beneficio mutuo. Contáctanos y conversemos sobre las oportunidades de colaboración para tu equipo o comunidad.
            </p>
            <div className="pt-2 w-full sm:w-auto">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#009baf] hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-full shadow-sm transition-all duration-300 text-base w-full sm:w-auto"
              >
                Solicitar un convenio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
}