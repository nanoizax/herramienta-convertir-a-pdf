# Convertir a PDF

Convierte Word, TXT e imágenes a PDF dentro de tu navegador. Sin subir archivos ni registrarte.

Herramienta gratuita y de código abierto de [SonhoLab](https://sonholab.com). Corre **100 % en el navegador**: los archivos no se suben a ningún servidor.

> Licencia: **MIT** · Autor: Leandro Manuel Perez Montañana · Idiomas de la interfaz: español, inglés, francés, portugués (BR), alemán, hindi, indonesio y ruso.

## Qué hace

Esta herramienta convierte documentos de Word, archivos de texto e imágenes en un PDF listo para enviar. Todo ocurre dentro de tu navegador, así que el archivo no se sube a ningún servidor. Sirve cuando te piden algo en PDF y no tienes ningún programa instalado para hacerlo.

**Cuándo te sirve:**

- En el colegio piden la tarea en PDF y tu hijo la escribió en Word: la conviertes y la envías sin instalar nada.
- Vendes por WhatsApp y el cliente pide la lista de precios en PDF: conviertes el Word y la mandas en el mismo chat.
- Escaneaste con el celular una factura o un contrato y quedó en JPG: lo pasas a PDF antes de subirlo al sistema.

## Cómo se usa

1. **Elige tu archivo.** Arrastra el documento o la imagen al recuadro, o haz clic para buscarlo en tu equipo. Acepta Word (.docx), texto (.txt) e imágenes JPG, PNG y WEBP.
2. **Revisa el resultado.** La conversión se hace al instante en tu navegador, sin cola de espera. Mira cómo quedó el PDF y, si elegiste el archivo equivocado, cámbialo y prueba otra vez.
3. **Descarga el PDF.** Haz clic en descargar y el PDF queda guardado en tu equipo, sin marca de agua. Si necesitas convertir otro archivo, repite el proceso las veces que quieras.

## Qué necesita para funcionar

### Para instalarla y compilarla

- [Node.js](https://nodejs.org) 18 o superior (probado con Node 22) y npm.
- Conexión a internet **solo** durante `npm install`. Una vez compilada, la herramienta no pide nada a internet.

### Complementos específicos de esta herramienta

- **Ninguno.** No usa modelos, binarios ni servicios externos: todo está en el código y en dependencias normales de npm.

### En el navegador de quien la usa

- Cualquier navegador moderno (Chrome, Edge, Firefox, Safari). No necesita permisos especiales.

## Instalación

```bash
git clone https://github.com/nanoizax/herramienta-convertir-a-pdf.git
cd herramienta-convertir-a-pdf
npm install
npm run dev         # servidor de desarrollo en http://localhost:5173
```

Para publicarla:

```bash
npm run build       # genera la carpeta dist/
npm run preview     # probar la versión compilada
```

Esta herramienta **no tiene servidor propio**: todo ocurre en el navegador de quien la usa. Basta con publicar la carpeta `dist/` en cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages, Nginx, Apache...).

## Cómo está organizado

```
src/pages/tools/   La página de la herramienta (interfaz y lógica de pantalla)
src/lib/tools/     La lógica de la herramienta, separada de la interfaz
src/components/    Piezas compartidas (zona de arrastre de archivos, botón)
src/locales/       Textos en 8 idiomas (esta herramienta solamente)
src/i18n.ts        Configuración de idiomas
```

## Cómo meterla en tu propia plataforma

1. **Como página aparte:** publica `dist/` en una ruta de tu sitio, por ejemplo `/herramientas/convertir-a-pdf/`. Si la sirves en una subcarpeta, define `base` en `vite.config.ts`.
2. **Dentro de tu aplicación React:** copia `src/pages/tools/*Page.tsx`, `src/lib/tools/` y `src/components/` a tu proyecto, instala las mismas dependencias de `package.json` y renderiza la página donde quieras.
3. **Con tu diseño:** el marco de la página (título, ayuda, preguntas frecuentes) está en `src/components/tools/ToolPageLayout.tsx` y es intencionalmente simple. Cámbialo por tu cabecera, tu pie y tus estilos; solo necesita pintar `children`.
4. **Con tu analítica:** `src/lib/hitCounter.ts` no hace nada. Si quieres medir el uso, conéctalo ahí a tu propia herramienta.

## Privacidad

Todo el procesamiento ocurre en el navegador. Esta copia no incluye analítica, cookies, contadores ni llamadas a ningún servidor propio. Los archivos del usuario no salen de su equipo.

## Preguntas frecuentes

**¿Mis archivos se suben a algún servidor?**  
No. La conversión ocurre completa dentro de tu navegador, con el archivo que ya está en tu equipo. No pasa por nuestros servidores ni por los de nadie más, así que puedes convertir contratos, facturas o documentos con datos personales sin exponerlos.

**¿Es gratis? ¿Hay límite de archivos?**  
Es gratis y no hay límite: puedes convertir todos los archivos que necesites, uno tras otro, sin cuenta, sin marca de agua y sin cola de espera. Como el trabajo lo hace tu propio equipo y no un servidor nuestro, no tenemos un costo por archivo que cobrarte.

**¿Se conserva el formato del documento de Word?**  
Solo en parte. Tomamos el texto del .docx y lo pasamos al PDF, así que las tablas complejas, las columnas y algunos estilos no se mantienen igual. Para un texto corrido funciona bien; si el diseño importa mucho, revisa el resultado antes de enviarlo.

**¿Qué archivos puedo convertir a PDF?**  
Word (.docx), texto plano (.txt) e imágenes en JPG, PNG y WEBP. Las imágenes se normalizan a PNG antes de incrustarlas, para que se vean igual en cualquier lector. Otros formatos, como Excel o PowerPoint, todavía no están soportados.

**¿Necesito instalar algo o crear una cuenta?**  
Ninguna de las dos cosas. Abre la página, elige el archivo y descarga el PDF. No pedimos correo ni creamos cuentas, y no hay nada que instalar: funciona en el navegador que ya tienes, tanto en la computadora como en el celular.

## Licencia

Este proyecto se publica bajo la licencia **MIT**. El texto completo está en [LICENSE](LICENSE).

Las dependencias tienen sus propias licencias, listadas en [THIRD-PARTY.md](THIRD-PARTY.md).

## Más herramientas gratuitas

Esta es una de las herramientas gratuitas de SonhoLab. Encuentra el resto, cada una con su repositorio, en https://sonholab.com/es/herramientas.

---

Hecho por Leandro Manuel Perez Montañana.
