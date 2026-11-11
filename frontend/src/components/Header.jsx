import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ setActiveModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-40">
      {/* BARRA SUPERIOR DE INFORMACIÓN */}
      <div className="w-full h-8 bg-sky-900 text-stone-100 text-xs px-6 flex justify-between items-center">
        <div className="hidden sm:block font-medium tracking-wide">
          Quiro Plus - Servicios integrados 
        </div>
        <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span>Lunes a Sábado de 9:00 a 19:00 hrs.</span>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="w-full bg-white/95 backdrop-blur-md shadow-sm py-3 relative border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO QP */}
          <Link 
            to="/" 
            aria-label="Ir a la página de inicio de QuiroPlus" 
            className="flex items-center gap-3 cursor-pointer group text-decoration-none focus:outline-none focus:ring-4 focus:ring-teal-500 rounded-lg"
          >
            <div className="w-14 h-10 flex items-center justify-center font-bold text-lg bg-teal-800 text-white shadow-sm rounded-lg group-hover:bg-teal-900 group-hover:rotate-[360deg] transition-all duration-700 ease-in-out">
              QP
            </div>
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-700">
            <Link to="/nosotros" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Nosotros</Link>
            <Link to="/quiropracticas" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Quiroprácticas</Link>
            <Link to="/terapia-fisica" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Terapia física</Link>
            <Link to="/staff" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Staff</Link>
            <Link to="/pasantes" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Pasantes</Link>
            <Link to="/internado" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Internado</Link>
            <Link to="/trabaja-con-nosotros" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Trabaja con Nosotros</Link>
            <Link to="/convenios" className="hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">Convenios</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveModal('agendar')}
              aria-label="Agendar una cita en QuiroPlus"
              className="hidden md:block px-6 py-2.5 text-sm font-semibold rounded-full bg-slate-800 text-white hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all duration-300"
            >
              Agendar cita
            </button>
            
            {/* BOTÓN MÓVIL */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden p-2 text-stone-800 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        <div 
          id="mobile-menu"
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-y-auto bg-white ${isMobileMenuOpen ? 'max-h-[500px] border-t border-stone-100 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="flex flex-col px-6 py-5 space-y-4 text-sm font-semibold text-stone-700">
            <Link to="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Nosotros</Link>
            <Link to="/quiropracticas" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Quiroprácticas</Link>
            <Link to="/terapia-fisica" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Terapia física</Link>
            <Link to="/staff" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Staff</Link>
            <Link to="/pasantes" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Pasantes</Link>
            <Link to="/internado" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Internado</Link>
            <Link to="/trabaja-con-nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Trabaja con Nosotros</Link>
            <Link to="/convenios" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-teal-800 focus:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded py-1">Convenios</Link>
            
            <button 
              onClick={() => { setActiveModal('agendar'); setIsMobileMenuOpen(false); }}
              aria-label="Agendar cita desde el menú móvil"
              className="w-full mt-4 px-6 py-3.5 text-sm font-semibold rounded-lg bg-teal-800 text-white hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all duration-300"
            >
              Agendar cita
            </button>
          </div>
        </div>
        
        {/* Agregado aria-hidden="true" para que el lector de pantalla ignore este borde decorativo */}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-teal-700 opacity-90" aria-hidden="true" />
      </nav>
    </header>
  );
};

export default Header;