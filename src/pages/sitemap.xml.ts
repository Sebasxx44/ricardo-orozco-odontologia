import type { APIRoute } from 'astro';
import { articles } from '@/data/articles';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/inicio', '/hoja-de-vida', '/servicios', '/prevencion-oral', '/contacto', '/blog', '/blog/c/new', '/blog/page/2', '/blog/page/3', '/blog/c/new/page/2', '/blog/c/new/page/3', ...articles.map((article) => article.path)];
  const entries = paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
