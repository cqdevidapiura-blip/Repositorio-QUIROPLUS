import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Staff from './pages/staff';
import Pasantes from './pages/Pasantes'; 
import Internado from './pages/Internado';
import Quiropracticas from './pages/Quiropracticas';
import TerapiaFisica from './pages/TerapiaFisica';
import BolsaTrabajo from './pages/BolsaTrabajo';
import Productos from './pages/Productos';
import Convenios from './pages/Convenios';
import StaffDetail from './pages/StaffDetail';
import Admin from './pages/Admin';

// Lleva el scroll arriba al cambiar de pestaña
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Envoltorio con efecto fade-in
const PageWrapper = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="animate-fade-in">
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      <PageWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/quiropracticas" element={<Quiropracticas />} />
          <Route path="/terapia-fisica" element={<TerapiaFisica />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/:id" element={<StaffDetail />} />
          <Route path="/pasantes" element={<Pasantes />} />
          <Route path="/internado" element={<Internado />} />
          <Route path="/trabaja-con-nosotros" element={<BolsaTrabajo />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/convenios" element={<Convenios />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;