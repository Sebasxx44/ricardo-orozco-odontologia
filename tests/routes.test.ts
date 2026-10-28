import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const output = resolve('dist');
const scan = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? scan(resolve(directory, entry.name)) : [resolve(directory, entry.name)]);
const pages = existsSync(output) ? scan(output).filter((file) => file.endsWith('.html')) : [];
const getPage = (pathname: string): string => resolve(output, pathname === '/' ? 'index.html' : `${pathname.replace(/^\//, '').replace(/\/$/, '')}.html`);

test('conserva las seis páginas originales y los diecisiete artículos', () => {
  for (const route of ['/inicio', '/hoja-de-vida', '/servicios', '/prevencion-oral', '/blog', '/contacto', '/blog/c/new']) assert.ok(existsSync(getPage(route)), route);
  assert.equal(pages.filter((file) => relative(output, file).startsWith('blog/b/')).length, 17);
});

test('cada página ofrece un único título principal y metadatos propios', () => {
  assert.ok(pages.length >= 25);
  const titles = new Set<string>();
  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, relative(output, page));
    assert.match(html, /<html[^>]+lang="es"/);
    assert.match(html, /name="description"/);
    if (!page.endsWith('/index.html')) {
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
      assert.ok(title);
      assert.ok(!titles.has(title), `Título repetido: ${title}`);
      titles.add(title);
    }
  }
});

test('todos los enlaces locales y las imágenes apuntan a recursos publicados', () => {
  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const raw = match[1];
      if (!raw.startsWith('/') || raw.startsWith('//')) continue;
      const pathname = raw.split(/[?#]/)[0];
      const local = resolve(output, pathname.slice(1));
      assert.ok(existsSync(local) || existsSync(getPage(pathname)), `${relative(output, page)} → ${raw}`);
    }
  }
});

test('los formularios no simulan una cita confirmada ni envían datos sin continuar', () => {
  const html = readFileSync(getPage('/contacto'), 'utf8');
  assert.match(html, /id="contact-form"/);
  assert.match(html, /id="contact-review"[^>]*hidden|hidden[^>]*id="contact-review"/);
  assert.match(html, /id="contact-whatsapp"/);
  assert.match(html, /name="consent"/);
});
