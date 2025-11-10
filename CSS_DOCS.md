# Organización de CSS - Documentación

## 📁 Estructura de CSS

Los estilos CSS se encuentran organizados en la carpeta `css/` para mantener el código limpio y modular.

### Archivos CSS Principales

#### `style.css`
- Estilos globales del sitio
- Estilos de componentes (botones, cards, etc.)
- Estilos de secciones (hero, about, services, projects, blog, contact)
- Variables de color y fuentes
- Estilos responsivos

#### `chatbot.css`
- Estilos del asistente virtual (chatbot)
- Panel de chat, mensajes, entrada de texto
- Animaciones del chatbot
- Estados (maximizado, minimizado, etc.)

#### `cookie-banner.css` ✨ **NUEVO**
- Estilos del banner de aceptación de cookies
- Animaciones de entrada/salida (slideUpBanner, slideDownBanner)
- Estilos de botones (Aceptar Todo, Solo Necesarias, Rechazar)
- Diseño responsivo para mobile (<768px)
- Gradiente azul (#3e64ff → #2a4cbf)

### Archivos CSS Bootstrap (Framework)

#### `bootstrap.min.css` (No incluido, usa Bootstrap 4 cargado como dependency)

#### Personalizaciones Bootstrap
- `bootstrap/bootstrap-grid.css` - Sistema de grid
- `bootstrap/bootstrap-reboot.css` - Reset de estilos

### Librerías CSS Externas

#### Animaciones
- `animate.css` - Librería de animaciones CSS

#### Carruseles
- `owl.carousel.min.css` - Estilos del carrusel Owl Carousel
- `owl.theme.default.min.css` - Tema por defecto de Owl Carousel

#### Lightbox
- `magnific-popup.css` - Estilos para lightbox de imágenes

#### Scroll Animations
- `aos.css` - Animate On Scroll (animaciones al scroll)

#### Iconos
- `open-iconic-bootstrap.min.css` - Open Iconic (iconos)
- `ionicons.min.css` - Ionicons (iconos)
- `flaticon.css` - Flaticon (iconos personalizados)
- `icomoon.css` - Icomoon (iconos)

### Orden de Carga (importante)

En `index.html`, los CSS se cargan en este orden:

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900" rel="stylesheet">

<!-- Bootstrap Icons (CDN) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<!-- Iconografía -->
<link rel="stylesheet" href="css/open-iconic-bootstrap.min.css">
<link rel="stylesheet" href="css/animate.css">
<link rel="stylesheet" href="css/owl.carousel.min.css">
<link rel="stylesheet" href="css/owl.theme.default.min.css">
<link rel="stylesheet" href="css/magnific-popup.css">
<link rel="stylesheet" href="css/aos.css">
<link rel="stylesheet" href="css/ionicons.min.css">
<link rel="stylesheet" href="css/flaticon.css">
<link rel="stylesheet" href="css/icomoon.css">

<!-- Estilos principales -->
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/chatbot.css">
<link rel="stylesheet" href="css/cookie-banner.css"> <!-- NUEVO -->
```

## 🎨 Estilos Inline (No Extraídos)

Los siguientes estilos inline se mantienen porque son dinámicos o específicos del contenido:

### 1. `background-image: url(...)`
- Necesarios para cargar imágenes de fondo dinámicamente
- Ubicaciones: About section, Projects, Blog posts, Contact section
- **Motivo**: Específicos del contenido, no reutilizables

### 2. Progress Bars (width: XX%)
- Ancho dinámico de barras de progreso en skills
- **Motivo**: Valor dinámico que representa el porcentaje de habilidad

### 3. `display: none` (chat-typing)
- Control de visibilidad del indicador de escritura en chatbot
- **Motivo**: Controlado dinámicamente por JavaScript

## 📋 Cambios Realizados

### ✅ Extraído:
- ✓ Todos los estilos de `.cookie-banner` → `css/cookie-banner.css`
- ✓ Animaciones `@keyframes slideUpBanner/slideDownBanner` → `css/cookie-banner.css`
- ✓ Estilos de botones `.cookie-btn-*` → `css/cookie-banner.css`
- ✓ Media queries para mobile → `css/cookie-banner.css`

### ❌ No Extraído (Dinámico):
- ✗ `background-image: url(...)` - Contenido dinámico
- ✗ `width: XX%` - Valores dinámicos
- ✗ `display: none/block` - Control dinámico por JS

## 🔧 Beneficios de la Organización

- ✅ Código CSS modular y fácil de mantener
- ✅ Mejor separación de responsabilidades
- ✅ Facilita el debugging y actualizaciones
- ✅ Mejora el rendimiento (cacheo del navegador)
- ✅ Menos líneas en `index.html`
- ✅ CSS reutilizable y escalable

## 📊 Estadísticas

| Archivo | Líneas CSS | Descripción |
|---------|-----------|-------------|
| `style.css` | ~1000+ | Estilos globales y componentes |
| `chatbot.css` | ~300+ | Estilos del chatbot |
| `cookie-banner.css` | ~130 | Estilos del banner de cookies (NUEVO) |
| `index.html` | -115 | CSS inline removido |

## 🎯 Próximos Pasos Sugeridos

Si en el futuro necesitas agregar más estilos:

1. **Para componentes reutilizables** → `css/components.css`
2. **Para utilidades personalizadas** → `css/utilities.css`
3. **Para temas** → `css/themes/`
4. **Para animaciones** → `css/animations.css`

## 📚 Referencias

- [CSS Methodology (BEM)](https://en.bem.info/)
- [Sass/SCSS para CSS más potente](https://sass-lang.com/)
- [CSS Custom Properties (Variables CSS)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

**Última actualización**: 10 de noviembre de 2025
**Estado**: Organización completada ✅
