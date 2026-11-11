import React, { useEffect, useState } from 'react';

const ActionModal = ({ activeModal, closeModal }) => {
  const [isRendered, setIsRendered] = useState(false);
  
  // Control de pasos: 0 = Intro, 1 = Formulario, 2 = Opciones de contacto (Éxito)
  const [step, setStep] = useState(0); 
  const [sedesList, setSedesList] = useState([]);
  
  const [formData, setFormData] = useState({
    nombre: '', telefono: '', correo: '', sede_id: '', fecha: '', hora: ''
  });
  
  // Estados para validación y carga
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeModal) {
      setTimeout(() => setIsRendered(true), 50);
      setStep(0); // Reiniciar al paso 0 al abrir
      setFormError("");
    } else {
      setIsRendered(false);
    }
  }, [activeModal]);

  useEffect(() => {
    if (activeModal === 'agendar') {
      fetch('http://localhost:3000/api/sedes')
        .then(res => res.json())
        .then(data => setSedesList(data))
        .catch(err => console.error("Error cargando sedes:", err));
    }
  }, [activeModal]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(""); // Limpiar error si el usuario empieza a escribir
  };

  const handleClose = () => {
    setFormData({ nombre: '', telefono: '', correo: '', sede_id: '', fecha: '', hora: '' });
    setStep(0);
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validación de datos mejorada
    if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.sede_id || !formData.fecha || !formData.hora) {
      setFormError("Por favor, completa los campos requeridos.");
      return;
    }
    
    if (formData.telefono.length < 6) {
      setFormError("Ingresa un número de teléfono válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:3000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Se guardó en BD, avanzamos al paso 2 (Opciones de Contacto) sin mostrar "alert"
        setStep(2);
      } else {
        setFormError("Ocurrió un problema de servidor. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setFormError("Error de conexión. Verifica tu internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funciones para los botones minimalistas finales
  const handleWhatsApp = () => {
    const sede = sedesList.find(s => s.id === Number(formData.sede_id));
    if (sede && sede.whatsapp) {
      // Limpiamos el número por si en BD tiene espacios o símbolos
      const phoneRaw = sede.whatsapp.replace(/\D/g, ''); 
      const mensaje = `Hola, me gustaría confirmar mi cita para el ${formData.fecha} a las ${formData.hora}. Mi nombre es ${formData.nombre}.`;
      const waUrl = `https://wa.me/${phoneRaw}?text=${encodeURIComponent(mensaje)}`;
      window.open(waUrl, '_blank');
      handleClose();
    } else {
      alert("Esta sede no tiene un número de WhatsApp registrado.");
    }
  };

  const handleCorreo = () => {
    const sede = sedesList.find(s => s.id === Number(formData.sede_id));
    const asunto = `Confirmación de cita - ${formData.nombre}`;
    const cuerpo = `Hola, me gustaría confirmar mi cita pre-agendada en la web.\n\nDatos:\n- Nombre: ${formData.nombre}\n- Teléfono: ${formData.telefono}\n- Sede: ${sede ? sede.nombre : ''}\n- Fecha: ${formData.fecha}\n- Hora: ${formData.hora}\n\nQuedo a la espera de su confirmación.`;
    
    const mailUrl = `mailto:cqdevidapiura@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailUrl;
    handleClose();
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-3 md:p-4 pt-18 md:pt-25 bg-stone-900/60 backdrop-blur-md transition-all duration-500 font-sans overflow-y-auto">
      
      {/* Contenedor principal de la carta flotante */}
      <div className={`bg-white/95 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative transition-all duration-500 ease-out border border-white/50 overflow-hidden ${isRendered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
        
        {/* Botón de cerrar */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 md:top-5 md:right-5 z-50 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-stone-500 hover:bg-rose-50 hover:text-rose-600 hover:rotate-90 transition-all duration-300 shadow-md border border-stone-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Contenedor scrolleable interno */}
        <div className="overflow-y-auto overflow-x-hidden w-full h-full">
          
          {/* MODAL: AGENDAR CITA */}
          {activeModal === 'agendar' && (
            <div className="flex flex-col md:flex-row w-full relative">
              
              {/* Decoración de fondo */}
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-400/20 rounded-full blur-[70px] animate-pulse pointer-events-none"></div>
              
              {/* Columna Izquierda (Se mantiene intacta) */}
              <div className="md:w-1/2 p-5 pt-10 md:p-12 relative z-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-stone-100">
                <div className={`transition-all duration-700 delay-100 ${isRendered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 mb-3 md:mb-6">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                    <span className="text-teal-700 text-[10px] md:text-xs font-bold tracking-widest uppercase">Evaluación Inicial</span>
                  </div>
                  <h2 className="text-2xl md:text-5xl font-bold text-stone-800 leading-[1.1] mb-3 md:mb-6 tracking-tight">
                    Tu bienestar <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">no puede esperar.</span>
                  </h2>
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                    Da el primer paso hacia una vida sin dolor. Selecciona tu sede y reserva un espacio con nuestros especialistas.
                  </p>
                </div>
              </div>
              
              {/* Columna Derecha (Dinámica según el 'step') */}
              <div className="md:w-1/2 p-5 md:p-12 relative z-10 flex flex-col justify-center min-h-[300px] md:min-h-[400px] bg-stone-50/50">
                
                {/* PASO 0: INTRODUCCIÓN */}
                {step === 0 && (
                  <>
                    <div className="space-y-2 md:space-y-4">
                      {[
                        { title: "Selecciona tu sede", desc: "Centros a nivel nacional.", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" },
                        { title: "Elige fecha y hora", desc: "Disponibilidad en tiempo real.", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                        { title: "Confirma tu cita", desc: "Recibe tus indicaciones.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
                      ].map((s, idx) => (
                        <div key={idx} className={`group flex items-center gap-3 md:gap-4 p-2.5 md:p-4 rounded-xl bg-white border border-stone-100 shadow-sm hover:border-teal-200 transition-all ${isRendered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${(idx+2)*100}ms` }}>
                          <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={s.icon} /></svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-800 text-sm group-hover:text-teal-700">{s.title}</h4>
                            <p className="text-xs text-stone-500">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 md:mt-8">
                      <button onClick={() => setStep(1)} className="w-full py-3.5 md:py-4 font-bold text-white bg-[#009baf] rounded-xl hover:bg-teal-700 shadow-lg hover:shadow-teal-900/20 transition-all">
                        Comenzar Registro
                      </button>
                    </div>
                  </>
                )}

                {/* PASO 1: FORMULARIO */}
                {step === 1 && (
                  <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 animate-[scaleIn_0.3s_ease-out]">
                    <div className="flex items-center gap-2 mb-1 md:mb-2 cursor-pointer text-stone-500 hover:text-[#009baf] w-fit transition-colors" onClick={() => setStep(0)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      <span className="text-sm font-semibold">Volver</span>
                    </div>
                    
                    {formError && (
                      <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-xs font-semibold border border-rose-100 animate-pulse">
                        {formError}
                      </div>
                    )}

                    <input type="text" maxLength={50} name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre completo *" className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none text-sm transition-all bg-white" />
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono *" className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none text-sm transition-all bg-white" />
                      <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="Correo (Opcional)" className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none text-sm transition-all bg-white" />
                    </div>
                    
                    <select name="sede_id" value={formData.sede_id} onChange={handleInputChange} className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none text-sm bg-white text-stone-700 transition-all">
                      <option value="">Selecciona tu sede *</option>
                      {sedesList.map(sede => <option key={sede.id} value={sede.id}>{sede.nombre}</option>)}
                    </select>
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none text-sm text-stone-600 bg-white transition-all" />
                      <input type="time" name="hora" value={formData.hora} onChange={handleInputChange} className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-stone-200 focus:border-[#009baf] focus:ring-1 focus:ring-[#009baf] outline-none text-sm text-stone-600 bg-white transition-all" />
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full mt-2 py-3.5 md:py-4 font-bold text-white bg-[#009baf] rounded-xl hover:bg-teal-700 shadow-lg transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Procesando...
                        </>
                      ) : (
                        "Registrar Cita"
                      )}
                    </button>
                  </form>
                )}

                {/* PASO 2: ÉXITO Y OPCIONES DE CONTACTO (Minimalista) */}
                {step === 2 && (
                  <div className="flex flex-col items-center justify-center text-center space-y-5 animate-[scaleIn_0.4s_ease-out]">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-100">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-stone-800 mb-2">¡Datos guardados!</h3>
                      <p className="text-stone-500 text-sm max-w-[280px] mx-auto">
                        Tus datos han sido registrados. Por favor, selecciona un medio para contactarnos y terminar de confirmar tu cita.
                      </p>
                    </div>

                    <div className="w-full pt-4 space-y-3">
                      {/* Botón WhatsApp Minimalista */}
                      <button 
                        onClick={handleWhatsApp}
                        className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-stone-200 bg-white hover:border-[#25D366] hover:shadow-[0_4px_20px_-5px_rgba(37,211,102,0.15)] transition-all duration-300"
                      >
                        <svg className="w-5 h-5 text-stone-400 group-hover:text-[#25D366] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                        <span className="text-stone-700 font-bold text-sm">Continuar por WhatsApp</span>
                      </button>

                      {/* Botón Correo Minimalista */}
                      <button 
                        onClick={handleCorreo}
                        className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-stone-200 bg-white hover:border-[#009baf] hover:shadow-[0_4px_20px_-5px_rgba(0,155,175,0.15)] transition-all duration-300"
                      >
                        <svg className="w-5 h-5 text-stone-400 group-hover:text-[#009baf] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-stone-700 font-bold text-sm">Enviar detalles por Correo</span>
                      </button>
                    </div>

                  </div>
                )}
                
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default ActionModal;