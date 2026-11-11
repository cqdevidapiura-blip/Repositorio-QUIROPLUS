import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ActionModal from '../components/ActionModal';

// Sedes
const SEDES = [
  { id: 'piura-san-felipe', nombre: 'Piura - San Felipe', ciudad: 'Piura' },
  { id: 'sullana', nombre: 'Sullana', ciudad: 'Piura' },
  { id: 'talara', nombre: 'Talara', ciudad: 'Piura' },
  { id: 'tacna', nombre: 'Tacna', ciudad: 'Tacna' },
  { id: 'tumbes', nombre: 'Tumbes', ciudad: 'Tumbes' },
];

// DATA REAL Y PROMOCIONES ACTUALIZADAS (Rutas public/images/menu/)
const CATALOGO_PRODUCTOS = [
  {
    id: 1,
    codigo: "CQV-ALM-01",
    marca: "OrthoRest",
    nombre: "Almohada Ergonómica",
    categoria: "Ergonomía de Descanso",
    precio: 120.00,
    precioOriginal: null,
    imagen: "/images/menu/almohada-cervical.jpg",
    descripcion: "Núcleo anatómico de viscoelástica de alta densidad con canal central para la descompresión cervical.",
    caracteristicas: ["Espuma memory foam", "Funda hipoalergénica lavable", "Diseño anatómico"]
  },
  {
    id: 2,
    codigo: "CQV-SOP-02",
    marca: "SpineAlign",
    nombre: "Soporte Lumbar",
    categoria: "Salud Ocupacional",
    precio: 120.00,
    precioOriginal: null,
    imagen: "/images/menu/soporte-lumbar.jpg",
    descripcion: "Soporte de corrección lumbar para postura en sedestación prolongada.",
    caracteristicas: ["Correas ajustables de fijación", "Malla respirable de alta durabilidad"]
  },
  {
    id: 3,
    codigo: "CQV-ROL-03",
    marca: "TheraRoll",
    nombre: "Rollo Cervical",
    categoria: "Reeducación Muscular",
    precio: 60.00,
    precioOriginal: null,
    imagen: "/images/menu/rollo-cervical.jpg",
    descripcion: "Cilindro de soporte técnico para descanso y alineación de la zona cervical.",
    caracteristicas: ["Superficie ergonómica firme", "Ideal para alivio de tensión"]
  },
  {
    id: 4,
    codigo: "CQV-GEL-04",
    marca: "TheraCold",
    nombre: "Gel Pack",
    categoria: "Terapia Térmica",
    precio: 30.00,
    precioOriginal: null,
    imagen: "/images/menu/gel-pack.jpg",
    descripcion: "Paquete de gel terapéutico adaptable para la aplicación segura de frío o calor.",
    caracteristicas: ["Reutilizable y duradero", "Se adapta al contorno del cuerpo"]
  },
  {
    id: 5,
    codigo: "CQV-COM-05",
    marca: "TheraHeat",
    nombre: "Compresa Caliente",
    categoria: "Terapia Térmica",
    precio: 60.00,
    precioOriginal: null,
    imagen: "/images/menu/compresa-caliente.jpg",
    descripcion: "Compresa diseñada para retener calor y brindar alivio muscular penetrante.",
    caracteristicas: ["Calentamiento rápido", "Material seguro al contacto con la piel"]
  },
  // --- SECCIÓN PROMOCIONES ---
  {
    id: 6,
    codigo: "PROMO-01",
    marca: "Pack Salud",
    nombre: "Promo: Almohada + Rollo Cervical",
    categoria: "Promociones",
    precio: 149.99,
    precioOriginal: 180.00,
    imagen: "/images/menu/promo-almohada-rollo.jpg",
    descripcion: "La combinación perfecta para un descanso reparador. Llevando ambos productos mejoras tu higiene postural al dormir y ahorras dinero.",
    caracteristicas: ["1 Almohada Ergonómica", "1 Rollo Cervical", "Ahorro garantizado de S/ 30.01"]
  },
  {
    id: 7,
    codigo: "PROMO-02",
    marca: "Pack Postura",
    nombre: "Promo: Soporte + Rollo Cervical",
    categoria: "Promociones",
    precio: 149.99,
    precioOriginal: 180.00,
    imagen: "/images/menu/promo-soporte-rollo.jpg",
    descripcion: "Cuida tu espalda completa. Este paquete te brinda soporte lumbar para el día a día y soporte cervical para relajar la tensión.",
    caracteristicas: ["1 Soporte Lumbar", "1 Rollo Cervical", "Ahorro garantizado de S/ 30.01"]
  }
];

