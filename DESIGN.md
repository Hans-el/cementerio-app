---
name: Cementerio App
description: Sistema de gestión integral de cementerios con interfaz profesional y acogedora
colors:
  primary: "#2d5a27"
  primary-hover: "#3a7233"
  primary-dark: "#163212"
  primary-gradient-start: "#163212"
  primary-gradient-end: "#30422e"
  neutral-bg: "#f8f9fa"
  neutral-surface: "#f9fafb"
  neutral-muted: "#f3f4f6"
  neutral-border: "#e5e7eb"
  neutral-border-light: "#f3f4f6"
  text-primary: "#111827"
  text-secondary: "#374151"
  text-tertiary: "#6b7280"
  text-muted: "#9ca3af"
  success: "#28a745"
  success-bg: "#f0fdf4"
  success-text: "#166534"
  danger: "#dc2626"
  danger-bg: "#fef2f2"
  danger-text: "#dc2626"
  warning-bg: "#fffbeb"
  warning-border: "#fde68a"
  warning-text: "#92400e"
  info-bg: "#eff6ff"
  info-text: "#1d4ed8"
  info-border: "#bfdbfe"
  layout-bg: "rgb(234, 241, 237)"
  glass-overlay-dark: "rgba(20, 42, 15, 0.6)"
  glass-overlay-darker: "rgba(10, 15, 26, 0.9)"
  accent-blue: "rgba(59, 130, 246, 0.25)"
  primary-medium: "#2d5a3d"
  primary-bright: "#3a7233"
typography:
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  heading:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.2
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  subheading:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.3
  icon:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.2
  checkbox-label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  toggle-icon:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.2
  badge:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
  icon-font:
    fontFamily: "bootstrap-icons"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1
  small:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  xxl: "16px"
  glass: "20px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  card:
    backgroundColor: "#ffffff"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "20px"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
---

# Design System: Cementerio App

## Overview

**Creative North Star: "The Verdant Sanctuary"**

Una interfaz que transmite calma, respeto y profesionalismo — cualidades esenciales en el contexto funerario. El sistema utiliza verdes profundos como identidad principal, evocando naturaleza, vida eterna y serenidad. La paleta terrosa y los tonos neutros cálidos crean un ambiente acogedor sin ser informal. La jerarquía visual es clara y funcional, priorizando la escaneabilidad en dashboards y la simplicidad en flujos ciudadanos.

**Key Characteristics:**
- Identidad verde profunda que evoca naturaleza y eternidad
- Superficies limpias con sombras sutiles para profundidad
- Tipografía del sistema para máxima legibilidad y rendimiento
- Glassmorphism selectivo en elementos de entrada (login, selección de cementerio)
- Componentes consistentes con border-radius generoso (12-16px)
- Background layout suave en verde grisáceo

## Colors

La paleta se basa en verdes profundos que representan la naturaleza y la paz, con neutros cálidos que aportan calidez.

