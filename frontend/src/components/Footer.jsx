import React, { useState, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WhatsAppBot from './WhatsAppBot';

// 1. ESTRUCTURACIÓN DE DATOS (Mejora el rendimiento al evitar recrear objetos en cada render)
const LOCATIONS_DATA = [
  {
    id: 'piura',
    name: "Sede Piura",
    googleTitle: "Centro Quiropractico de Vida",
    rating: "5.0",
    reviewCount: 29,
    url: "https://www.google.com/maps/place/Centro+Quiropractico+de+Vida/@-5.1966833,-80.699131,13z/data=!4m10!1m2!2m1!1sCentro+Quiropractico+de+Vida!3m6!1s0x904a1a81deebf07b:0xf715a8aa7a6f1f8!8m2!3d-5.1966833!4d-80.633213!15sChxDZW50cm8gUXVpcm9wcmFjdGljbyBkZSBWaWRhWh4iHGNlbnRybyBxdWlyb3ByYWN0aWNvIGRlIHZpZGGSAQxjaGlyb3ByYWN0b3KaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnBzV2xwV2NHbGhSMmhDWVRGS2RGUllTa0pOVjNoSlZta3hNbU16WXhBQuABAPoBBAgAEDI!16s%2Fg%2F11b76c1vn7",
    address: "Richard Cushing 443, Piura 20001",
    phone: "(073) 323837",
    distribution: [ { star: 5, w: "w-full" }, { star: 4, w: "w-0" }, { star: 3, w: "w-0" }, { star: 2, w: "w-0" }, { star: 1, w: "w-0" } ],
    reviews: [
      { id: 1, name: "Jorge luis Huancas escobar", info: "1 opinión", date: "Hace 5 meses", stars: 5, text: "Fue una experiencia muy positiva en el centro Quiropráctico desde el momento que uno ingresa te hacen sentir cómodo y con una muy buena atención. El personal muy calificado y profesional...", avatarBg: "bg-[#e65100]", initial: "J" },
      { id: 2, name: "Pedro Palomino Cury", info: "1 opinión", date: "Hace 5 meses", stars: 5, text: "Muy recomendado! Muy buena atención, son muy buenos Quiroprácticos y Fisioterapeutas, a mí me ayudó de mucho llevando un tratamiento, grandes personas y profesionales. Excelente servicio!!", avatarBg: "bg-[#1565c0]", initial: "P" },
      { id: 3, name: "Angie Perez", info: "3 opiniones", date: "Hace 5 meses", stars: 5, text: "Excelente atención y profesionalismo. Desde la primera sesión sentí una gran mejoría, el personal es muy amable y se toman el tiempo de explicar cada procedimiento.", avatarBg: "bg-[#2e7d32]", initial: "A" },
      { id: 4, name: "elam abner calle julca", info: "1 opinión", date: "Hace 5 meses", stars: 5, text: "Excelente atención , los especialistas son buenos . La licenciada en quiropráctica muy buena , Y en fisioterapia 10 de 10 muy recomendable , recibí buena atención en recepción , todos muy amables. Lo recomiendo mucho.", avatarBg: "bg-[#6a1b9a]", initial: "E" }
    ]
  },
  {
    id: 'sullana',
    name: "Sede Sullana",
    googleTitle: "Centro Quiropractico de Vida Sullana",
    rating: "4.9",
    reviewCount: 18,
    url: "https://www.google.com/maps/place/Centro+Quiropractico+de+vida/@-4.8953001,-80.6903548,16.53z/data=!4m10!1m2!2m1!1sCentro+Quiropractico+de+Vida+Sullana!3m6!1s0x9035fbec94291e15:0x729d6d675a0cd3bb!8m2!3d-4.8959289!4d-80.688189!15sCiRDZW50cm8gUXVpcm9wcmFjdGljbyBkZSBWaWRhIFN1bGxhbmGSAQxjaGlyb3ByYWN0b3LgAQA!16s%2Fg%2F11hdqbwldj?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
    address: "Av. José de Lama 380, Sullana",
    phone: "(073) 323837",
    distribution: [ { star: 5, w: "w-[90%]" }, { star: 4, w: "w-[10%]" }, { star: 3, w: "w-0" }, { star: 2, w: "w-0" }, { star: 1, w: "w-0" } ],
    reviews: [
      { id: 1, name: "Pamela Ayala More", info: "1 opinión", date: "Hace 4 meses", stars: 5, text: "Muy buena atención, excelentes especialistas. Recomendado", avatarBg: "bg-[#c2185b]", initial: "P" },
      { id: 2, name: "Fabiola Huancas Escobar", info: "1 opinión", date: "Hace 4 meses", stars: 5, text: "Muy buena atención, los especialistas me están ayudando mucho con mi tratamiento.. Lo recomiendo!", avatarBg: "bg-[#0097a7]", initial: "F" },
      { id: 3, name: "María Elena García Ortiz", info: "1 opinión", date: "Hace 4 meses", stars: 5, text: "Muy profesionales en el trabajo a realizar y en cuanto a atencion. Recomendado", avatarBg: "bg-[#388e3c]", initial: "M" }
    ]
  },
  {
    id: 'talara',
    name: "Sede Talara",
    googleTitle: "Centro Quiropratico de Vida",
    rating: "5.0",
    reviewCount: 6,
    url: "https://www.google.com/maps/place/Centro+Quiropratico+de+Vida/@-4.5787724,-81.2844932,14z/data=!4m6!3m5!1s0x90364599d54df4f7:0xda59a3434600581e!8m2!3d-4.574994!4d-81.2752251!16s%2Fg%2F11rndj2np9?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
    address: "Av. Bolognesi 149, Talara 20811",
    phone: "(073) 323837",
    distribution: [ { star: 5, w: "w-full" }, { star: 4, w: "w-0" }, { star: 3, w: "w-0" }, { star: 2, w: "w-0" }, { star: 1, w: "w-0" } ],
    reviews: [
      { id: 1, name: "sandra jhajaira Alberca culquicondor", info: "2 opiniones", date: "Hace 7 meses", stars: 5, text: "Buena atención y excelentes especialistas", avatarBg: "bg-[#f57c00]", initial: "S" },
      { id: 2, name: "dailys figuera", info: "3 opiniones", date: "Hace 7 meses", stars: 5, text: "Excelente servicio y atención los recomiendo. 🤗 Mucha calidad humana y atención profesional…", avatarBg: "bg-[#1976d2]", initial: "D" },
      { id: 3, name: "PER ANDRADE", info: "1 opinión", date: "Hace 7 meses", stars: 5, text: "Muy buenos especialistas y la atención del personal muy buena 👍🏽…", avatarBg: "bg-[#512da8]", initial: "P" },
      { id: 4, name: "Silvia Yackeline Ipanaque Sernaque", info: "1 opinión", date: "Hace 7 meses", stars: 5, text: "Muy buena atención y sobre todo buenos resultados", avatarBg: "bg-[#d32f2f]", initial: "S" }
    ]
  },
  {
    id: 'tacna',
    name: "Sede Tacna",
    googleTitle: "Centro Quiropráctico de Vida",
    rating: "4.7",
    reviewCount: 14,
    url: "https://www.google.com/maps/place/Centro+Quiropr%C3%A1ctico+de+Vida/@-18.0244588,-70.243739,17z/data=!3m1!4b1!4m6!3m5!1s0x915acf70f72bd0a1:0xcde016fddbd634ae!8m2!3d-18.0244639!4d-70.2411641!16s%2Fg%2F11f0kh3hfg?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
    address: "Av. Billinghurst 969, Tacna",
    phone: "(073) 323837",
    distribution: [ { star: 5, w: "w-[85%]" }, { star: 4, w: "w-[5%]" }, { star: 3, w: "w-0" }, { star: 2, w: "w-0" }, { star: 1, w: "w-[10%]" } ],
    reviews: [
      { id: 1, name: "Alvaro Aguilar Alfaro", info: "1 opinión", date: "Hace un mes", stars: 5, text: "Excelente servicio profesional y buena atención desde hace varios años", avatarBg: "bg-[#455a64]", initial: "A" },
      { id: 2, name: "Angel Apaza", info: "10 opiniones · 5 fotos", date: "2 semanas atrás", stars: 5, text: "Es un a buena opción para problema s relacionados a lesiones en la columna, ya que trata no lo síntomas sino la raíz de ellos.", avatarBg: "bg-[#0288d1]", initial: "A" },
      { id: 3, name: "Jorge Manzur", info: "Local Guide · 113 opiniones", date: "Hace 7 años", stars: 1, text: "Consulta y ajuste caros. Costos más elevados que ir a un cardiologo.", avatarBg: "bg-[#c2185b]", initial: "J", 
        ownerResponse: { date: "Hace 7 años", text: "Estimado Jorge. Tenemos el compromiso de llegar quiropráctica a, mas personas. Sugiero pida la promoción del mes a nuestra asistentes. Que tenga un día super saludable." } 
      }
    ]
  },
  {
    id: 'tumbes',
    name: "Sede Tumbes",
    googleTitle: "Centro Quiropráctico de Vida - Sede Tumbes",
    rating: "5.0",
    reviewCount: 15,
    url: "https://www.google.com/maps/place/Centro+Quiropr%C3%A1ctico+de+Vida+-+Sede+Tumbes/@-3.5709759,-80.4490312,13.19z/data=!4m6!3m5!1s0x90338d122c63557f:0xc244927a067bfc0a!8m2!3d-3.555057!4d-80.4291774!16s%2Fg%2F11hzhr7xx0?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
    address: "Psj. Manuel Gonzales Mz. 02 Lt 07 Urb. Andrés Araujo Moran, Tumbes",
    phone: "(073) 323837",
    distribution: [ { star: 5, w: "w-full" }, { star: 4, w: "w-0" }, { star: 3, w: "w-0" }, { star: 2, w: "w-0" }, { star: 1, w: "w-0" } ],
    reviews: [
      { id: 1, name: "fatima yacila", info: "2 opiniones", date: "Hace 4 meses", stars: 5, text: "Excelente servicio , recomendado al 100%☺️", avatarBg: "bg-[#8e24aa]", initial: "F" },
      { id: 2, name: "pedro yacila", info: "1 opinión", date: "Hace 4 meses", stars: 5, text: "Excelente servicio", avatarBg: "bg-[#1976d2]", initial: "P" },
      { id: 3, name: "Noemi Atoche Medina", info: "1 opinión", date: "Hace 4 meses", stars: 5, text: "Gran Atención", avatarBg: "bg-[#00796b]", initial: "N" },
      { id: 4, name: "rodrigo villanueva", info: "Local Guide · 15 opiniones", date: "Hace 6 años", stars: 5, text: "Excelente servicio", avatarBg: "bg-[#fbc02d]", initial: "R" }
    ]
  }
];

const Footer = ({ setActiveModal }) => {
  const [activeTab, setActiveTab] = useState('opiniones');
  const [currentLocIndex, setCurrentLocIndex] = useState(0);
  
  // Referencia para hacer scroll al cambiar de sede (Mejora UX/Accesibilidad)
  const reviewsSectionRef = useRef(null);
  
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // useMemo evita cálculos innecesarios en cada renderizado
  const activeLocation = useMemo(() => LOCATIONS_DATA[currentLocIndex], [currentLocIndex]);

  const handlePageChange = (newIndex) => {
    setCurrentLocIndex(newIndex);
    setActiveTab('opiniones'); // Reiniciar a la pestaña principal
    
    // Desplazamiento suave hacia el título de la sección
    if (reviewsSectionRef.current) {
      const yOffset = -80; // Margen superior para menús fijos (ajústalo si tienes un navbar sticky)
      const element = reviewsSectionRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Función auxiliar para renderizar estrellas exactas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "text-[#fbbc04]" : "text-gray-300"}>★</span>
    ));
  };

  return (
    <>
      {isHomePage && (
        <section ref={reviewsSectionRef} className="bg-[#f8f9fa] py-16 px-4 border-t border-slate-200 font-sans scroll-mt-20">
          
          {/* TÍTULO SEO-FRIENDLY */}
          <header className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Opiniones de Nuestros Clientes
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Conoce la valoración de nuestra <strong>{activeLocation.name}</strong> en Google Maps. 
              Desliza para ver la experiencia en otras ciudades.
            </p>
          </header>

          {/* CONTENEDOR WIDGET */}
          <article className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm text-[#1f1f1f] transition-all duration-300 ease-in-out">
            
            {/* CABECERA DEL WIDGET */}
            <header className="mb-4">
              <h3 className="text-2xl font-normal text-[#1f1f1f]">{activeLocation.googleTitle}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-[#70757a]">
                <span className="font-medium text-[#1f1f1f]">{activeLocation.rating}</span>
                <div className="flex text-lg leading-none mt-[-2px]">{renderStars(Math.round(parseFloat(activeLocation.rating)))}</div>
                <span>({activeLocation.reviewCount})</span>
                <span>·</span>
                <span>Quiropráctico</span>
              </div>
            </header>

            {/* PESTAÑAS (TABS) */}
            <nav className="flex gap-8 border-b border-gray-200 text-sm mb-6 pt-1" aria-label="Pestañas de información de sede">
              {['general', 'opiniones', 'acerca'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-[#0b57d0] font-medium border-b-2 border-[#0b57d0]'
                      : 'text-[#70757a] hover:text-[#1f1f1f]'
                  }`}
                >
                  {tab === 'general' ? 'Descripción general' : tab === 'acerca' ? 'Acerca de' : tab}
                </button>
              ))}
            </nav>

            {/* CONTENIDO TAB 1: DESCRIPCIÓN GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-4 text-sm text-[#3c4043] pt-1 animate-fadeIn">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#00838f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>{activeLocation.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#00838f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span>{activeLocation.phone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#00838f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><line x1="2" y1="12" x2="22" y2="12" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  <a href="https://centroquiropracticodevida.com" target="_blank" rel="noopener noreferrer" className="text-[#1f1f1f] hover:underline">
                    centroquiropracticodevida.com
                  </a>
                </div>
              </div>
            )}

            {/* CONTENIDO TAB 2: OPINIONES */}
            {activeTab === 'opiniones' && (
              <div className="animate-fadeIn">
                {/* Resumen de Estrellas */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6 pb-6 border-b border-gray-100">
                  <div className="sm:col-span-7 space-y-1.5">
                    {activeLocation.distribution.map((item) => (
                      <div key={item.star} className="flex items-center gap-3 text-xs text-[#70757a]">
                        <span className="w-2 font-medium">{item.star}</span>
                        <div className="flex-1 bg-[#f1f3f4] h-2 rounded-full overflow-hidden">
                          <div className={`bg-[#fbbc04] h-full ${item.w}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
                    <span className="text-6xl font-normal text-[#1f1f1f] leading-none">{activeLocation.rating}</span>
                    <div className="flex text-xl my-1.5 leading-none">
                      {renderStars(Math.round(parseFloat(activeLocation.rating)))}
                    </div>
                    <span className="text-xs text-[#70757a]">{activeLocation.reviewCount} opiniones</span>
                  </div>
                </div>

                {/* Botón Escribir Opinión */}
                <div className="flex justify-center mb-6">
                  <a href={activeLocation.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-[#c2e7ff] hover:bg-[#b3e0ff] text-[#001d35] font-medium text-sm px-6 py-2.5 rounded-full transition-all">
                    <svg className="w-4 h-4 text-[#001d35]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                    Escribir una opinión
                  </a>
                </div>

                {/* Lista de Opiniones (Renderizado semántico) */}
                <div className="space-y-6">
                  {activeLocation.reviews.map((rev) => (
                    <article key={rev.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-full ${rev.avatarBg} text-white font-medium flex items-center justify-center shrink-0 text-sm`}>
                          {rev.initial}
                        </div>
                        <div>
                          <h4 className="font-medium text-[#1f1f1f] text-sm leading-tight">{rev.name}</h4>
                          <span className="text-xs text-[#70757a]">{rev.info}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 my-1">
                        <div className="flex text-xs leading-none">
                          {renderStars(rev.stars)}
                        </div>
                        <span className="text-xs text-[#70757a]">{rev.date}</span>
                      </div>

                      <p className="text-[#3c4043] text-sm leading-relaxed mt-2 font-normal">
                        {rev.text}
                      </p>

                      {/* Respuesta del propietario (Si existe) */}
                      {rev.ownerResponse && (
                        <div className="ml-4 mt-3 bg-[#f8f9fa] p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-[#1f1f1f]">Respuesta del propietario</span>
                            <span className="text-xs text-[#70757a]">{rev.ownerResponse.date}</span>
                          </div>
                          <p className="text-sm text-[#3c4043]">{rev.ownerResponse.text}</p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* CONTENIDO TAB 3: ACERCA DE */}
            {activeTab === 'acerca' && (
              <div className="space-y-6 text-sm text-[#3c4043] pt-1 animate-fadeIn">
                <div>
                  <h4 className="font-medium text-[#1f1f1f] text-base mb-3">Accesibilidad</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-[#3c4043]">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#70757a] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="1.5"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4" strokeWidth="1.5"/></svg>
                      <span>Entrada accesible para personas en silla de ruedas</span>
                    </div>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <h4 className="font-medium text-[#1f1f1f] text-base mb-3">Planificación</h4>
                  <div className="flex items-center gap-3 text-xs md:text-sm text-[#3c4043]">
                    <svg className="w-5 h-5 text-[#1f1f1f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Se recomienda concertar cita</span>
                  </div>
                </div>
              </div>
            )}

            {/* BOTÓN CONOCE MÁS / ENLACE DIRECTO A MAPS GENERAL */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex justify-center">
              <a
                href={activeLocation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#0b57d0] hover:underline inline-flex items-center gap-1.5"
              >
                Ver todas las opiniones en Google Maps
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>

          </article>

          {/* CONTROLES DE PAGINACIÓN ENTRE SEDES */}
          <nav aria-label="Paginación de sedes" className="max-w-3xl mx-auto mt-8 flex items-center justify-between bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm">
            <button 
              onClick={() => handlePageChange(currentLocIndex === 0 ? LOCATIONS_DATA.length - 1 : currentLocIndex - 1)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#0b57d0] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              <span className="hidden sm:inline">Sede Anterior</span>
            </button>
            
            <div className="flex gap-2">
              {LOCATIONS_DATA.map((loc, idx) => (
                <button 
                  key={loc.id}
                  onClick={() => handlePageChange(idx)}
                  aria-label={`Ver opiniones de ${loc.name}`}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentLocIndex ? 'bg-[#0b57d0]' : 'bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentLocIndex === LOCATIONS_DATA.length - 1 ? 0 : currentLocIndex + 1)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#0b57d0] transition-colors"
            >
              <span className="hidden sm:inline">Siguiente Sede</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </nav>
        </section>
      )}

      {/* FOOTER GENERAL - Sin modificaciones respecto al tuyo */}
      <footer className="bg-slate-800 text-slate-400 py-16 px-6 text-sm font-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-700 pb-12 mb-8">
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Sobre nosotros</h4>
            <p className="leading-relaxed mb-4">
              Desde su fundación, Quiroplus ha mantenido su liderazgo ofreciendo servicios quiroprácticos para corregir los problemas biomecánicos estructurales especialmente los de la columna vertebral y cómo estos afectan al Sistema Nervioso.
            </p>
            <div className="mt-6 pt-5 border-t border-slate-700">
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[10px]">Nuestros Productos</h4>
              <Link to="/productos" className="group inline-flex items-center gap-2 text-slate-400 hover:text-cyan-500 transition-colors">
                <span>Aliados para tu bienestar en casa</span>
                <svg className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Sedes Principales</h4>
            <div className="space-y-4">
              <div>
                <strong className="text-slate-300 block mb-1">Sede Principal</strong>
                <p>AV. RICHARD CUSHING 443 - PIURA, CENTRO</p>
                <p>Teléfono: 073-323837 / +51 982 087 005</p>
                <p>Email: cqdevidapiura@gmail.com</p>
              </div>
              <div className="pt-2">
                <strong className="text-slate-300 block mb-1">Sede Piura - San Felipe</strong>
                <p>Av. Ramón Mujica D-7 (Frente al hotel Río Verde)</p>
                <p>Teléfono: 073-600167 / +51 936 305 507</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Sedes al interior del país</h4>
            <ul className="space-y-3">
              <li>
                <strong className="text-slate-300">PIURA</strong><br />
                Av. Richard Cushing 443 (Espaldas del Colegio San Miguel)<br />
                Av. Ramón Mujica D-7 (Frente al hotel Río Verde)
              </li>
              <li>
                <strong className="text-slate-300">SULLANA</strong><br />
                Av. José de Lama 380 (Frente al ex terminal Gechisa o antes de llegar a Sunafil)
              </li>
              <li>
                <strong className="text-slate-300">TUMBES</strong><br />
                Psj. Manuel Gonzales Mz. 02 Lt 07 Urb. Andrés Araujo Moran
              </li>
              <li>
                <strong className="text-slate-300">TACNA</strong><br />
                Av. Billinghurst 969 (A una cuadra de la Av. Collpa)
              </li>
              <li>
                <strong className="text-slate-300">TALARA</strong><br />
                Av. Bolognesi 149, Talara 20811
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Mapa de sitio</h4>
            <ul className="space-y-3">
              <li><Link to="/nosotros" className="hover:text-cyan-500 transition-colors">Nosotros</Link></li>              
              <li><Link to="/quiropracticas" className="hover:text-cyan-500 transition-colors">Quiroprácticas</Link></li>
              <li><Link to="/terapia-fisica" className="hover:text-cyan-500 transition-colors">Terapia Física</Link></li>
              <li><Link to="/staff" className="hover:text-cyan-500 transition-colors">Staff</Link></li>
              <li><Link to="/pasantes" className="hover:text-cyan-500 transition-colors">Pasantes</Link></li>
              <li><Link to="/internado" className="hover:text-cyan-500 transition-colors">Internado</Link></li>
              <li><Link to="/trabaja-con-nosotros" className="hover:text-cyan-500 transition-colors">Trabaja con nosotros</Link></li>
              <li><Link to="/convenios" className="hover:text-cyan-500 transition-colors">Convenios</Link></li>
              <li className="pt-2"><Link to="/productos" className="text-slate-300 font-medium hover:text-cyan-500 transition-colors">Complementa tu recuperación</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© 2026 - Todos los derechos reservados. QUIROPLUS S.R.L</p>
        </div>
      </footer>

      <WhatsAppBot setActiveModal={setActiveModal} />
    </>
  );
};

export default Footer;