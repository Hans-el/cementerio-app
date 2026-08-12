# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Familias/Ciudadanos:** Personas que buscan localizar difuntos, consultar disponibilidad de espacios, y gestionar trámites de inhumación/exhumación en cementerios. Necesitan información clara y procesos simples desde su teléfono o computadora.
- **Personal del cementerio (Staff):** Operadores diarios que gestionan espacios, registran fallecidos, revisan solicitudes y responden consultas. Necesitan herramientas eficientes para tareas repetitivas.
- **Administradores:** Supervisores que aprueban/rechazan solicitudes, generan reportes, y gestionan la estructura del cementerio (sectores, manzanas, bloques). Necesitan visibilidad completa y control.
- **Superadmin:** Administrador del sistema que gestiona múltiples cementerios y cuentas de administrador a nivel plataforma.

## Product Purpose

Sistema de gestión integral de cementerios que permite a familias, personal y administradores gestionar espacios, registros de fallecidos, trámites (inhumación, exhumación), y consultas de manera digital, eliminando procesos manuales y mejorando la experiencia del usuario.

## Positioning

Plataforma multi-tenante especializada en gestión de cementerios con mapa interactivo, trámites digitales con carga de documentos, y panel administrativo completo. A diferencia de soluciones genéricas de gestión, está diseñada específicamente para el dominio funerario con validación de cédula ecuatoriana, estructura física jerárquica (sector → manzana → bloque → espacio), y flujos de trabajo específicos del sector.

## Operating Context

- Selección de cementerio previa al login (multi-tenante)
- Autenticación con cédula ecuatoriana + contraseña
- Mapa interactivo con zoom/pan para visualización del cementerio
- Carga de documentos PDF para trámites (inhumación: 5 docs, exhumación: 4 docs)
- Notificaciones push para actualizaciones de estado
- PWA instalable con soporte offline básico
- Reportes exportables a Excel
- Panel de dashboard con gráficas de Chart.js

## Capabilities and Constraints

- **Funcionalidades confirmadas:** Gestión de espacios, registros de fallecidos, trámites digitales, mapa interactivo, reportes, dashboard, sistema de notificaciones push, PWA
- **Restricciones técnicas:** Angular 18 standalone, Bootstrap 5 + ng-bootstrap, Chart.js, SweetAlert2 para diálogos
- **Terminología del dominio:** Sector, Manzana, Bloque, Espacio, Bovedas, Nichos, Cruces, Lotes, Inhumación, Exhumación, Trámite
- **Decisiones pendientes:** Estilo visual específico, paleta de colores más allá del color primario por cementerio

## Brand Commitments

- Nombre del sistema: Cementerio App
- Color dinámico por cementerio (CSS variable --color-cementerio)
- Voz de comunicación: Clara, respetuosa, profesional (contexto funerario)
- Iconografía: Bootstrap Icons

## Evidence on Hand

- Aplicación funcional con múltiples componentes y rutas
- Estilos existentes con Bootstrap 5
- Estructura de servicios completa (20+ servicios)
- Sistema de autenticación con JWT y roles
- Soporte PWA configurado

## Product Principles

1. **Claridad ante todo:** La información debe ser fácil de entender en un contexto emocionalmente delicado
2. **Eficiencia operativa:** Reducir tiempo en tareas repetitivas para staff y administradores
3. **Accesibilidad universal:** Funcionar en dispositivos móviles y desktop para todos los usuarios
4. **Seguridad de datos:** Proteger información sensible de fallecidos y documentos legales
5. **Escalabilidad multi-tenante:** Soportar múltiples cementerios con configuración independiente

## Accessibility & Inclusion

- Responsive design para móviles y desktop
- Texto alternativo en imágenes
- Navegación por teclado en formularios
- Contraste de colores adecuado (pendiente de auditoría)
