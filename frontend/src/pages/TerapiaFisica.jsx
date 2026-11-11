import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// ============================================================
// Datos de la Página
// ============================================================

const videosTF = [
  // OPTIMIZACIÓN LCP/Rendimiento: En lugar de la URL, pasamos solo el ID para la fachada (srcDoc)
  { id: 1, titulo: "Descubre nuestro enfoque en Terapia Física", videoId: "-h-nfH10YTY" }
];

const testimoniosTF = [
  {
    id: 1,
    nombre: "Lic. Xiomara Hernandez",
    sede: "Piura, Perú",
    especialidad: "Terapia Física",
    imagen: "/images/menu/especialista4.avif",
    texto: "Desarrollarme aquí me ha permitido crecer inmensamente como profesional. El apoyo del equipo interdisciplinario y las instalaciones de primer nivel hacen que cada día sea un reto emocionante, siempre enfocado en lograr la mejor recuperación para nuestros pacientes."
  },
  {
    id: 2,
    nombre: "Lic. Joao Gutierrez",
    sede: "Sullana, Piura, Perú",
    especialidad: "Terapia Física",
    imagen: "/images/menu/especialista5.avif",
    texto: "Pertenecer a esta organización me brinda la oportunidad de aplicar mis conocimientos con total respaldo. El trabajo en equipo y el enfoque en el bienestar real del paciente hacen que mi labor diaria sea verdaderamente gratificante y me motiva a seguir innovando."
  }
];

// Datos Minimalistas para el Collage de "El Día a Día" adaptados a la nueva info
const galeriaDiaria = [
  {
    id: 1,
    titulo: "Evaluación",
    frase: "El conocimiento nos guía",
    img: "/images/menu/terapia2.avif", 
    rotacion: "md:-rotate-3",
    margen: "md:mt-0"
  },
  {
    id: 2,
    titulo: "Terapia Manual",
    frase: "Nuestras manos nos conectan",
    img: "/images/menu/terapia3.avif", 
    rotacion: "md:rotate-2",
    margen: "md:mt-16"
  },
  {
    id: 3,
    titulo: "Autonomía",
    frase: "Tu participación nos mueve",
    img: "/images/menu/terapia1.avif", 
    rotacion: "md:-rotate-2",
    margen: "md:mt-32"
  }
];

const MovimientoAnimado = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="20" stroke="#009baf" strokeWidth="2" opacity="0.2" />
    <path d="M12 24C12 17.3726 17.3726 12 24 12C30.6274 12 36 17.3726 36 24" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" className="tf-joint-arc" />
    <circle cx="24" cy="24" r="5" fill="#0b5c52" className="tf-joint-pivot" />
  </svg>
);

