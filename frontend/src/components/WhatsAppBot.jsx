import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Mensajes iniciales sin emojis en la interfaz
const getInitialMessages = () => [
  {
    id: 1,
    sender: 'bot',
    text: 'Hola, soy el asistente virtual del Centro Quiropráctico de Vida.'
  },
  {
    id: 2,
    sender: 'bot',
    text: '¿Cómo te puedo ayudar hoy?',
    options: [
      {
        id: 'opt1',
        label: 'Agendar una evaluación',
        action: 'agendar',
        route: null,
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      },
      {
        id: 'opt2',
        label: 'Oportunidades de pasantía',
        action: 'navigate',
        route: '/pasantes',
        icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
      },
      {
        id: 'opt3',
        label: 'Bolsa de trabajo',
        action: 'navigate',
        route: '/trabaja-con-nosotros',
        icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      },
      {
        id: 'opt4',
        label: 'Hablar con un asesor',
        action: 'show_asesor_options',
        route: null,
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      }
    ]
  }
];

const WhatsAppBot = ({ setActiveModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(getInitialMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [sedes, setSedes] = useState([]); // Estado para guardar las sedes desde la BD

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // 1. Cargar las sedes desde la API de tu backend al montar el componente
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://repositorio-quiroplus-production.up.railway.app';
        const response = await fetch(`${baseUrl}/api/sedes`);
        if (response.ok) {
          const data = await response.json();
          setSedes(data);
        }
      } catch (error) {
        console.error('Error al obtener sedes para el chat:', error);
      }
    };

    fetchSedes();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setMessages(getInitialMessages());
        setIsTyping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    setMessages((prev) => 
      prev.map((msg, index) => 
        index === prev.length - 1 ? { ...msg, options: undefined } : msg
      )
    );

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: option.label }
    ]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      let responseText = '';
      let nextOptions = null;
      let finalAction = null;
      let whatsappMessage = '';
      let targetPhone = '';

      if (option.action === 'agendar') {
        responseText = 'Excelente. Abriendo el sistema de reservas para ti...';
        finalAction = 'agendar';
      } 
      else if (option.route === '/pasantes') {
        responseText = 'Perfecto. Redirigiendo a la información de pasantes...';
        finalAction = 'navigate';
      } 
      else if (option.route === '/trabaja-con-nosotros') {
        responseText = '¡De acuerdo! Veamos las vacantes disponibles...';
        finalAction = 'navigate';
      } 
      else if (option.action === 'show_asesor_options') {
        responseText = 'Por favor, indícanos cuál es tu sede más cercana:';
        
        // Generar dinámicamente las opciones con las sedes traídas de la BD
        if (sedes.length > 0) {
          nextOptions = sedes.map((sede) => {
            const nombreSede = sede.nombre || sede.nombre_sede || `Sede ${sede.id}`;
            return {
              id: `sede_${sede.id}`,
              label: nombreSede,
              action: 'whatsapp_redirect',
              phone: sede.whatsapp, // Usa el número guardado en la columna whatsapp
              wppText: `Hola, me gustaría hablar con un asesor de la sede ${nombreSede}. \uD83D\uDC4B`,
              icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' // Ícono de ubicación
            };
          });
        } else {
          // Mensaje de contingencia por si la API aún no ha cargado o falla
          responseText = 'En este momento no pudimos cargar las sedes. Te conectaremos con nuestro número principal.';
          nextOptions = [
            {
              id: 'fallback_wpp',
              label: 'Contactar Asesor General',
              action: 'whatsapp_redirect',
              phone: '51982087005',
              wppText: 'Hola, me gustaría comunicarme con un asesor. 👋',
              icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            }
          ];
        }
      }
      else if (option.action === 'whatsapp_redirect') {
        responseText = 'Conectando con un asesor de la sede. Se abrirá tu aplicación de WhatsApp...';
        finalAction = 'whatsapp';
        whatsappMessage = option.wppText;
        targetPhone = option.phone;
      }

      const newBotMessage = { id: Date.now() + 1, sender: 'bot', text: responseText };
      if (nextOptions) {
        newBotMessage.options = nextOptions;
      }

      setMessages((prev) => [...prev, newBotMessage]);

      if (finalAction) {
        setTimeout(() => {
          if (finalAction === 'agendar' && setActiveModal) {
            setActiveModal('agendar');
          } else if (finalAction === 'navigate') {
            navigate(option.route);
          } else if (finalAction === 'whatsapp') {
            // Usa el número traído dinámicamente de la columna de la sede seleccionada
            const cleanPhone = targetPhone || '51982087005'; 
            const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(url, '_blank');
          }
          setIsOpen(false);
        }, 1500);
      }
    }, 1200);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[60] font-sans">
        
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-[340px] max-w-[calc(100vw-2rem)] bg-[#f0f2f5] rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col">
            
            <div className="bg-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white text-teal-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                  QP
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">Asistente QuiroPlus</h4>
                  <span className="text-[11px] text-teal-100 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    En línea
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar asistente"
                className="text-teal-100 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex flex-col gap-4 max-h-[400px] min-h-[300px]">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`text-[13.5px] px-4 py-2.5 max-w-[85%] leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-white text-stone-700 rounded-2xl rounded-tl-sm border border-stone-100'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {msg.options && (
                    <div className="mt-3 flex flex-col gap-2 pr-8">
                      {msg.options.map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => handleOptionClick(opt)}
                          className="group bg-white flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all duration-300 text-left"
                        >
                          <svg
                            className="w-5 h-5 text-teal-600 shrink-0 group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={opt.icon} />
                          </svg>
                          <span className="text-sm font-medium text-stone-700 group-hover:text-teal-800">
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-sm border border-stone-100 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
          className="bg-teal-700 text-white w-14 h-14 rounded-full shadow-lg shadow-teal-700/30 hover:bg-teal-600 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center group relative"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <div className="absolute inset-0 rounded-full bg-teal-600 opacity-20 group-hover:animate-ping" />
              <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default WhatsAppBot;