import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// ============================================================
// DATOS DE LA PÁGINA
// ============================================================

const testimoniosEquipo = [
  {
    id: 'evaluacion',
    label: 'Especialista Quiropráctica',
    titulo: 'Lic. Saydeli Rojas',
    origen: 'México',
    sede: 'Piura, Perú',
    imagen: '/images/menu/especialista3.avif',
    desc: 'Formar parte de este equipo me ha permitido potenciar mis habilidades clínicas y de liderazgo. Nos enfocamos en brindar un diagnóstico claro y un tratamiento efectivo, respaldados siempre por un entorno de constante aprendizaje, innovación y compañerismo.',
    videoId: 'Ad7hNwNmTFI',
    esVertical: true
  },
  {
    id: 'ajuste',
    label: 'Especialista Quiropráctico',
    titulo: 'Lic. Ángel Herrera',
    origen: 'México',
    sede: 'Tumbes, Perú',
    imagen: '/images/menu/especialista9.avif', 
    desc: 'Aquí he encontrado el espacio ideal para aplicar mis conocimientos biomecánicos con total seguridad. Trabajar con técnicas especializadas e instalaciones adecuadas hace que nuestra labor diaria impacte positivamente de forma inmediata en la salud de las personas.',
    videoId: '6gzxYcQO3Wo',
    esVertical: true
  }
];

const destinosTurismo = [
  { id: 1, nombre: 'Machu Picchu', lugar: 'Cusco', img: '/images/menu/turismo-machupicchu.avif' },
  { id: 2, nombre: 'Playas de Máncora', lugar: 'Piura', img: '/images/menu/turismo-mancora.avif' },
  { id: 3, nombre: 'Oasis Huacachina', lugar: 'Ica', img: '/images/menu/turismo-huacachina.avif' },
  { id: 4, nombre: 'Montaña Vinicunca', lugar: 'Cusco', img: '/images/menu/turismo-vinicunca.avif' }
];

const faqs = [
  { pregunta: '¿Qué perfil buscamos en nuestros especialistas?', respuesta: 'Buscamos profesionales proactivos, apasionados por la quiropráctica, con sólida formación en biomecánica y, sobre todo, un alto sentido ético y vocación de servicio hacia el paciente.' },
  { pregunta: '¿Ofrecen oportunidades de capacitación?', respuesta: 'Sí, fomentamos el aprendizaje continuo. Nuestro equipo recibe capacitaciones sobre manejo de casos complejos, actualización en técnicas de ajuste y atención integral al paciente.' },
  { pregunta: '¿Cómo es el ambiente de trabajo?', respuesta: 'Promovemos un clima laboral basado en el respeto mutuo, el compañerismo y la comunicación abierta. Creemos que un equipo unido y motivado refleja un mejor cuidado hacia nuestros pacientes.' },
  { pregunta: '¿Qué documentos necesito para postular?', respuesta: 'Para iniciar tu proceso solo necesitas enviarnos tu CV actualizado documentado, copia de tu documento de identidad y referencias laborales o certificados de estudios al correo de contacto.' }
];

