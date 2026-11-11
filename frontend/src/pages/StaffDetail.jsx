import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ActionModal from '../components/ActionModal'; 

const SEDES_DISPONIBLES = [
  { id: 'piura_felipe', nombre: 'Sede Piura - San Felipe', direccion: 'Av. Ramón Mujica D-7', wsp: '51999999991' },
  { id: 'sullana', nombre: 'Sede Sullana', direccion: 'Av. José de Lama 380', wsp: '51999999992' },
  { id: 'talara', nombre: 'Sede Talara', direccion: 'Av. Bolognesi 149', wsp: '51923516358' }, 
  { id: 'tacna', nombre: 'Sede Tacna', direccion: 'Av. Billinghurst 969', wsp: '51999999994' },
  { id: 'tumbes', nombre: 'Sede Tumbes', direccion: 'Psj. Manuel Gonzales Mz. 02 Lt 07', wsp: '51999999995' },
  { id: 'piura_centro', nombre: 'Sede Piura - Centro', direccion: 'Av. Richard Cushing 443', wsp: '51999999996' },
];

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  
  const [profesional, setProfesional] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    sedeId: ''
  });
  
  // Estado para el checkbox de políticas
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  const obtenerSilueta = (categoria, sexo) => {
    const sexoNormalizado = sexo ? sexo.toUpperCase() : '';
    const categoriaNormalizada = categoria ? categoria.toLowerCase() : '';
    if (sexoNormalizado === 'M') return `/images/menu/silueta-${categoriaNormalizada}-hombre.png`;
    if (sexoNormalizado === 'F') return `/images/menu/silueta-${categoriaNormalizada}-mujer.png`;
    return "/images/menu/silueta-general.png";
  };

  useEffect(() => {
    const fetchProfesional = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://repositorio-quiroplus-production.up.railway.app';
        const response = await fetch(`${baseUrl}/api/staff/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener los datos');
        setProfesional(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error('Error fetching staff detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfesional();
  }, [id]);

  const handleAgendarWhatsApp = (e) => {
    e.preventDefault();
    if (!aceptaPoliticas) return;
    
    const sedeSeleccionada = SEDES_DISPONIBLES.find(s => s.id === formData.sedeId);
    if (!sedeSeleccionada) {
      alert("Por favor, selecciona una sede válida.");
      return;
    }

    const mensaje = `Hola, mi nombre es ${formData.nombre} (Cel: ${formData.celular}). Me gustaría agendar una cita con el ${profesional.cargo}, ${profesional.nombre}, en la ${sedeSeleccionada.nombre}.`;
    const whatsappUrl = `https://wa.me/${sedeSeleccionada.wsp}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009baf]"></div>
      </div>
    );
  }

  if (!profesional) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#0f172a]">Profesional no encontrado</h2>
        <button onClick={() => navigate('/staff')} className="mt-4 text-[#009baf] hover:underline font-medium">
          Volver a nuestro Staff
        </button>
      </div>
    );
  }

  // Comprobación si la persona pertenece a la categoría especialistas
  const esEspecialista = profesional.categoria?.toLowerCase() === 'especialistas';

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col">
      <Header setActiveModal={setActiveModal} />

      <main className="flex-grow pt-[85px] lg:pt-[100px]">
        {/* BREADCRUMB */}
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-[#009baf] transition-colors">Inicio</button>
          <span className="mx-2">{'>'}</span>
          <button onClick={() => navigate('/staff')} className="hover:text-[#009baf] transition-colors">Staff </button>
          <span className="mx-2">{'>'}</span>
          <span className="text-[#0f172a] font-medium">{profesional.nombre}</span>
        </div>

        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-6 pb-12 pt-4">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center md:items-start">
            
            {/* FOTO REDONDA */}
            <div className="w-56 h-56 md:w-72 md:h-72 shrink-0 rounded-full bg-stone-100 overflow-hidden">
              <img 
                src={profesional.imagen_url || obtenerSilueta(profesional.categoria, profesional.sexo)} 
                alt={profesional.nombre}
                className="w-full h-full object-cover object-top"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = obtenerSilueta(profesional.categoria, profesional.sexo); 
                }}
              />
            </div>

            {/* INFO BÁSICA */}
            <div className="flex-grow text-center md:text-left w-full pt-4">
              <h1 className="text-3xl md:text-[40px] font-bold text-[#0f172a] tracking-tight leading-tight mb-6">
                {profesional.nombre}
              </h1>
              
              <div className="space-y-3 text-[17px]">
                <p className="text-slate-600">
                  <span className="font-medium">Cargo/Especialidad:</span> {profesional.cargo}
                </p>
                {esEspecialista && (
                  <p className="text-slate-600">
                    <span className="font-medium">Sedes:</span> Ubicación coordinada al momento de agendar
                  </p>
                )}
              </div>

              {/* Botón condicional solo para especialistas */}
              {esEspecialista && (
                <>
                  <hr className="my-8 border-stone-300" />
                  <div>
                    <button 
                      onClick={() => document.getElementById('formulario-cita')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-[#009baf] text-white font-bold px-8 py-3.5 rounded-full hover:bg-teal-700 transition-all duration-300 w-full md:w-auto"
                    >
                      Agenda una cita
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* SECCIÓN DE DATOS */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="bg-[#f8fbff] rounded-2xl p-7 border border-teal-50 h-full">
                <h3 className="text-lg font-bold text-[#0f172a] mb-5">Datos Generales</h3>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-2">Procedencia</p>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#009baf] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-slate-800 font-medium">{profesional.estudios || "No especificada"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3">
               <div className="bg-white rounded-2xl p-7 border border-stone-100 h-full shadow-sm">
                  <h3 className="text-xl font-bold text-[#0f172a] mb-5">Sobre el profesional</h3>
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-[#009baf] shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {profesional.biografia || "Comprometido con brindar una atención profesional y orientada al bienestar integral."}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* FORMULARIO SOLO PARA ESPECIALISTAS */}
        {esEspecialista && (
          <section id="formulario-cita" className="bg-white py-16 border-t border-stone-100">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-[#0f172a] mb-2">
                Agenda una cita con este especialista
              </h2>
              <p className="text-slate-600 mb-12">
                Déjanos tus datos, selecciona tu sede preferida y te conectaremos para agendar tu cita.
              </p>

              <form onSubmit={handleAgendarWhatsApp} className="text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Nombre */}
                  <div>
                    <label className="block text-[15px] text-slate-500 mb-2">Nombre completo*</label>
                    <input 
                      type="text" 
                      maxLength={50}
                      required
                      placeholder="Ingresa tu nombre completo" 
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-[#009baf] outline-none text-slate-700 placeholder:text-stone-400"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>

                  {/* Celular */}
                  <div>
                    <label className="block text-[15px] text-slate-500 mb-2">Celular*</label>
                    <input
                      type="tel"
                      required
                      maxLength={12}
                      placeholder="Ingresa tu número de celular"
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-[#009baf] outline-none text-slate-700 placeholder:text-stone-400"
                      value={formData.celular}
                      onChange={(e) => {
                        const valor = e.target.value;
                        // Reemplaza cualquier carácter que no sea un número del 0 al 9
                        const soloNumeros = valor.replace(/\D/g, ""); 
                        setFormData({ ...formData, celular: soloNumeros });
                      }}
                    />
                  </div>


                  {/* Sede */}
                  <div className="md:col-span-2">
                    <label className="block text-[15px] text-slate-500 mb-2">Sede de preferencia*</label>
                    <div className="relative">
                      <select 
                        required
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-[#009baf] outline-none appearance-none bg-white text-slate-700"
                        value={formData.sedeId}
                        onChange={(e) => setFormData({...formData, sedeId: e.target.value})}
                      >
                        <option value="" disabled>Selecciona una sede</option>
                        {SEDES_DISPONIBLES.map(sede => (
                          <option key={sede.id} value={sede.id}>
                            {sede.nombre}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkboxes de Políticas */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required 
                      checked={aceptaPoliticas}
                      onChange={(e) => setAceptaPoliticas(e.target.checked)}
                      className="w-4 h-4 rounded border-stone-900 text-[#009baf] focus:ring-[#009baf]" 
                    />
                    <span>
                      Acepto que <span className="text-blue-500">mis datos sean utilizados para contactarme sobre mi solicitud</span> *
                    </span>
                  </label>
                </div>

                {/* Botón Submit */}
                <div className="mt-8 flex justify-center">
                  <button 
                    type="submit" 
                    disabled={!aceptaPoliticas}
                    className={`px-12 py-3.5 rounded-full font-bold text-[15px] transition-all duration-300 ${
                      aceptaPoliticas 
                        ? 'bg-[#009baf] text-white hover:bg-teal-700 shadow-md' 
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Agendar cita
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
};

export default StaffDetail;