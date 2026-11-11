import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// Datos de testimonios
const TESTIMONIOS_INTERNADO = [
  {
    id: 1,
    nombre: 'internado 1',
    rol: 'Ex-Interno del programa',
    cita: 'Desde el primer día me hicieron sentir parte del equipo. No solo aprendí técnicas clínicas avanzadas y herramientas fundamentales para mi carrera, sino también el inmenso valor del trato humano y cercano con cada paciente. La experiencia clínica real me dio una visión integral de la profesión, brindándome la confianza necesaria para dar mis primeros pasos profesionales.',
    imagen: '/images/menu/silueta-directiva-hombre.png' 
  },
  {
    id: 2,
    nombre: 'Miriam',
    rol: 'Ex-Interna del programa',
    cita: 'En Quiro Plus encontré verdaderos mentores dispuestos a compartir sus conocimientos sin reservas. El ambiente laboral y el nivel de exigencia me permitieron enfrentarme a desafíos del día a día, desarrollando mi propio criterio clínico. Fue, sin lugar a dudas, la mejor preparación que pude haber tenido antes de salir al mundo laboral.',
    imagen: '/images/menu/silueta-directiva-mujer.png' 
  }
];

const Internado = () => {
  const [activeModal, setActiveModal] = useState(null);

  // Mensaje predeterminado para WhatsApp
  const whatsappNumber = "51982087005";
  const whatsappMessage = encodeURIComponent("Hola, quisiera saber más sobre el programa de internado.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-stone-50 font-sans min-h-screen flex flex-col selection:bg-[#009baf] selection:text-white">
      <Header setActiveModal={setActiveModal} />

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        
        {/* 1. PORTADA */}
        <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
          <img 
            src="/images/menu/internado-hero.jpg" 
            alt="Equipo médico de Quiro Plus" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/60"></div>
          
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center mt-8">
            <div className="text-white/90 text-sm md:text-base font-medium tracking-wide mb-6 drop-shadow-md">
              <a href="/" className="hover:underline hover:text-white transition-colors">Inicio</a>
              <span className="mx-2">/</span>
              <span className="text-white">Internado</span>
            </div>

            <span className="text-white font-semibold tracking-widest uppercase text-sm mb-4">
              Programa de Formación
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight mb-6">
              Aprende, practica y <br className="hidden md:block" /><span className="font-bold">desarrolla tu criterio</span>
            </h1>
            <p className="text-white text-lg md:text-xl font-light max-w-xl leading-relaxed">
              Formación que transforma profesionales. Valores que transforman personas.
            </p>
          </div>
        </section>

        {/* 2. PROPÓSITO & DESARROLLO (Simplificado y Minimalista) */}
        <section className="py-20 md:py-24 px-6 bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-square rounded-[2rem] overflow-hidden shadow-sm border-8 border-stone-50">
                <img 
                  src="/images/menu/internado-proposito.avif" 
                  alt="Propósito del internado" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-stone-900 tracking-tight">
                Más que aulas, situaciones reales
              </h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed font-light">
                <p>
                  Creemos que un buen fisioterapeuta se construye a través del conocimiento, la práctica, la experiencia y los valores. Nuestro programa complementa la preparación académica llevándote a la acción.
                </p>
                <p>
                  Desarrollarás habilidades clínicas fundamentales: desde la aplicación de terapia manual y la prescripción de ejercicio terapéutico, hasta la evaluación funcional precisa y la educación empática de cada paciente, siempre bajo un marco de supervisión profesional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 VALORES Y FILOSOFÍA (Ajustado a paleta clara) */}
        <section className="py-20 px-6 bg-stone-50 border-b border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-stone-900 tracking-tight mb-4">
                No queremos formar solo buenos fisioterapeutas. <br className="hidden md:block"/> Queremos formar personas.
              </h2>
              <p className="text-stone-600 font-light text-lg">
                El conocimiento sin ética pierde su verdadero sentido. Detrás de cada paciente hay una persona que merece respeto. Nuestra formación se inspira en tres principios que representan nuestra identidad:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                <span className="text-[#009baf] font-bold tracking-widest text-sm mb-3">AMA QUELLA</span>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Trabajo</h3>
                <p className="text-stone-500 font-light leading-relaxed">
                  Compromiso, disciplina y dedicación absoluta en cada actividad que realizamos.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                <span className="text-[#009baf] font-bold tracking-widest text-sm mb-3">AMA SUA</span>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Honestidad</h3>
                <p className="text-stone-500 font-light leading-relaxed">
                  Respeto profundo por las personas, los recursos y nuestra profesión.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                <span className="text-[#009baf] font-bold tracking-widest text-sm mb-3">AMA LLULLA</span>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Verdad</h3>
                <p className="text-stone-500 font-light leading-relaxed">
                  Transparencia, responsabilidad y coherencia total entre lo que decimos y hacemos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIOS */}
        <section className="py-20 md:py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
                Testimonios
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {TESTIMONIOS_INTERNADO.map((testimonio) => (
                <article 
                  key={testimonio.id} 
                  className="bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonio.imagen} 
                      alt={testimonio.nombre} 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-stone-200 bg-white" 
                    />
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-stone-900">
                        {testimonio.nombre}
                      </h3>
                      <p className="text-sm md:text-base text-stone-500 mt-1">
                        {testimonio.rol}
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-light text-base md:text-lg">
                    "{testimonio.cita}"
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CALL TO ACTION */}
        <section className="py-20 md:py-28 px-6 bg-stone-50 text-center border-t border-stone-200">
          <div className="max-w-2xl mx-auto space-y-8 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-stone-900 tracking-tight">
              ¿Estás listo para el reto?
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-stone-600 font-light leading-relaxed">
                Si quieres llevar tus conocimientos a la práctica y desafiarte a crecer profesional y personalmente, este programa es para ti.
              </p>
              <p className="text-sm text-stone-500 font-medium bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                Al finalizar el programa, dependiendo de las vacantes y tu desempeño, podrías tener la oportunidad de incorporarte a nuestro equipo oficial.
              </p>
            </div>
            
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#009baf] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-teal-700 hover:shadow-md transition-all duration-300 w-full md:w-auto"
            >
              Sé parte de Quiro Plus
            </a>
            
            <p className="text-sm text-stone-400 font-light pt-2">
              Valoramos a quienes demuestran iniciativa y vocación de servicio.
            </p>
          </div>
        </section>

      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
};

export default Internado;