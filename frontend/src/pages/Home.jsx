import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// Algoritmo dinámico de Vite: Lee TODAS las imágenes dentro de la carpeta portada
const imagesGlob = import.meta.glob('../assets/portada/*.{png,jpg,jpeg,webp,avif}', { eager: true, query: '?url', import: 'default' });
const heroImages = Object.values(imagesGlob);

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [sedesData, setSedesData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta si la URL termina en #sedes y desliza automáticamente a esa sección
  useEffect(() => {
    if (location.hash === '#sedes') {
      const timer = setTimeout(() => {
        const element = document.getElementById('sedes');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/sedes`);
        if (response.ok) {
          const data = await response.json();
          setSedesData(data);
        }
      } catch (error) {
        console.error("Error al conectar con el backend de sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  return (
    <div className="bg-stone-50 font-sans min-h-screen flex flex-col">
      <Header setActiveModal={setActiveModal} />
      <main className="flex-grow pt-[90px] lg:pt-[85px]">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[calc(100vh-85px)] flex flex-col lg:flex-row overflow-hidden bg-stone-50" aria-label="Sección Principal">
          
          <div className="w-full relative h-[40vh] sm:h-[50vh] lg:absolute lg:inset-y-0 lg:left-0 lg:w-[60%] lg:h-full z-0">
            {heroImages.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Imagen de portada ${index + 1} - Centro Quiropráctico de Vida`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                className={`absolute inset-0 w-3xl h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} 
              />
            ))}
          </div>
          
          <div className="w-full lg:w-[55%] lg:ml-auto bg-gradient-to-br from-stone-100 to-emerald-50 relative z-10 -mt-6 rounded-t-[2rem] lg:mt-0 lg:rounded-none lg:[clip-path:polygon(10%_0,100%_0,100%_100%,0%_100%)] flex flex-col justify-center items-center shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-emerald-100">
            <div className="px-6 py-14 lg:py-20 lg:pl-[15%] lg:pr-12 w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[2px] bg-teal-600 rounded-full" aria-hidden="true"></div>
                <span className="text-teal-800 text-sm font-semibold tracking-wide uppercase">QuiroPlus</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-stone-900 leading-tight mb-6">
                Más servicios.<br/><span className="text-teal-700">Más soluciones.</span>
              </h1>
              
              <p className="text-stone-700 font-normal mb-8 text-lg leading-relaxed max-w-lg">
                Una empresa que integra diversas áreas con compromiso, profesionalismo y calidad.
              </p>

              <div className="mt-10 p-4 md:p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4 md:gap-5 max-w-lg relative overflow-hidden group animate-[scaleIn_0.8s_ease-out]">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stone-100 shadow-inner relative bg-stone-50">
                  <img 
                    src="/images/menu/frase.jpg" 
                    alt="Anatomía estructural representativa" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div>
                  <p className="text-stone-700 font-medium text-sm md:text-[15px] leading-relaxed">
                    "Conectamos <strong className="text-stone-900 font-semibold">servicios, personas y oportunidades</strong> para construir un mejor futuro."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>     

        {/* SEDES DINÁMICAS */}
        <section id="sedes" className="py-24 px-6 bg-stone-50" aria-label="Nuestras Sedes">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">Nuestras Sedes</h2>
              <p className="text-stone-600 font-normal text-lg">Encuentra atención especializada en nuestras instalaciones a nivel nacional.</p>
            </div>
            
            {sedesData.length === 0 ? (
              <div className="text-center text-stone-500 py-10" role="status" aria-live="polite">Cargando sedes desde el servidor...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sedesData.map((sede) => (
                  <a 
                    key={sede.id} 
                    href={sede.url_maps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`Ver ubicación de la sede ${sede.nombre} en Google Maps`}
                    className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-teal-300 focus:ring-4 focus:ring-teal-500 focus:outline-none transition-all duration-300 ease-out group flex flex-col h-full transform hover:-translate-y-1 block cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors duration-300 text-stone-500">
                      <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-teal-800 transition-colors">{sede.nombre}</h3>
                    <p className="text-stone-600 text-sm mb-6 flex-grow leading-relaxed font-normal">{sede.direccion}</p>
                    <div className="pt-4 border-t border-stone-100">
                      <p className="text-stone-800 text-sm font-semibold">{sede.telefono}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6 bg-slate-900 text-center relative overflow-hidden" aria-label="Contacto y Unirse">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-[20%] -left-[10%] w-96 h-96 bg-emerald-700 rounded-full blur-[100px] opacity-20 animate-blob"></div>
            <div className="absolute top-[20%] -right-[10%] w-96 h-96 bg-teal-700 rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative max-w-3xl mx-auto space-y-8 z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">¿Listo para un cambio?</h2>
            <p className="text-stone-300 font-normal text-lg">Únete a nuestro equipo o contáctanos para brindarte nuestra información.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button 
                onClick={() => navigate('/trabaja-con-nosotros')} 
                aria-label="Ir a la página para trabajar con nosotros"
                className="px-8 py-3 bg-white text-stone-900 font-semibold rounded-lg hover:bg-stone-100 focus:ring-4 focus:ring-teal-500 focus:outline-none transition-all duration-300 relative overflow-hidden"
              >
                Trabaja con nosotros
              </button>
              <button 
                onClick={() => window.open('https://wa.me/TU_NUMERO_AQUI', '_blank')} 
                aria-label="Contactar por WhatsApp para conocernos"
                className="px-8 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-600 focus:ring-4 focus:ring-teal-400 focus:outline-none transition-all duration-300 shadow-md"
              >
                Conócenos
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine { 100% { transform: translateX(100%); } }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default Home;