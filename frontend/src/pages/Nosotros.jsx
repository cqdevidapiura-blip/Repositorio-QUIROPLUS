import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

const Nosotros = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeTab, setActiveTab] = useState('mision');
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

  // Llamada al backend para obtener el video (INTACTA)
  useEffect(() => {
    const fetchConfiguracion = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/nosotros/configuracion');
        if (response.ok) {
          const data = await response.json();
          setVideoUrl(data.video_url);
        }
      } catch (error) {
        console.error("Error al obtener datos de nosotros:", error);
        // Fallback de prueba en caso de que el backend no esté encendido
        setVideoUrl('https://www.youtube.com/embed/wUa5OBI9vFA');
      }
    };
    fetchConfiguracion();
  }, []);

  // OPTIMIZACIÓN: Función segura para extraer el ID de YouTube de la URL del backend
  // Si no es un enlace de YouTube, devolverá null y usaremos el iframe clásico.
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(videoUrl);

  return (
    <div className="bg-stone-50 font-sans min-h-screen flex flex-col">
      <Header setActiveModal={setActiveModal} />
      
      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* SECCIÓN 1: QUIÉNES SOMOS Y VIDEO */}
        <section className="py-16 md:py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            
            <div className="w-full md:w-5/12">
              
              {/* Ruta de navegación (Breadcrumb) */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
                <button
                  onClick={() => navigate('/')}
                  className="text-slate-500 hover:text-[#009baf] transition-colors cursor-pointer"
                >
                  Inicio
                </button>

                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>

                <span className="text-slate-800">
                  Nosotros
                </span>
              </div>

              <h1 className="text-[2.5rem] md:text-[3.5rem] font-semibold text-stone-900 tracking-[-0.045em] leading-[1.08] mb-6">
                Nacimos con una idea: llevar bienestar a más personas
              </h1>
              <p className="text-stone-600 text-justify leading-relaxed mb-8">
                Somos una empresa peruana que cree que cuidar la salud debe estar al alcance de todos. Nacimos de una iniciativa emprendedora y del convencimiento de que la quiropráctica y la terapia física pueden transformar la manera en que las personas cuidan su cuerpo y su calidad de vida.

                Desde 2013  hemos construido una historia de trabajo, aprendizaje y crecimiento. Hoy llegamos a diferentes ciudades del Perú, acercando servicios especializados en el cuidado de la columna y el movimiento, con profesionales capacitados, atención cercana y estándares de calidad que nos distinguen.

                Pero nuestro propósito va más allá de una técnica o un tratamiento: queremos que cada persona se sienta escuchada, comprendida y bien atendida. Porque detrás de cada columna hay una historia, una familia, un trabajo y muchas cosas que merecen seguir disfrutándose.

                <p className="text-black text-justify text- leading-relaxed tracking-tight mb-5">Somos QP:  Una empresa peruana con historia, vocación de servicio y una misma convicción: poner tu columna en las mejores manos.</p>
              </p>
              
              <button 
                onClick={() => navigate('/#sedes')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm cursor-pointer">
                Conoce Nuestras Sedes
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Contenedor del Video Dinámico */}
            <div className="w-full md:w-7/12">
              <div className="aspect-video w-full bg-stone-100 rounded-2xl overflow-hidden shadow-lg border border-stone-200 relative">
                {videoUrl ? (
                  youtubeId ? (
                    // 1. OPTIMIZACIÓN FACADE: Se ejecuta si el backend envía un link de YouTube válido
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                      srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}img{object-fit:cover;height:100%}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black;background:rgba(0,0,0,0.5);border-radius:10px;padding:0 15px}</style><a href=https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1><img src=https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg alt='Video Corporativo'><span>▶</span></a>`}
                      title="Video Corporativo" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  ) : (
                    // 2. FALLBACK SEGURO: Si el backend envía otra cosa (ej: Vimeo), usa el iframe clásico
                    <iframe 
                      src={videoUrl} 
                      title="Video Corporativo" 
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-stone-400">
                    Cargando presentación...
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* SECCIÓN 2: PESTAÑAS MISIÓN Y VISIÓN */}
        <section className="py-16 md:py-24 px-6 bg-stone-50 border-t border-stone-200">
          <div className="max-w-5xl mx-auto">
            
            {/* Controles de Pestañas (Tabs) */}
            <div className="flex justify-center border-b border-stone-300 mb-10">
              <button
                onClick={() => setActiveTab('mision')}
                className={`px-8 py-4 font-semibold text-lg transition-all duration-300 border-b-2 ${activeTab === 'mision' ? 'border-teal-600 text-teal-800' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
              >
                Misión
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`px-8 py-4 font-semibold text-lg transition-all duration-300 border-b-2 ${activeTab === 'vision' ? 'border-teal-600 text-teal-800' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
              >
                Visión
              </button>
            </div>

            {/* Contenido Dinámico de las Pestañas */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              
              {activeTab === 'mision' && (
                <div className="flex flex-col md:flex-row animate-[scaleIn_0.4s_ease-out]">
                  <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto">
                    {/* OPTIMIZACIÓN: width, height y lazy loading */}
                    <img 
                      src="/images/menu/mision.jpg" 
                      alt="Nuestra Misión" 
                      className="w-full h-full object-cover" 
                      width="600"
                      height="450"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-stone-900 mb-4">Nuestra Misión</h3>
                    <p className="text-stone-600 text-lg text-justify leading-relaxed">
                      Hacer que <strong>el cuidado de la columna y el movimiento llegue a más personas. </strong> Trabajamos para ofrecer una atención profesional, accesible y humana, donde la experiencia, el conocimiento y el respeto por cada persona sean nuestra mayor fortaleza.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'vision' && (
                <div className="flex flex-col md:flex-row animate-[scaleIn_0.4s_ease-out]">
                  <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto">
                    {/* OPTIMIZACIÓN: width, height y lazy loading */}
                    <img 
                      src="/images/menu/vision.avif" 
                      alt="Nuestra Visión" 
                      className="w-full h-full object-cover" 
                      width="600"
                      height="450"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-stone-900 mb-4">Nuestra Visión</h3>
                    <p className="text-stone-600 text-lg text-justify leading-relaxed mb-4">
                      Llevar el bienestar más lejos. Convertirnos en una empresa peruana referente en el cuidado de la columna y la terapia física, reconocida por su trayectoria, su calidad de atención y su capacidad de crecer sin perder sus principios ni su esencia.                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* SECCIÓN 3: NUESTROS VALORES */}
        <section className="py-16 md:py-24 px-6 bg-white border-t border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
                Nuestros <span className="text-teal-600">valores</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Valor 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 text-teal-500 mb-6">
                  {/* OPTIMIZACIÓN: aria-hidden a SVGs decorativos */}
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4m-2-2h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">TRABAJO</h3>
                <p className="text-stone-500 leading-relaxed text-justify">
                  <p className="text-sm font-bold tracking-[0.18em] text-teal-700 uppercase">
                    AMA QUELLA
                  </p>

                    Hacemos las cosas bien, con esfuerzo y dedicación.

                    Valoramos el trabajo honesto, la iniciativa, la responsabilidad y el compromiso de dar siempre lo mejor de nosotros.


                </p>
              </div>

              {/* Valor 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 text-teal-500 mb-6">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5v-2m3 2v-2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">HONESTIDAD</h3>
                <p className="text-stone-500 leading-relaxed text-justify">
                  <p className="text-sm font-bold tracking-[0.18em] text-teal-700 uppercase">
                    AMA SUA
                  </p>
                    Respetamos a las personas y hacemos lo correcto.

                    Cuidamos los recursos de la empresa, respetamos el trabajo de nuestros compañeros y actuamos con integridad, incluso cuando nadie nos observa.
                </p>
              </div>

              {/* Valor 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 text-teal-500 mb-6">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm3.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">VERDAD</h3>
                <p className="text-stone-500 leading-relaxed text-justify">
                  <p className="text-sm font-bold tracking-[0.18em] text-teal-700 uppercase">
                    AMA LLULLA
                  </p>
                    Hablamos con la verdad y cumplimos nuestra palabra.

                    Somos transparentes con nuestros pacientes, compañeros y proveedores. No prometemos lo que no podemos cumplir y construimos confianza con nuestras acciones.
                </p>
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

export default Nosotros;