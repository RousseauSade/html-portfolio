# Portafolio_Mein

Este repositorio contiene el portafolio web estático personal (HTML/CSS/JS) usado para presentar proyectos, habilidades y servicios.

Live demo
https://rousseausade.github.io/html-portfolio/

Contenido principal
- `index.html` — Página principal del portafolio.
- `styles.css` — Estilos globales del sitio.
- `Assets/Pages/` — Páginas internas organizadas por sección (About, Blogs, Commissions, Contact, Education, Experience, Hobbies, Skills, Proyects, etc.).

Comisiones (Commissions)
- `Assets/Pages/Commissions/Commissions.html` — Página de tarifas y servicios. Esta página tiene estilos específicos aplicados directamente en el `<head>` y una clase de página `commissions-page` para scoping.
- Cada sección de servicios ahora está anotada con una clase específica para permitir estilos personalizados por categoría:
	- `service-digital-art`
	- `service-pixel-art`
	- `service-programming`
	- `service-video`

Cambios recientes (nota importante)
- No se tocó la barra de navegación (`.navigator`) ni el `footer`. Los cambios aplicados son exclusivos de la página de `Commissions` y no afectan otras páginas.
- Estilos de la página de comisiones están embebidos (inline) en `Commissions.html` al final del bloque `<style>` y proporcionan un tema único y responsive. Si prefieres, puedo extraer esos estilos a `Assets/Pages/Commissions/Commissions.css` para mejor mantenimiento.

Cómo probar localmente (Windows / PowerShell)
1. Abre PowerShell y posiciona la carpeta del proyecto:

```powershell
cd 'd:\Codes\Personal_Work\Portafolio_Mein'
```

2. Levanta un servidor estático rápido con Python (si tienes Python instalado):

```powershell
python -m http.server 5500
# luego abre en el navegador: http://localhost:5500/index.html
```

Alternativa: abrir el archivo `index.html` directamente en el navegador o usar la extensión Live Server de VS Code (recomendada para desarrollo rápido).

Recomendaciones y próximos pasos
- Extraer CSS específico de `Commissions.html` a `Assets/Pages/Commissions/Commissions.css` y enlazarlo desde el HTML para mejor cache y mantenimiento.
- Añadir micro-interacciones para los botones "Order Now" (modal o redirección a un formulario de contacto).
- Convertir listas largas en acordeones en móvil para mejorar la experiencia en pantallas pequeñas.

Contribuciones
- Si quieres que haga cualquiera de las recomendaciones (extraer CSS, añadir acordeones, o implementar un pequeño servidor de desarrollo con npm), dime cuál y lo implemento.

Contacto
- Proyecto y autor: Rousseau Sade

Licencia
- Este repositorio no incluye una licencia explícita; si quieres, puedo agregar una (MIT, Apache 2.0, etc.).