const Quiropracticas = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);
  const [isCargandoCorreo, setIsCargandoCorreo] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', correo: '', telefono: '' });

  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handlePostularClick = (tituloPuesto = 'Especialista Quiropráctico') => {
    setVacanteSeleccionada(tituloPuesto);
    setIsCargandoCorreo(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const asunto = encodeURIComponent(`Postulación a vacante: ${tituloPuesto}`);
      window.location.href = `mailto:cqdevidapiura@gmail.com?subject=${asunto}`;
      setIsCargandoCorreo(false); 
      setVacanteSeleccionada(null);
    }, 3500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const numeroWpp = "51982087005";
    const mensaje = `Hola, mi nombre es ${formData.nombre}. Mi correo electrónico es ${formData.correo} y mi número es ${formData.telefono}. Deseo postular para trabajar con ustedes.`;
    const url = `https://wa.me/${numeroWpp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
    setFormData({ nombre: '', correo: '', telefono: '' });
  };

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <Header setActiveModal={setActiveModal} />

      {/* --- MODAL INFORMATIVO --- */}
      {isCargandoCorreo && vacanteSeleccionada && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center animate-[scaleIn_0.2s_ease-out]">
            <div className="w-14 h-14 border-4 border-stone-200 border-t-[#009baf] rounded-full animate-spin mb-5"></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Preparando tu correo...</h2>
            <div className="bg-[#f8fbff] p-5 rounded-2xl border border-[#009baf]/20 w-full mb-5 text-left">
              <p className="text-slate-800 font-bold mb-3 text-sm text-center">
                Para esta vacante, recuerda adjuntar:
              </p>
              <ul className="text-slate-600 text-sm space-y-2 font-medium">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> CV actualizado documentado</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> Copia de tu DNI</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> Certificados de estudios o trabajo</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#009baf] shrink-0"></span> Referencias laborales</li>
              </ul>
            </div>
            <p className="text-xs text-stone-500 font-medium">Abriendo tu aplicación de correo en unos segundos...</p>
          </div>
        </div>
      )}

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full bg-[#52878e] overflow-hidden h-[450px] flex items-center">
          <div className="absolute inset-0 z-0 flex justify-end">
            <div className="w-full md:w-2/3 h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#52878e] via-[#52878e]/40 to-transparent z-10"></div>
              <img 
                src="/images/menu/portada-quiropractica.jpg" 
                alt="Especialistas quiroprácticos" 
                className="w-full h-full object-cover object-center"
                width="1200" height="800" fetchpriority="high"
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
            <div className="w-full md:w-1/2 text-white space-y-5">
              <div className="flex items-center gap-2 text-white/90 text-sm font-semibold mb-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-[#99f6e4] hover:underline transform hover:scale-105 transition-all duration-300">
                  Inicio
                </button>
                <span className="mx-1">/</span>
                <span className="text-white">Quiroprácticas</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">Perú te espera</h1>
              <p className="text-white/90 text-base md:text-lg font-medium max-w-svw">
                La quiropráctica es una profesión del cuidado de la salud que requiere una sólida preparación académica, conocimiento profundo del cuerpo humano y formación clínica especializada.
              </p>
              <div className="pt-2">
                <button type="button" onClick={() => handlePostularClick('Especialista Quiropráctico')} className="bg-white text-[#52878e] font-bold px-8 py-3 rounded-full hover:bg-stone-50 transition-colors shadow-md transform hover:-translate-y-1 duration-300">
                  Postular ahora
                </button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex absolute bottom-6 right-6 lg:right-20 bg-white rounded-xl shadow-xl overflow-hidden z-30">
            <div className="px-6 py-3 border-r border-slate-100 flex items-center justify-center bg-white">
              <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-[#009baf]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Talento Profesional
              </p>
            </div>
            <button type="button" onClick={() => handlePostularClick('Especialista Quiropráctico')} className="px-5 py-3 bg-[#009baf] hover:bg-teal-600 transition-colors flex items-center gap-2 text-white">
              <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div className="text-left leading-tight">
                <span className="block text-[10px] font-medium">Envía tu CV</span>
                <span className="block text-sm font-bold">Sé parte del equipo</span>
              </div>
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 1.5 NUEVA SECCIÓN: INTRODUCCIÓN QUIROPRÁCTICA (Simple y Elegante) */}
        {/* ============================================================ */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              
              {/* Contenido de Texto */}
              <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
                
                  <h2 className="
                    text-3xl md:text-4xl lg:text-4xl
                    font-black text-gray-800
                    leading-[1.15]
                    text-center md:text-left
                  ">
                    Formación internacional.
                    <br />
                    <span className="text-cyan-700 font-extrabold">
                      Experiencia profesional.
                    </span>
                    <br />
                    Compromiso con las personas.
                  </h2>
                
                {/* Párrafos */}
                <div className="space-y-5 text-[15px] md:text-[17px] text-stone-600 leading-relaxed font-medium text-justify md:text-left">
                  <p className='text-justify'>
                    En QP creemos que la confianza comienza con la preparación de quienes te atienden. Por eso apostamos por profesionales con formación universitaria específica en quiropráctica, procedentes de instituciones educativas de diferentes partes del mundo.
                  </p>
                  <p className='text-justify'>
                    Nuestros profesionales han desarrollado su preparación en países como México, Brasil y otros lugares donde existen programas universitarios especializados en esta disciplina.
                  </p>
                  <p className='text-justify'>
                    Su formación comprende áreas fundamentales como anatomía, fisiología, neurología, biomecánica, evaluación clínica y técnicas quiroprácticas, además de prácticas supervisadas y formación continua.
                  </p>
                  
                  {/* Bloque Burbuja de Pensamiento (Simple, negro, tipo cómic elegante) */}
                  <div className="mt-10 flex flex-row items-start gap-4 pt-4 relative">
                    
                    {/* Persona Pensando (Empujada hacia abajo para dar efecto de que la burbuja sube) */}
                    <div className="w-20 h-80 sm:w-24 sm:h-64 shrink-0 relative z-10 mt-8">
                      <img 
                        src="/images/menu/pensando.avif" 
                        alt="Persona reflexionando" 
                        className="w-full h-full object-contain"
                        width="500" height="500" loading="lazy"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/500x500?text=Pensando" }}
                      />
                    </div>
                    
                    {/* Nube de Pensamiento Real */}
                    <div className="relative bg-white rounded-[4.5rem] p-5 sm:px-7 sm:py-6 border-2 border-slate-900 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex-1">
                      
                      {/* Círculos de conexión de la burbuja */}
                      <div className="absolute -left-4 bottom-6 w-4 h-4 bg-white rounded-full border-2 border-slate-900"></div>
                      <div className="absolute -left-8 bottom-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-slate-900"></div>
                      
                      <p className="text-slate-900 font-bold text-sm md:text-[15px] leading-snug m-0 relative z-10">
                        "No se trata solamente de conocer una técnica. Se trata de comprender el cuerpo humano, evaluar responsablemente a cada persona y saber cuándo corresponde intervenir o derivar a otro profesional."
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Imagen Principal Limpia */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-lg bg-stone-100 border border-stone-200">
                  <img 
                    src="/images/menu/quirointro.avif" 
                    alt="Especialistas quiroprácticos en consulta" 
                    className="w-full h-auto aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                    width="800" height="600" loading="lazy" decoding="async"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=Intro+Quiropractica" }}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* ============================================================ */}

        {/* 2. CÓMO ES TRABAJAR CON NOSOTROS */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 md:space-y-24">
            
            <div className="text-center md:text-left mb-10 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-5">
                Una formación que <span className="text-[#0da7a7]">mira al mundo</span>
              </h2>
              <p className=" text-stone-700 text-[15px] md:text-[17px] text-justify leading-[1.9] tracking-[0.01em] max-w-3xl font-normal antialiased decoration-transparent">
                La educación quiropráctica ha evolucionado internacionalmente. Organizaciones como la Federación Mundial de Quiropráctica (WFC) promueven estándares de formación, investigación y práctica profesional. Asimismo, organismos especializados de acreditación trabajan para evaluar la calidad de los programas educativos.

                En QP valoramos esta preparación internacional y buscamos que nuestros pacientes reciban una atención respaldada por conocimiento, experiencia y responsabilidad profesional.
              </p>
            </div>

            {testimoniosEquipo.map((paso, index) => (
              <div 
                key={paso.id} 
                className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${
                  index !== testimoniosEquipo.length - 1 ? 'border-b border-stone-100 pb-16 md:pb-24' : ''
                }`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] rounded-xl p-4 mb-6 border border-stone-100 max-w-md">
                    <div className="w-24 h-24 sm:w-28 sm:h-30 shrink-0 rounded-lg overflow-hidden bg-stone-100 mr-5 border border-stone-200">
                      <img 
                        src={paso.imagen} 
                        alt={paso.titulo} 
                        className="w-full h-40 object-cover"
                        width="112" height="160" loading="lazy"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Especialista" }}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[#009baf] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                        {paso.label}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mb-3">
                        {paso.titulo}
                      </h3>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <svg aria-hidden="true" className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <p className="leading-none"><strong className="text-slate-800">Origen:</strong> {paso.origen}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <svg aria-hidden="true" className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <p className="leading-none"><strong className="text-slate-800">Sede:</strong> {paso.sede}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium text-justify">
                    {paso.desc}
                  </p>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
                  <div className={`w-full rounded-2xl overflow-hidden shadow-lg border border-stone-100 bg-slate-50 relative ${paso.esVertical ? 'aspect-[9/16] max-w-[320px] mx-auto' : 'aspect-video w-full'}`}>
                    <iframe 
                      className="w-full h-full absolute inset-0"
                      src={`https://www.youtube-nocookie.com/embed/${paso.videoId}`} 
                      srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}img{object-fit:cover;height:100%}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black;background:rgba(0,0,0,0.5);border-radius:10px;padding:0 15px}</style><a href=https://www.youtube-nocookie.com/embed/${paso.videoId}?autoplay=1><img src=https://img.youtube.com/vi/${paso.videoId}/hqdefault.jpg alt='Video Testimonio'><span>▶</span></a>`}
                      title={`Testimonio de ${paso.titulo}`} 
                      frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy"
                    ></iframe>
                  </div>
                  <p className="text-sm md:text-base font-semibold text-[#009baf] mt-4 text-center max-w-sm px-2">
                    ¡Conócelos y mira sus enfoques!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SECCIÓN: TURISMO Y EXPERIENCIA EN PERÚ */}
        <section className="py-20 md:py-32 bg-stone-50 border-t border-stone-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="mb-16 md:mb-20 relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Profesionales de diferentes países, una misma vocación.
              </h2>
              <p className="text-slate-500 mt-4 text-base md:text-lg max-w-2xl font-medium mx-auto md:mx-0">
                El Perú también les ha abierto sus puertas a nuestros profesionales para descubrir nuestra gastronomía, recorrer nuestros paisajes, conocer nuestra historia y disfrutar de la riqueza cultural que nos caracteriza.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-20 max-w-5xl mx-auto">
              {destinosTurismo.map((destino, index) => (
                <div 
                  key={destino.id} 
                  className={`group relative flex flex-col transition-all duration-500 ease-out md:hover:z-20 ${index % 2 === 0 ? 'md:-rotate-2' : 'md:rotate-2 md:mt-12'} md:hover:rotate-0 md:hover:-translate-y-3 md:hover:scale-105`}
                >
                  <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden shadow-lg md:hover:shadow-2xl md:hover:shadow-[#009baf]/30 transition-all duration-500 relative bg-stone-200 border-[6px] border-white">
                    <img 
                      src={destino.img} 
                      alt={destino.nombre} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out md:group-hover:scale-110"
                      width="600" height="400" loading="lazy"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Paisaje+Peru" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="mt-6 px-2 text-center sm:text-left w-full transition-transform duration-500 md:group-hover:translate-x-2">
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight flex flex-col sm:flex-row items-center sm:items-start gap-2">
                      {destino.nombre}
                      <span className="hidden sm:block h-[3px] w-0 bg-[#009baf] mt-3 rounded-full transition-all duration-500 md:group-hover:w-12"></span>
                    </h3>
                    
                    <p className="text-sm text-[#009baf] font-semibold mt-2 flex items-center justify-center sm:justify-start gap-1.5 bg-[#009baf]/10 w-fit sm:mx-0 mx-auto px-3 py-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {destino.lugar}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. FORMULARIO DE POSTULACIÓN A WHATSAPP */}
        <section className="py-16 md:py-24 bg-white border-y border-stone-200 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
            
            <div className="absolute top-2 left-3 md:left-8 pointer-events-none opacity-30 md:opacity-40 animate-pulse" aria-hidden="true">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-[#009baf]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" strokeDasharray="1 2" />
                <rect x="9" y="4" width="6" height="2.5" rx="1" fill="currentColor" fillOpacity="0.15" />
                <rect x="8.5" y="8" width="7" height="2.5" rx="1" fill="currentColor" fillOpacity="0.15" />
                <rect x="8" y="12" width="8" height="2.5" rx="1" fill="currentColor" fillOpacity="0.15" />
                <rect x="8.5" y="16" width="7" height="2.5" rx="1" fill="currentColor" fillOpacity="0.15" />
                <rect x="9" y="20" width="6" height="2" rx="1" fill="currentColor" fillOpacity="0.15" />
              </svg>
            </div>

            <div className="max-w-2xl mx-auto bg-stone-50 md:bg-white rounded-3xl md:shadow-sm md:border border-slate-200 p-6 md:p-12 relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight">
                Forma parte de nuestra familia
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombreInput" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nombres completos</label>
                    <input id="nombreInput" type="text" name="nombre" required value={formData.nombre} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none transition-all text-slate-700 bg-white focus:bg-stone-50" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label htmlFor="telefonoInput" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Número de celular</label>
                    <input id="telefonoInput" type="tel" name="telefono" required value={formData.telefono} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none transition-all text-slate-700 bg-white focus:bg-stone-50" placeholder="Ej. 987654321" />
                  </div>
                </div>
                <div>
                  <label htmlFor="correoInput" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Correo electrónico</label>
                  <input id="correoInput" type="email" name="correo" required value={formData.correo} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none transition-all text-slate-700 bg-white focus:bg-stone-50" placeholder="ejemplo@correo.com" />
                </div>
                <hr className="border-stone-200 my-8" />
                <div className="flex justify-center">
                  <button type="submit" className="w-full sm:w-auto bg-[#009baf] text-white font-bold px-10 py-4 rounded-full hover:bg-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 transform hover:-translate-y-0.5">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.76.45 3.48 1.3 5.04L2 22l5.1-1.28c1.5.8 3.2 1.22 4.94 1.22 5.54 0 10.04-4.5 10.04-10.04S17.58 2 12.04 2zm5.46 14.6c-.2.6-.96 1.14-1.6 1.24-.54.1-1.34.18-2.32-.14-.6-.2-1.42-.52-2.58-1.24-2.82-1.74-4.66-4.64-4.8-4.82-.14-.2-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.34.26-.28.56-.34.74-.34.18 0 .36 0 .52.02.18.02.42-.06.64.46.22.52.72 1.76.78 1.88.06.12.1.28.02.46-.08.18-.12.28-.24.42-.12.14-.26.3-.36.4-.12.12-.24.26-.1.5.14.24.62 1.02 1.32 1.64.9.8 1.66 1.04 1.9 1.16.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.6-.14 1.2z"/></svg>
                    <span className="text-[15px] tracking-wide">Trabaja con nosotros</span>
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </section>

        {/* 5. PREGUNTAS FRECUENTES */}
        <section className="py-16 md:py-24 bg-stone-50 px-4 sm:px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-20">
            <div className="w-full md:w-5/12 relative flex justify-center">
              <div className="absolute top-10 -left-6 w-24 h-24 rounded-full bg-teal-100 -z-10"></div>
              <div className="absolute bottom-10 -right-6 w-32 h-32 rounded-full bg-stone-200 -z-10"></div>
              <img 
                src="/images/menu/preguntas-respuestas.avif" 
                alt="Proceso de selección" 
                className="w-full max-w-[340px] sm:max-w-[400px] h-auto object-cover rounded-3xl shadow-md"
                width="400" height="500" loading="lazy"
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=Entrevista" }}
              />
            </div>
            <div className="w-full md:w-7/12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-10">Preguntas <span className="text-[#009baf]">frecuentes</span></h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-stone-200">
                    <button type="button" onClick={() => toggleFaq(index)} className="w-full py-4 sm:py-5 flex items-center justify-between text-left focus:outline-none group" aria-expanded={openFaq === index}>
                      <span className="font-bold text-slate-800 text-sm sm:text-base md:text-lg pr-4 group-hover:text-[#009baf] transition-colors">{faq.pregunta}</span>
                      <svg aria-hidden="true" className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180 text-[#009baf]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[200px] pb-5 opacity-100' : 'max-h-0 opacity-0'}`} aria-hidden={openFaq !== index}>
                      <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">{faq.respuesta}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 sm:mt-12 text-center md:text-left">
                <button type="button" onClick={() => handlePostularClick('Especialista Quiropráctico')} className="bg-[#009baf] text-white font-bold px-8 py-3.5 rounded-full hover:bg-teal-700 transition-colors shadow-md w-full sm:w-auto">
                  Enviar CV por correo
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
};

export default Quiropracticas;