# ElectricidadT - Aplicación Angular PWA

Aplicación web progresiva (PWA) desarrollada con Angular, optimizada 100% para dispositivos móviles con una interfaz moderna.

## Características

- ✅ **PWA (Progressive Web App)** - Instalable en dispositivos móviles
- ✅ **Diseño Mobile-First** - Optimizado completamente para móviles
- ✅ **Interfaz Moderna** - Diseño contemporáneo con gradientes y animaciones
- ✅ **Login** - Sistema de autenticación con validación de formularios
- ✅ **Menú Lateral** - Sidebar responsive con navegación
- ✅ **Dashboard** - Panel de control con estadísticas y actividad reciente

## Tecnologías

- Angular 18
- TypeScript
- SCSS
- Angular Service Worker (PWA)
- RxJS

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm start
```

3. Abrir en el navegador:
```
http://localhost:4200
```

## Build para Producción

```bash
npm run build
```

El build de producción incluye el service worker para PWA.

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # Componente de login
│   │   ├── dashboard/      # Componente de dashboard
│   │   └── sidebar/        # Componente de menú lateral
│   ├── services/
│   │   └── sidebar.service.ts  # Servicio para manejar el sidebar
│   ├── app.component.*     # Componente principal
│   ├── app.module.ts       # Módulo principal
│   └── app-routing.module.ts # Configuración de rutas
├── assets/                 # Recursos estáticos
├── environments/           # Configuración de entornos
├── index.html             # HTML principal
├── manifest.webmanifest   # Manifest para PWA
└── styles.scss            # Estilos globales
```

## Características Móviles

- Diseño responsive con breakpoints móviles
- Touch-friendly con áreas táctiles optimizadas
- Prevención de zoom en inputs (iOS)
- Safe area support para dispositivos con notch
- Animaciones suaves y transiciones
- Sidebar con overlay en móviles

## PWA

La aplicación está configurada como PWA y puede ser instalada en dispositivos móviles. El manifest y service worker están configurados para:

- Instalación offline
- Caché de recursos
- Actualizaciones automáticas
- Iconos para diferentes tamaños de pantalla

## Desarrollo

Para desarrollo, la aplicación se ejecuta en `http://localhost:4200`. El hot-reload está habilitado para desarrollo rápido.

## Licencia

Este proyecto es de código abierto.