### Primary
- **Forest Deep** (#163212): Verde más oscuro, usado en gradientes de sidebar y elementos institucionales
- **Verdant Core** (#2d5a27): Verde principal para botones primarios, tabs activos, y acentos de marca
- **Sage Medium** (#2d5a3d): Verde medio para sidebar activo, botones de login/registro
- **Verdant Hover** (#3a7233): Estado hover de todos los botones primarios
- **Forest Gradient End** (#30422e): Final de gradientes sidebar e institucionales

### Neutral
- **Page Background** (#f8f9fa): Fondos de página principales
- **Surface Subtle** (#f9fafb): Fondos de tablas, stats, cards en hover
- **Surface Muted** (#f3f4f6): Chips de sugerencia, búsqueda, separadores FAQ
- **Border Default** (#e5e7eb): Bordes de cards, tablas, inputs
- **Border Light** (#f3f4f6): Separadores de filas, headers de cards
- **Text Primary** (#111827): Títulos, nombres, texto principal
- **Text Secondary** (#374151): Subtítulos, etiquetas, cuerpo de texto
- **Text Tertiary** (#6b7280): Descripciones, headers de tabla, metadata
- **Text Muted** (#9ca3af): Subtítulos, badges, hints, estados vacíos

### Semantic
- **Success** (#28a745): Estados activos, paginación, acciones exitosas
- **Success Background** (#f0fdf4): Fondos de badges activos
- **Danger** (#dc2626): Eliminación, errores, marcadores requeridos
- **Danger Background** (#fef2f2): Fondos de badges inactivos
- **Warning Background** (#fffbeb): Banners de advertencia
- **Warning Border** (#fde68a): Bordes de advertencia
- **Warning Text** (#92400e): Texto de advertencia
- **Info Background** (#eff6ff): Tags informativos
- **Info Text** (#1d4ed8): Texto informativo

### Named Rules
**The Verdant Identity Rule.** El verde (#2d5a27) es el único color de marca. Se usa con moderación — su rareza le da autoridad. No más del 15% de cualquier pantalla debe ser verde saturado.

## Typography

**Display Font:** Sistema (system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
**Body Font:** Sistema (mismas fuentes)
**Label Font:** Sistema (mismas fuentes, 12px)

**Character:** Tipografía funcional y legible que prioriza claridad sobre expresión. El uso de fuentes del sistema garantiza rendimiento óptimo y consistencia multi-plataforma.

### Hierarchy
- **Display** (800, clamp(6rem, 20vw, 10rem), 1): Número decorativo 404
- **Heading 1** (700, clamp(1.5rem, 4vw, 2.4rem), 1.2): Títulos de hero, páginas principales
- **Heading 2** (700, 1.35rem, 1.3): Títulos de sección
- **Heading 3** (600, 1.1rem, 1.4): Títulos de cards, stats
- **Body** (400, 14px, 1.5): Texto principal, formularios, descripciones
- **Label** (500, 12px, 1.4): Etiquetas de formulario, headers de tabla
- **Small** (500, 11px, 1.3): Badges, hints, metadata, micro-etiquetas

### Named Rules
**The Functional Type Rule.** La tipografía existe para servir, no para decorar. Sin fuentes decorativas, sin pesos experimentales. La jerarquía se logra con tamaño y peso, no con estilo.

## Layout

El layout utiliza un sistema de sidebar fijo de 280px con área de contenido principal flexible. El background general es un verde grisáceo suave (#eaf1ed) que crea calidez sin distracción.

- **Sidebar:** 280px fijo, gradiente verde oscuro, bordes redondeados (20px lado derecho)
- **Content Area:** Flexible, con padding responsivo (16px mobile, 32px desktop)
- **Max Widths:** 680px (perfil), 900px (información), 1000px (superadmin), 1280px (cementerios)
- **Breakpoint Principal:** 767.98px para sidebar colapsable
- **Grid:** Bootstrap grid system con gap consistente de 16-24px

### Spacing Rhythm
- **Micro:** 4px (gaps tiny, badges)
- **Small:** 8px (gaps de input, tabs)
- **Medium:** 16px (padding de componentes, gaps estándar)
- **Large:** 24px (secciones, cards)
- **XL:** 32px (padding de página)
- **XXL:** 48px (secciones grandes)

## Elevation & Depth

El sistema utiliza sombras sutiles para crear profundidad sin sobrecarga visual. Las sombras son mayormente ambientales (difusas) más que estructurales.

### Shadow Vocabulary
- **Subtle** (`0 1px 4px rgba(0,0,0,0.04)`): Tabs, cards en reposo, stats
- **Card** (`0 1px 4px rgba(0,0,0,0.05)`): Cards superadmin, bloque público
- **Hover Lift** (`0 0.5rem 1rem rgba(0,0,0,0.08)`): Estado hover de cards y filas
- **Card Hover** (`0 12px 24px rgba(0,0,0,0.25)`): Cards en hover (inicio, dashboard)
- **Sidebar** (`4px 0 20px rgba(0,0,0,0.15)`): Sombra lateral del sidebar
- **Dropdown** (`0 4px 12px rgba(0,0,0,0.2)`): Menús desplegables
- **Modal** (`0 20px 60px rgba(0,0,0,0.2)`): Cajas modales
- **Glass** (`0 8px 32px rgba(0,0,0,0.3)`): Elementos glassmorphism (login, registro)

### Named Rules
**The Flat-By-Default Rule.** Las superficies están planas en reposo. Las sombras aparecen solo como respuesta a estado (hover, elevación, focus). Esto mantiene la interfaz limpia y reduce carga visual.

## Shapes

El lenguaje de formas es generoso y amigable, con border-radius que varía según la jerarquía del elemento.

- **Micro** (2px): Puntos de leyenda, barras de seguridad, indicadores de progreso
- **Small** (4px): Controles de mapa, badges pequeños
- **Medium** (8px): Menús desplegables, paginación, botones de acción
- **Large** (12px): Inputs de formulario, botones principales, cards pequeñas
- **XL** (16px): Cards principales, modales, contenedores
- **XXL** (18-24px): Cards institucionales, paneles de glassmorphism
- **Full** (50%): Avatares, iconos circulares, toggles

### Named Rules
**The Rounded Hierarchy Rule.** Cuanto más importante es el elemento, más redondeado está. Inputs (12px) < Cards (16px) < Cards institucionales (18px) < Glass panels (24px). Los avatares siempre son circulares.

## Components

### Buttons
- **Shape:** Border-radius 10px (primarios) a 8px (secundarios)
- **Primary:** Background #2d5a27, texto blanco, padding 10px 20px
- **Hover:** Background #3a7233, transición suave 0.2s
- **Secondary/Ghost:** Bordes sutiles, fondo transparente o #f9fafb
- **Danger:** Background #dc2626 para eliminación

### Cards
- **Corner Style:** 16px radius
- **Background:** Blanco (#ffffff)
- **Shadow Strategy:** Sombra sutil en reposo, hover lift en interacción
- **Border:** 1px solid #e5e7eb (opcional)
- **Internal Padding:** 20px estándar

### Inputs / Fields
- **Style:** Borde 1px solid #e5e7eb, fondo blanco, radius 10-12px
- **Focus:** Border-color cambia a #28a745 (éxito) o #0d6efd (info), sombra de focus ring
- **Error:** Border-color #ef4444, texto de error rojo
- **Disabled:** Opacidad reducida, cursor no-allowed

### Navigation (Sidebar)
- **Style:** Fondo gradiente verde oscuro (#163212 a #30422e)
- **Typography:** 14px, peso 500, texto blanco
- **Active:** Background #2d5a3d, indicador izquierdo
- **Hover:** Background semi-transparente blanco
- **Mobile:** Colapsable con toggle, overlay oscuro

### Modals
- **Shape:** Border-radius 16px, sin borde
- **Background:** Blanco
- **Overlay:** rgba(0,0,0,0.5)
- **Shadow:** 0 20px 60px rgba(0,0,0,0.2)
- **Header:** Background #f8f9fa, border-bottom sutil

### Tables
- **Header:** Background #f9fafb, texto 11px uppercase
- **Row Hover:** Background #fafafa
- **Border:** 1px solid #f3f4f6 entre filas
- **Pagination:** Radius 8px, active #28a745

## Do's and Don'ts

### Do:
- **Do** Usar verde (#2d5a27) con moderación — es el color de autoridad
- **Do** Mantener border-radius consistente por jerarquía de elemento
- **Do** Usar sombras sutiles en reposo, hover lift en interacción
- **Do** Priorizar legibilidad sobre estética — este es un sistema de gestión
- **Do** Mantener spacing consistente (múltiplos de 4px)
- **Do** Usar transiciones suaves (0.2s) para feedback de interacción

### Don't:
- **Don't** Usar más de 15% de verde saturado en cualquier pantalla
- **Don't** Agregar sombras excesivas — la claridad supera la profundidad
- **Don't** Usar fuentes decorativas — la tipografía del sistema es suficiente
- **Don't** Mezclar border-radius inconsistentes en el mismo contexto
- **Don't** Ignorar el estado hover — es esencial para feedback visual
- **Don't** Usar colores de marca en elementos que no son de acción
