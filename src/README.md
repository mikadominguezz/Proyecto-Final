# Marketplace de Servicios con Insumos

Aplicación web que conecta tres tipos de usuarios: Solicitantes que publican servicios, Proveedores de Servicio que envían cotizaciones, y Proveedores de Insumos que ofrecen materiales necesarios para ejecutar los servicios.

## 🚀 Características

- **Sistema de Autenticación**: 7 usuarios de prueba con diferentes roles (hardcodeado)
- **Gestión de Servicios**: Publicación completa con insumos requeridos
- **Sistema de Cotizaciones**: Los proveedores pueden enviar presupuestos
- **Ofertas de Insumos**: Proveedores pueden ofrecer packs de materiales
- **Comparador Inteligente**: Compara cotizaciones por precio, plazo y rating
- **Dashboard Personalizado**: Diferente para cada tipo de usuario
- **Gestión de Estado**: React Context + Reducer
- **UI Moderna**: Componentes shadcn/ui con Tailwind CSS

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior

## 🛠️ Instalación

1. Descarga o clona este proyecto

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. La aplicación se abrirá automáticamente en `http://localhost:3000`

## 👥 Usuarios de Prueba

### Solicitantes
- **Email**: maria@example.com | **Password**: 123456
- **Email**: carlos@example.com | **Password**: 123456

### Proveedores de Servicio
- **Email**: jardin@example.com | **Password**: 123456 (Rating: 4.5)
- **Email**: piscinas@example.com | **Password**: 123456 (Rating: 4.8)
- **Email**: limpieza@example.com | **Password**: 123456 (Rating: 4.2)

### Proveedores de Insumos
- **Email**: insumos@example.com | **Password**: 123456
- **Email**: distribuidora@example.com | **Password**: 123456

## 📖 Flujo de Uso

### Como Solicitante:
1. Inicia sesión con un usuario solicitante
2. Publica un nuevo servicio con insumos requeridos
3. Recibe cotizaciones de proveedores
4. Compara las ofertas usando el comparador
5. Selecciona la mejor cotización

### Como Proveedor de Servicio:
1. Inicia sesión con un usuario proveedor de servicio
2. Explora servicios disponibles
3. Envía cotizaciones con precio y plazo
4. Gestiona tus cotizaciones activas, ganadas y perdidas

### Como Proveedor de Insumos:
1. Inicia sesión con un usuario proveedor de insumos
2. Gestiona tu catálogo de insumos (ABM completo)
3. Crea ofertas de packs de insumos para servicios
4. Administra stock y precios

## 🏗️ Estructura del Proyecto

```
├── components/           # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── Login.jsx
│   ├── Navbar.jsx
│   ├── Dashboard.jsx
│   ├── ServicesList.jsx
│   ├── ServiceDetail.jsx
│   ├── CreateService.jsx
│   ├── CreateQuote.jsx
│   ├── MyQuotes.jsx
│   ├── QuoteComparator.jsx
│   ├── CreateSupplyOffer.jsx
│   └── SuppliesManagement.jsx
├── context/             # Gestión de estado
│   └── AppContext.jsx
├── data/               # Datos mock
│   └── mockData.js
├── styles/             # Estilos globales
│   └── globals.css
├── App.jsx             # Componente principal
├── main.jsx            # Punto de entrada
└── package.json        # Dependencias
```

## 🎨 Tecnologías Utilizadas

- **React 18**: Framework JavaScript
- **Vite**: Build tool y dev server
- **Tailwind CSS 4.0**: Framework de estilos
- **shadcn/ui**: Componentes de UI
- **Lucide React**: Iconos
- **Sonner**: Notificaciones toast
- **Radix UI**: Primitivas de UI accesibles

## 📦 Scripts Disponibles

- `npm start` o `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm run preview` - Preview del build de producción

## 🔄 Estados de Servicio

- **PUBLICADO**: Servicio recién creado, abierto a cotizaciones
- **EN_EVALUACION**: Solicitante está revisando cotizaciones
- **ASIGNADO**: Cotización seleccionada, trabajo en progreso
- **COMPLETADO**: Servicio finalizado

## ✨ Características Destacadas

### Validaciones
- Formularios completos con validación
- Control de stock en ofertas de insumos
- Validación de datos antes de enviar

### Filtros y Búsqueda
- Búsqueda en tiempo real
- Filtros por categoría, estado y ciudad
- Ordenamiento inteligente en comparador

### Experiencia de Usuario
- Interfaz responsive
- Feedback visual con toasts
- Estados de carga
- Confirmaciones para acciones importantes

## 📝 Notas Importantes

- Los datos se almacenan en memoria (estado global)
- Al recargar la página, los datos vuelven al estado inicial
- No hay backend real - Todo funciona en el cliente
- Las contraseñas están en texto plano (solo para demostración)

## 🤝 Soporte

Para reportar problemas o sugerencias, por favor contacta al equipo de desarrollo.

---

Desarrollado con ❤️ usando React y Tailwind CSS