const Productos = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('piura-san-felipe');
  const navigate = useNavigate();

  const [vistaActual, setVistaActual] = useState('catalogo');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [vistaActual]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad, sede: sedeSeleccionada } : item
        );
      }
      return [...prev, { ...producto, cantidad, sede: sedeSeleccionada }];
    });
    setVistaActual('carrito');
  };

  const actualizarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + delta;
          return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 };
        }
        return item;
      })
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.filter((item) => item.id !== id);
      if (nuevoCarrito.length === 0) {
        setVistaActual('catalogo');
      }
      return nuevoCarrito;
    });
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const subtotal = totalCarrito / 1.18;
  const igv = totalCarrito - subtotal;
  const costoEnvio = 5.00;
  const descuentoEnvio = 5.00;

  const productosFiltrados = useMemo(() => {
    return CATALOGO_PRODUCTOS.filter((p) => {
      const coincideBusqueda = 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.marca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const coincideCategoria = 
        filtroCategoria === 'Todos' ? true : 
        filtroCategoria === 'Promociones' ? p.categoria === 'Promociones' : 
        p.categoria !== 'Promociones';

      return coincideBusqueda && coincideCategoria;
    });
  }, [searchTerm, filtroCategoria]);

  const irADetalle = (producto) => {
    setProductoSeleccionado(producto);
    setVistaActual('detalle');
  };

  // Función agregada para procesar el pago vía WhatsApp
  const procesarPago = () => {
    if (carrito.length === 0) return;

    const numeroWhatsApp = "51982087005";
    let mensaje = "Hola, me gustaría realizar el siguiente pedido:\n\n";

    carrito.forEach((item) => {
      const sedeInfo = SEDES.find(s => s.id === item.sede);
      const nombreSede = sedeInfo ? sedeInfo.nombre : item.sede;
      mensaje += `- ${item.cantidad}x ${item.nombre} (S/ ${item.precio.toFixed(2)} c/u) - Sede: ${nombreSede}\n`;
    });

    mensaje += `\n*Total a pagar: S/ ${totalCarrito.toFixed(2)}*`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#f8f9fa] font-sans min-h-screen flex flex-col relative">
      <Header setActiveModal={setActiveModal} />

      <main className="flex-grow pt-[100px] pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* BARRA SUPERIOR DE NAVEGACIÓN Y CARRITO */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-stone-200 pb-4">
            <div className="text-sm text-slate-500 flex items-center gap-2 flex-wrap">
              <span className="cursor-pointer hover:text-[#00b2a9] font-medium transition-colors" onClick={() => navigate('/')}>
                Inicio
              </span>
              <span>/</span>
              <span className={`cursor-pointer hover:text-[#00b2a9] font-medium transition-colors ${vistaActual === 'catalogo' ? 'text-slate-800 font-semibold' : ''}`} onClick={() => setVistaActual('catalogo')}>
                Catálogo Ergonómico
              </span>
              {vistaActual !== 'catalogo' && (
                <>
                  <span>/</span>
                  <span className="font-semibold text-slate-800">
                    {vistaActual === 'carrito' ? 'Mi Carrito' : productoSeleccionado?.nombre}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => setVistaActual('carrito')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm ${
                vistaActual === 'carrito' ? 'bg-[#1c2854] text-white' : 'bg-white border-2 border-[#00b2a9] text-[#00b2a9] hover:bg-[#e6f7f9]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Mi Carrito</span>
              {carrito.length > 0 && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ml-1 bg-[#00b2a9] text-white">
                  {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                </span>
              )}
            </button>
          </div>

          {/* VISTA 1: CATÁLOGO */}
          {vistaActual === 'catalogo' && (
            <div className="animate-fade-in">
              <div className="relative w-full h-[280px] md:h-[340px] rounded-2xl md:rounded-[2rem] overflow-hidden bg-white shadow-sm mb-10 flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100" 
                  style={{ backgroundImage: "url('/images/menu/banner-productos.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/50 to-white/10"></div>
                <h1 className="relative z-10 text-4xl md:text-7xl font-black text-[#1c2854] tracking-tight uppercase text-center drop-shadow-sm px-4">
                  Productos <br /> Ergonómicos
                </h1>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0">
                  <h3 className="text-2xl font-medium text-slate-800 mb-4">Filtros</h3>
                  
                  {/* Buscador Integrado */}
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#00b2a9] bg-white shadow-sm"
                    />
                  </div>

                  {/* Selector de Secciones */}
                  <div className="flex flex-col gap-2 mb-6">
                    <button 
                      onClick={() => setFiltroCategoria('Todos')} 
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${filtroCategoria === 'Todos' ? 'bg-[#00b2a9] text-white shadow-sm' : 'bg-white border border-stone-100 text-slate-600 hover:bg-stone-50'}`}
                    >
                      Todos los productos
                    </button>
                    <button 
                      onClick={() => setFiltroCategoria('Productos')} 
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${filtroCategoria === 'Productos' ? 'bg-[#00b2a9] text-white shadow-sm' : 'bg-white border border-stone-100 text-slate-600 hover:bg-stone-50'}`}
                    >
                      Productos Individuales
                    </button>
                    <button 
                      onClick={() => setFiltroCategoria('Promociones')} 
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${filtroCategoria === 'Promociones' ? 'bg-[#1c2854] text-white shadow-sm' : 'bg-white border border-stone-100 text-slate-600 hover:bg-stone-50'}`}
                    >
                       Ver Promociones
                    </button>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button onClick={() => { setSearchTerm(''); setFiltroCategoria('Todos'); }} className="bg-[#00b2a9] text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm w-full">
                      Limpiar
                    </button>
                  </div>
                </aside>

                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold text-[#00b2a9]">
                      {filtroCategoria === 'Promociones' ? 'Promociones Especiales' : 'Catálogo'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-6">Mostrando {productosFiltrados.length} resultados</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {productosFiltrados.map((producto) => (
                      <div key={producto.id} className="bg-white rounded-xl border border-stone-100 p-5 flex flex-col hover:shadow-lg transition-shadow duration-300 relative">
                        {producto.categoria === 'Promociones' && (
                          <div className="absolute top-4 right-4 bg-[#1c2854] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
                            PROMO
                          </div>
                        )}
                        <div className="w-full h-48 flex items-center justify-center mb-4 cursor-pointer" onClick={() => irADetalle(producto)}>
                          <img src={producto.imagen} alt={producto.nombre} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300 rounded-lg mix-blend-multiply" />
                        </div>
                        <div className="flex-grow">
                          <span className={`text-xs font-medium mb-1 block ${producto.categoria === 'Promociones' ? 'text-[#00b2a9]' : 'text-slate-400'}`}>
                            {producto.marca}
                          </span>
                          <h3 className="text-base font-bold text-slate-800 leading-snug cursor-pointer hover:text-[#00b2a9] transition-colors line-clamp-2" onClick={() => irADetalle(producto)}>
                            {producto.nombre}
                          </h3>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-end gap-2 mb-4">
                            <span className="text-2xl font-bold text-[#00b2a9]">S/ {producto.precio.toFixed(2)}</span>
                            {producto.precioOriginal && (
                              <span className="text-xs text-slate-400 line-through mb-1">S/ {producto.precioOriginal.toFixed(2)}</span>
                            )}
                          </div>
                          <button onClick={() => irADetalle(producto)} className="w-full border-2 border-[#00b2a9] text-[#00b2a9] hover:bg-[#00b2a9] hover:text-white font-bold py-2.5 rounded-full transition-colors text-sm">
                            Ver Detalle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {productosFiltrados.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                      No se encontraron productos que coincidan con tu búsqueda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: DETALLE DE PRODUCTO */}
          {vistaActual === 'detalle' && productoSeleccionado && (
            <div className="animate-fade-in bg-white rounded-2xl border border-stone-100 p-6 md:p-10 shadow-sm mt-4">
              <button onClick={() => setVistaActual('catalogo')} className="flex items-center gap-2 text-slate-500 hover:text-[#00b2a9] font-medium text-sm mb-8 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Volver al catálogo
              </button>

              <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white border border-stone-100 rounded-2xl">
                  <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} className="w-full h-64 sm:h-[400px] object-contain mix-blend-multiply" />
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <span className={`text-sm font-medium mb-2 ${productoSeleccionado.categoria === 'Promociones' ? 'text-[#00b2a9]' : 'text-slate-400'}`}>
                    {productoSeleccionado.marca}
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-bold text-[#1c2854] leading-tight mb-4">{productoSeleccionado.nombre}</h1>
                  
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-bold text-[#00b2a9]">S/ {productoSeleccionado.precio.toFixed(2)}</span>
                    {productoSeleccionado.precioOriginal && (
                      <span className="text-lg text-slate-400 line-through mb-1">S/ {productoSeleccionado.precioOriginal.toFixed(2)}</span>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-8">{productoSeleccionado.descripcion}</p>

                  <div className="mb-8">
                    <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Características</h4>
                    <ul className="space-y-2">
                      {productoSeleccionado.caracteristicas.map((car, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-[#00b2a9] font-bold">✓</span> {car}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sede de Recojo</label>
                    <select
                      value={sedeSeleccionada}
                      onChange={(e) => setSedeSeleccionada(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 text-slate-700 outline-none focus:border-[#00b2a9] text-sm font-medium cursor-pointer bg-white"
                    >
                      {SEDES.map((s) => (
                        <option key={s.id} value={s.id}>{s.nombre} ({s.ciudad})</option>
                      ))}
                    </select>
                  </div>

                  <button onClick={() => agregarAlCarrito(productoSeleccionado)} className="w-full bg-[#00b2a9] hover:bg-[#009baf] text-white font-bold py-4 px-8 rounded-full transition-colors shadow-lg text-center">
                    Agregar al carrito de compras
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3: CARRITO */}
          {vistaActual === 'carrito' && (
            <div className="animate-fade-in max-w-6xl mx-auto mt-4">
              <button onClick={() => setVistaActual('catalogo')} className="flex items-center gap-2 text-slate-500 hover:text-[#00b2a9] font-medium text-sm mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Seguir comprando
              </button>

              {carrito.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-stone-100 p-16 text-center text-slate-500 shadow-sm max-w-md mx-auto my-8">
                  <h3 className="text-lg font-bold text-[#0f172a] mb-1">Tu carrito está vacío</h3>
                  <p className="text-sm text-slate-500 mb-6">Aún no has agregado productos.</p>
                  <button onClick={() => setVistaActual('catalogo')} className="bg-[#009baf] text-white font-bold px-8 py-3 rounded-full hover:bg-teal-700 transition-colors shadow-md">
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-grow space-y-6">
                    <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 shadow-sm overflow-x-auto">
                      <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-stone-100 pb-4 min-w-[500px]">
                        <div className="col-span-6">Producto</div>
                        <div className="col-span-2 text-center">Precio</div>
                        <div className="col-span-2 text-center">Cantidad</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>

                      {carrito.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 items-center py-5 border-b border-stone-100 last:border-b-0 min-w-[500px]">
                          <div className="col-span-6 flex items-center gap-4">
                            <button onClick={() => eliminarDelCarrito(item.id)} className="text-slate-300 hover:text-red-500 font-bold transition-colors p-1">✕</button>
                            <div className="w-16 h-16 bg-stone-50 border border-stone-100 rounded-xl p-1 shrink-0 flex items-center justify-center overflow-hidden">
                              <img src={item.imagen} alt={item.nombre} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#009baf] font-bold uppercase tracking-wider block">{item.categoria}</span>
                              <h4 className="text-sm font-bold text-[#0f172a] leading-tight">{item.nombre}</h4>
                              <span className="text-xs text-slate-400">Sede: {SEDES.find(s => s.id === item.sede)?.nombre}</span>
                            </div>
                          </div>
                          <div className="col-span-2 text-center">
                            <p className="text-slate-800 font-bold text-sm">S/ {item.precio.toFixed(2)}</p>
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                              <button onClick={() => actualizarCantidad(item.id, -1)} className="px-2.5 py-1 text-slate-600 hover:bg-stone-200 font-bold text-sm">−</button>
                              <span className="px-3 py-1 font-bold text-slate-800 text-sm">{item.cantidad}</span>
                              <button onClick={() => actualizarCantidad(item.id, 1)} className="px-2.5 py-1 text-slate-600 hover:bg-stone-200 font-bold text-sm">+</button>
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <p className="text-[#009baf] font-bold text-sm">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full lg:w-[360px] shrink-0">
                    <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 shadow-sm sticky top-[150px]">
                      <h3 className="text-[#0f172a] font-bold text-lg mb-6 border-b border-stone-100 pb-3">Resumen del pedido</h3>
                      <div className="space-y-3 text-sm text-slate-600 border-b border-stone-100 pb-6">
                        <div className="flex justify-between"><span>Subtotal:</span><span className="font-semibold text-slate-800">S/ {subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Costo de envío / recojo:</span><span className="font-semibold text-slate-800">S/ {costoEnvio.toFixed(2)}</span></div>
                        <div className="flex justify-between text-[#009baf] font-semibold"><span>Descuento de envío:</span><span>- S/ {descuentoEnvio.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>IGV (18%):</span><span className="font-semibold text-slate-800">S/ {igv.toFixed(2)}</span></div>
                      </div>
                      <div className="flex justify-between items-center py-4 text-[#0f172a] font-bold text-xl">
                        <span>Total</span>
                        <span className="text-[#009baf]">S/ {totalCarrito.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={procesarPago}
                        className="w-full bg-[#009baf] hover:bg-teal-700 text-white font-bold py-3.5 rounded-full shadow-md transition-all duration-300 mt-2 cursor-pointer"
                      >
                        Proceder al Pago
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer setActiveModal={setActiveModal} />
      <ActionModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
    </div>
  );
};

export default Productos;