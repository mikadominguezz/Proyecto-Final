export const MOCK_USERS = [
  // Solicitantes
  {
    id: "1",
    nombre: "María González",
    email: "maria@example.com",
    password: "123456",
    rol: "SOLICITANTE",
  },
  {
    id: "2",
    nombre: "Carlos Rodríguez",
    email: "carlos@example.com",
    password: "123456",
    rol: "SOLICITANTE",
  },
  // Proveedores de Servicio
  {
    id: "3",
    nombre: "Servicios del Jardín SA",
    email: "jardin@example.com",
    password: "123456",
    rol: "PROVEEDOR_SERVICIO",
    rating: 4.5,
    ratingCount: 10, // Ya tiene 10 calificaciones previas
  },
  {
    id: "4",
    nombre: "Piscinas Premium",
    email: "piscinas@example.com",
    password: "123456",
    rol: "PROVEEDOR_SERVICIO",
    rating: 4.8,
    ratingCount: 15, // Ya tiene 15 calificaciones previas
  },
  {
    id: "5",
    nombre: "Limpieza Total",
    email: "limpieza@example.com",
    password: "123456",
    rol: "PROVEEDOR_SERVICIO",
    rating: 4.2,
    ratingCount: 8, // Ya tiene 8 calificaciones previas
  },
  // Proveedores de Insumos
  {
    id: "6",
    nombre: "Insumos del Norte",
    email: "insumos@example.com",
    password: "123456",
    rol: "PROVEEDOR_INSUMOS",
  },
  {
    id: "7",
    nombre: "Distribuidora Central",
    email: "distribuidora@example.com",
    password: "123456",
    rol: "PROVEEDOR_INSUMOS",
  },
];

export const INITIAL_SERVICES = [
  {
    id: "s1",
    solicitanteId: "1",
    titulo: "Limpieza de jardín y pileta",
    descripcion: "Necesito limpieza completa del jardín (200m²) y mantenimiento de la pileta",
    categoria: "jardineria",
    ciudad: "montevideo",
    fechaPreferida: "2025-11-15",
    insumosRequeridos: [
      { nombre: "Cloro", cantidad: 5, unidad: "kg" },
      { nombre: "Fertilizante", cantidad: 10, unidad: "kg" },
      { nombre: "Bolsas de basura", cantidad: 20, unidad: "unidad" },
    ],
    estado: "PUBLICADO",
    createdAt: new Date().toISOString(),
  },
  {
    id: "s2",
    solicitanteId: "2",
    titulo: "Mantenimiento de piscina",
    descripcion: "Servicio de limpieza y mantenimiento mensual de piscina de 50m²",
    categoria: "piscinas",
    ciudad: "punta-del-este",
    fechaPreferida: "2025-11-20",
    insumosRequeridos: [
      { nombre: "Cloro", cantidad: 3, unidad: "kg" },
      { nombre: "Algicida", cantidad: 2, unidad: "l" },
    ],
    estado: "PUBLICADO",
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_QUOTES = [
  {
    id: "q1",
    serviceId: "s1",
    proveedorId: "3",
    precio: 15000,
    plazoDias: 3,
    detalle: "Incluye mano de obra, herramientas y retiro de residuos",
    ratingProveedorMock: 4.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q2",
    serviceId: "s1",
    proveedorId: "5",
    precio: 12500,
    plazoDias: 5,
    detalle: "Servicio completo con garantía de 30 días",
    ratingProveedorMock: 4.2,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SUPPLIES = [
  {
    id: "sup1",
    vendedorId: "6",
    nombre: "Cloro granulado",
    categoria: "quimicos",
    unidad: "kg",
    precioUnit: 450,
    stock: 100,
  },
  {
    id: "sup2",
    vendedorId: "6",
    nombre: "Fertilizante orgánico",
    categoria: "jardineria",
    unidad: "kg",
    precioUnit: 320,
    stock: 50,
  },
  {
    id: "sup3",
    vendedorId: "7",
    nombre: "Algicida concentrado",
    categoria: "quimicos",
    unidad: "lts",
    precioUnit: 580,
    stock: 30,
  },
  {
    id: "sup4",
    vendedorId: "7",
    nombre: "Bolsas de basura 100lts",
    categoria: "limpieza",
    unidad: "unidad",
    precioUnit: 85,
    stock: 200,
  },
];

export const INITIAL_SUPPLY_OFFERS = [
  {
    id: "so1",
    serviceId: "s1",
    vendedorId: "6",
    items: [
      { supplyId: "sup1", cantidad: 5 },
      { supplyId: "sup2", cantidad: 10 },
      { supplyId: "sup4", cantidad: 20 },
    ],
    precioTotal: 7150,
    notas: "Entrega en 48hs. Incluye envío gratis",
    createdAt: new Date().toISOString(),
  },
];
