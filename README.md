# Ricardo Orozco · Odontología

Rediseño conceptual en español del sitio del Dr. Ricardo Orozco, preparado como proyecto de portfolio. Conserva las seis páginas principales, la categoría Noticias y las rutas de sus 17 artículos; reorganiza el contenido con una identidad visual nueva.

## Desarrollo

Node24+, `npm install`, `npm run dev`. La salida estática se genera con `npm run build` en `dist/`. Verificaciones: `npm run typecheck` y, después de compilar, `npm test`.

## Experiencia

Astro7, TypeScript6, CSS y vectores SVG propios. Camino dibujado con el scroll, aparición progresiva y parallax ligero limitados a30fps; respeta movimiento reducido y pausa la animación fuera de vista. No se carga React ni WebGL. Fuente Manrope alojada localmente.

El formulario valida los campos en el navegador, presenta una revisión y prepara un enlace al WhatsApp publicado por el consultorio. No registra ni transmite datos al preparar la solicitud; el visitante decide si continúa y envía el mensaje. No confirma citas ni disponibilidad.

## Contenido y activos

Información base: [sitio original](https://www.odontologoricardoorozco.com/inicio). La hoja de vida mantiene formación y cursos; las cifras se atribuyen al sitio original. Las reseñas se presentan como resúmenes. Los textos educativos se reorganizaron y enlazan referencias odontológicas oficiales.

Las fotografías reales proceden del sitio original y se documentan en `public/images/asset-manifest.json`; los artículos conservan los enlaces a sus fuentes en los datos del blog. Las ilustraciones de portada y del recorrido son SVG de código. No se atribuye al doctor la ilustración de los profesionales del hero.

Publicación de muestra independiente del dominio original: [Vercel](https://ricardo-orozco-sebaz.vercel.app).