const TerapiaFisica = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [dudaForm, setDudaForm] = useState({ nombre: '', duda: '' });
  
  // Estados para la Cartilla de Carga (correo)
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);
  const [isCargandoCorreo, setIsCargandoCorreo] = useState(false);

  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // OPTIMIZACIÓN: Limpiar el timeout si el componente se desmonta antes de los 3.5s
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleWppSubmit = (e) => {
    e.preventDefault();
    if (!dudaForm.nombre || !dudaForm.duda) return;
    const numeroWpp = "51982087005";
    const mensaje = `Hola, soy ${dudaForm.nombre}. Quisiera información sobre: ${dudaForm.duda}`;
    const url = `https://wa.me/${numeroWpp}?text=${encodeURIComponent(mensaje)}`;
    // OPTIMIZACIÓN: Agregar noopener, noreferrer para evitar vulnerabilidades de rendimiento/seguridad
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Función que procesa el click en POSTULAR directo al correo
  const handlePostularClick = (tituloPuesto = 'Especialista en Terapia Física') => {
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

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <style>{`
        @keyframes jointPulse { 0%, 100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(25deg) scale(1.05); } }
        @keyframes pivotGlow { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; transform: scale(1.15); } }
        .tf-joint-arc { transform-origin: center; animation: jointPulse 3.5s ease-in-out infinite; }
        .tf-joint-pivot { transform-origin: center; animation: pivotGlow 2s ease-in-out infinite; }
      `}</style>

      <Header setActiveModal={setActiveModal} />

      {/* --- MODAL INFORMATIVO --- */}
      {isCargandoCorreo && vacanteSeleccionada && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center animate-[scaleIn_0.2s_ease-out]">
            <div className="w-14 h-14 border-4 border-stone-200 border-t-[#009baf] rounded-full animate-spin mb-5"></div>
            {/* Accesibilidad: Corregido a h2 */}
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
            <p className="text-xs text-stone-500 font-medium">
              Abriendo tu aplicación de correo en unos segundos...
            </p>
          </div>
        </div>
      )}

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* 1. PORTADA */}
        <section className="relative w-full min-h-[45vh] md:min-h-[50vh] flex flex-col justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 z-0 flex justify-end">
            {/* OPTIMIZACIÓN LCP: fetchpriority high y dimensiones base para evitar cambios de layout */}
            <img 
              src="/images/menu/portada-terapia-fisica.avif" 
              alt="Rehabilitación y Terapia Física" 
              className="w-full md:w-[75%] lg:w-[65%] h-full object-cover object-center"
              width="1200"
              height="800"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white from-[25%] lg:from-[35%] via-white/10 via-[50%] lg:via-[60%] to-transparent hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent md:hidden"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-[100px] md:pt-[120px] pb-12 md:pb-16">
            <div className="w-full md:w-[60%] lg:w-1/2 space-y-6">
              <div className="flex items-center gap-2 text-stone-600 text-sm font-medium mb-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-teal-600 transition-colors">Inicio</button>
                <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                <span className="text-stone-900">Terapia Física</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Ciencia, manos <br className="hidden md:block" /> y humanidad
              </h1>
              <p className="text-stone-900 md:text-stone-800 text-lg leading-relaxed max-w-md font-medium">
                Buscamos profesionales titulados con sólida formación académica, verdadera vocación y sensibilidad para evaluar, movilizar y acompañar a nuestros pacientes en su recuperación.
              </p>
              <div className="pt-4">
                <button 
                  type="button"
                  onClick={() => handlePostularClick()}
                  className="bg-teal-700 text-white font-bold px-8 py-3.5 rounded-lg hover:bg-teal-800 transition-colors shadow-sm relative z-20 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Postular ahora
                  <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FRANJA DE CONTACTO WPP */}
        <section className="bg-stone-50 border-y border-stone-200 relative z-20">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="lg:w-1/3 flex items-center gap-4">
              <div className="bg-white p-3 rounded-full text-teal-700 shadow-sm border border-stone-200 shrink-0">
                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Escríbenos tus dudas</h3>
                <p className="text-sm text-stone-500">Consulta directamente con nuestro equipo de selección.</p>
              </div>
            </div>
            <form onSubmit={handleWppSubmit} className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-3">
              <input 
                type="text" placeholder="Tu nombre" required value={dudaForm.nombre}
                onChange={(e) => setDudaForm({...dudaForm, nombre: e.target.value})}
                className="w-full sm:w-1/3 px-4 py-3 rounded-lg border border-stone-200 focus:border-teal-600 outline-none text-sm transition-all bg-white text-stone-800 shadow-sm"
              />
              <input 
                type="text" placeholder="¿Qué dudas tienes sobre el área de trabajo?..." required value={dudaForm.duda}
                onChange={(e) => setDudaForm({...dudaForm, duda: e.target.value})}
                className="w-full sm:w-2/3 px-4 py-3 rounded-lg border border-stone-200 focus:border-teal-600 outline-none text-sm transition-all bg-white text-stone-800 shadow-sm"
              />
              <button type="submit" className="w-full sm:w-auto bg-green-800 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm whitespace-nowrap">
                Consultar
              </button>
            </form>
          </div>
        </section>

        {/* 3. SECCIÓN ENFOQUE Y TESTIMONIOS */}
        <section className="py-20 md:py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-24">
            
            {/* Parte 1: Nuestro Enfoque */}
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
              <div className="w-full md:w-5/12">
                <div className="flex items-center gap-3 mb-4">
                  <MovimientoAnimado className="w-8 h-8 shrink-0" />
                  <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Nuestro Enfoque</h2>
                </div>
                <p className="text-stone-600 text-lg text-justify leading-relaxed">
                  En QP creemos que la fisioterapia va mucho más allá de utilizar equipos o aplicar técnicas. Nuestras mejores herramientas son nuestros conocimientos, nuestro corazón y nuestras manos. Damos especial importancia a la terapia manual, valorando el contacto profesional para movilizar y trabajar los tejidos. Entendemos que la tecnología puede complementar el trabajo, pero nunca debe reemplazar el criterio profesional, la sensibilidad humana ni la importancia de una evaluación exhaustiva.
                </p>
              </div>
              <div className="w-full md:w-7/12 flex flex-col items-center justify-center">
                <div className="aspect-[9/16] w-full max-w-[280px] sm:max-w-[300px] bg-stone-100 rounded-2xl overflow-hidden shadow-lg border border-stone-100 relative">
                  {/* OPTIMIZACIÓN YOUTUBE FACADE (SRCDOC) */}
                  <iframe 
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube-nocookie.com/embed/${videosTF[0].videoId}`} 
                    srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}img{object-fit:cover;height:100%}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black;background:rgba(0,0,0,0.5);border-radius:10px;padding:0 15px}</style><a href=https://www.youtube-nocookie.com/embed/${videosTF[0].videoId}?autoplay=1><img src=https://img.youtube.com/vi/${videosTF[0].videoId}/hqdefault.jpg alt='Video Enfoque'><span>▶</span></a>`}
                    title={videosTF[0].titulo} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <p className="text-sm font-medium text-stone-400 mt-4 text-center">{videosTF[0].titulo}</p>
              </div>
            </div>

            {/* Parte 2: Testimonios */}
            <div className="space-y-12">
              <div className="text-center md:text-left max-w-2xl">
                <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-4">
                  Conoce a quienes ya dieron el paso
                </h2>
                <p className="text-stone-600 text-lg">
                  Nuestro equipo de profesionales sabe que la recuperación depende del trabajo conjunto. Inspiramos a cada paciente a no ser un espectador, sino a participar activamente a través del ejercicio terapéutico, adaptándonos a sus capacidades para recuperar su funcionalidad.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {testimoniosTF.map((testimonio) => (
                  <div key={testimonio.id} className="flex flex-col items-center md:items-start gap-8">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100 p-6 w-full max-w-[280px] flex flex-col items-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-2 bg-teal-600"></div>
                      <div className="w-32 h-32 rounded-full overflow-hidden mt-2 mb-4 border-4 border-teal-50 shadow-sm bg-stone-100">
                        {/* OPTIMIZACIÓN: width, height y lazy load en foto de perfil */}
                        <img 
                          src={testimonio.imagen} 
                          alt={testimonio.nombre} 
                          className="w-full h-full object-contain" 
                          width="128"
                          height="128"
                          loading="lazy"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Terapeuta" }}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-stone-800 text-center mb-1">{testimonio.nombre}</h3>
                      <div className="w-full h-px bg-stone-200 my-4"></div>
                      <div className="w-full space-y-3 px-2">
                        <div className="flex items-center gap-3 text-sm text-stone-600">
                          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                          <p className="leading-none"><strong className="text-stone-800 font-semibold block mb-1">Sede</strong> {testimonio.sede}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-600">
                          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                          <p className="leading-none"><strong className="text-stone-800 font-semibold block mb-1">Especialidad:</strong> {testimonio.especialidad}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-stone-600 text-lg text-center md:text-justify leading-relaxed italic">
                      "{testimonio.texto}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. NUEVA SECCIÓN: LA EXPERIENCIA (ESTILO COLLAGE FOTOGRÁFICO EDITORIAL) */}
        <section className="py-20 md:py-28 bg-stone-50 overflow-hidden relative border-y border-stone-200">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4">
                Nuestro día a día
              </h2>
              <p className="text-stone-600 text-lg">
                La fisioterapia no termina al salir del consultorio. En nuestro día a día complementamos la atención clínica enseñando a nuestros pacientes a cuidar su postura y movimiento en casa, en el trabajo y durante el deporte, logrando que los avances se mantengan en el tiempo.
              </p>
            </div>

            {/* Contenedor del Collage Dinámico */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-10 md:gap-6 lg:gap-10 pb-8 md:pb-16">
              {galeriaDiaria.map((foto) => (
                <div 
                  key={foto.id} 
                  className={`
                    relative group cursor-pointer transition-all duration-500 ease-out
                    w-full max-w-[320px] sm:max-w-[340px] md:w-1/3
                    ${foto.margen} ${foto.rotacion}
                    md:hover:rotate-0 md:hover:-translate-y-4 md:hover:scale-105 md:hover:z-20 z-0
                  `}
                >
                  {/* Tarjeta tipo foto instantánea */}
                  <div className="bg-white p-4 sm:p-5 pb-8 sm:pb-10 rounded-lg shadow-xl border border-stone-200 md:group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500">
                    <div className="aspect-[4/4] overflow-hidden rounded bg-stone-100 mb-6 relative">
                      {/* OPTIMIZACIÓN: dimensionamiento y carga diferida (lazy load) */}
                      <img 
                        src={foto.img} 
                        alt={foto.titulo} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out md:group-hover:scale-110"
                        width="300"
                        height="300"
                        loading="lazy"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Quiropluss" }}
                      />
                      {/* Efecto de flash/brillo sutil al hacer hover */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                    </div>
                    
                    {/* TIPOGRAFÍA RENOVADA Y EDITORIAL */}
                    <div className="text-center px-2">
                      <h3 className="text-[1.35rem] md:text-2xl font-serif font-black text-[#000000] tracking-tight mb-2">
                        {foto.titulo}
                      </h3>
                      <p className="font-mono text-xs md:text-sm font-bold text-[#12ac4d] uppercase tracking-widest">
                        {foto.frase}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 5. CITA FINAL Y BOTÓN POSTULAR */}
        <section className="py-20 bg-white text-center px-6">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-serif italic text-stone-800 leading-relaxed">
              "Nuestro propósito no es solamente ayudar a recuperar movimiento, sino dar las herramientas para que las personas puedan seguir disfrutando de aquello que hace importante su vida."
            </h2>
            
            <button 
              type="button"
              onClick={() => handlePostularClick()}
              className="mt-10 bg-teal-700 hover:bg-teal-800 text-white font-bold px-10 py-4 rounded-lg shadow-md transition-colors text-lg"
            >
              Postular ahora
            </button>

            <div className="mt-10 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-[1px] bg-teal-400"></div>
              <span className="text-stone-400 text-xs font-bold tracking-[0.2em] uppercase">
                Propósito de Equipo
              </span>
            </div>
          </div>
        </section>

      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
};

export default TerapiaFisica;