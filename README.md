#  Portafolio de Proyecto Web: Figuritas

**Estudiante:** [Josue Enrique Alvarez Rivera]
**Fecha:** [Fecha de entrega 24/10/26]
**Enlace al Sitio Web (Vercel):** https://files-navy-iota.vercel.app/ 
**Repositorio GitHub:** https://github.com/alvaresriverajosueenrique-code/files 

---

## 1. Identidad de Marca y Producto

###  Ficha del Producto

* **Nombre Comercial:** Figuritas
* **Descripción:** Sitio web estático hecho con HTML, CSS y JavaScript. Catálogo de figuras y muñequitos de colección. Reúne páginas informativas sobre JavaScript, jQuery, JSON y hosting, un directorio con 15 herramientas de Google (con buscador y filtros), un cuestionario interactivo y un formulario de contacto. Incluye selector de idioma Español / English, modo claro y oscuro, y música de fondo opcional.
* **Público Objetivo:** [Coleccionistas jóvenes y adultos que aman las figuras y los muñequitos y quieren conocer piezas nuevas y mantener su colección ordenada.]

###  Diseño Visual

* **Logotipo:**

![Logotipo de la Marca]![alt text](img/avatar_realista.png)

* **Paleta de Colores:**

| Color | Código HEX | Uso en el Sitio |
| :--- | :--- | :--- |
| Dominante | `[#HEX]` | Encabezado y navegación |
| Secundario | `[#HEX]` | Tarjetas y botones |
| Acento | `[#HEX]` | Resaltados y efectos al pasar el cursor |
| Fondo oscuro | `[#HEX]` | Modo oscuro (`css/tema.css`) |

> Los códigos salen de las variables de color de `css/estilos.css`.

* **Demostración del Carousel:**

![Carousel de Productos](img/goku.png) 
![Carousel de Productos](img/marvel.png) 
![Carousel de Productos](img/lol.png) 
---

## 2. Investigación Técn|ica

Resumen informativo de las subpáginas creadas:

1. **JavaScript (Vanilla):** Es el lenguaje que le da comportamiento a las páginas web y corre directamente en el navegador, sin librerías. En el proyecto se usa para manipular el DOM (cambiar textos y estilos), responder a eventos como clics y envíos de formulario, mover el carrusel, calcular el resultado del cuestionario y guardar preferencias como el idioma o el tema. Los conceptos clave son variables (`let`, `const`), funciones, condicionales, ciclos, arreglos y objetos, eventos y selección de elementos con `document.querySelector`.
2. **jQuery:** Es una librería de JavaScript que simplifica tareas comunes con una sintaxis corta (`$("#id").hide()`). Su ventaja es que reduce el código al seleccionar elementos, manejar eventos, crear animaciones y hacer peticiones AJAX, y que funciona igual en distintos navegadores. Frente a JavaScript puro, escribe menos pero agrega una dependencia extra y hoy muchas de sus funciones ya existen de forma nativa. Es útil en proyectos antiguos o cuando se quiere resolver algo rápido.
3. **JSON:** Es un formato de texto para guardar e intercambiar datos mediante pares **clave-valor** (`{"nombre": "Figuritas"}`). Admite cadenas, números, booleanos, arreglos, objetos y `null`. En la web es el formato estándar para que el navegador y los servidores se envíen información; con `JSON.parse()` se convierte el texto en un objeto y con `JSON.stringify()` se hace al revés. Es el formato que se usa para enviar el contenido del formulario de contacto.
4. **Web Hosting y Dominios:** El hosting es el servicio que guarda los archivos del sitio y los entrega cuando alguien lo visita. **Vercel** se conecta al repositorio de GitHub y publica el sitio automáticamente en cada cambio (*deploy*). El **DNS** es el sistema que traduce un nombre de dominio (como `brotasitio.vercel.app`) a la dirección IP del servidor. Existen dominios genéricos (`.com`, `.org`), de país (`.sv`, `.mx`) y subdominios gratuitos como los que entrega Vercel.

---

## 3. Integraciones Especiales

###  Formulario de Contacto + Webhook de Discord

Explicación técnica del funcionamiento:

1. El usuario completa el formulario de contacto en la web (nombre, correo y mensaje).
2. `js/main.js` valida los datos y, con `fetch()`, ejecuta una petición asíncrona `POST` hacia la URL del Webhook de Discord con el contenido en formato JSON.
3. Discord recibe la petición y la notificación se despliega inmediatamente en el canal configurado.

---

## 4. Anexos y Evidencias Gráficas

*(Consultar la Sección 5 de la guía para el detalle de las 5 capturas obligatorias)*

![Notificación del webhook en Discord](img/discord.png) 
![Estado del despliegue en Vercel](img/vercel.png) 
[Capturas restantes según la guía]

---

## 5. Conclusiones y Autoevaluación

* **Desafíos enfrentados:** [Por ejemplo: conectar el formulario con el webhook de Discord, hacer el selector de idioma, lograr que el modo oscuro se viera bien en todas las páginas, o adaptar el sitio a celular.]
* **Aprendizajes clave:** [Por ejemplo: uso de Git y GitHub con commits periódicos, publicar con Vercel, manipular el DOM, usar `fetch` y JSON, y organizar un proyecto en carpetas de CSS, JS e imágenes.]

---

## Estructura del proyecto

```
index.html  javascript.html  jquery.html  json.html  hosting.html  herramientas.html  cuestionario.html
logo.svg
css/
  estilos.css     base: colores, tipografía, encabezado, estructura
  tema.css        modo oscuro
  extras.css      carrusel, inicio, herramientas, cuestionario, avisos, responsive
js/
  main.js         demos de JS y jQuery, formulario de contacto, carrusel y cuestionario
  herramientas.js las 15 herramientas de Google (buscador, filtros y ventana)
  tema.js         botón de modo claro / oscuro
  musica.js       botón de música de fondo
  idioma.js       botón EN / ES
img/              fotos y capturas de pantalla
audio/            música opcional
```

## Cómo verlo

Abre `index.html` en el navegador o visita https://files-navy-iota.vercel.app/index.html 