import { blogPagePath, matchesBlogQuery } from '@/composables/blog/blogSearch';

export const initBlogArchive = (): void => {
  const archive = document.querySelector<HTMLElement>('[data-blog-archive]');
  const input = archive?.querySelector<HTMLInputElement>('[data-blog-query]');
  if (!archive || !input) return;

  // Collection and controls
  const base = archive.dataset.blogBase ?? '/blog';
  const cards = [...archive.querySelectorAll<HTMLElement>('[data-blog-card]')];
  const pageLinks = [...archive.querySelectorAll<HTMLAnchorElement>('[data-blog-page]')];
  const previous = archive.querySelector<HTMLAnchorElement>('[data-blog-direction="previous"]');
  const next = archive.querySelector<HTMLAnchorElement>('[data-blog-direction="next"]');
  const clear = archive.querySelector<HTMLButtonElement>('[data-blog-clear]');
  const status = archive.querySelector<HTMLElement>('[data-blog-status]');
  const empty = archive.querySelector<HTMLElement>('[data-blog-empty]');
  const pagination = archive.querySelector<HTMLElement>('[data-blog-pagination]');
  const form = archive.querySelector<HTMLFormElement>('[data-blog-search-form]');
  const pageSize = 6;
  let page = Number(archive.dataset.blogInitialPage) || 1;
  input.value = new URLSearchParams(window.location.search).get('q') ?? '';
  if (form) form.hidden = false;

  // Rendering
  const setDirectionalLink = (link: HTMLAnchorElement | null, target: number, disabled: boolean): void => {
    if (!link) return;
    link.href = blogPagePath(base, target, input.value.trim());
    if (disabled) { link.setAttribute('aria-disabled', 'true'); link.tabIndex = -1; }
    else { link.removeAttribute('aria-disabled'); link.removeAttribute('tabindex'); }
  };
  const render = (): void => {
    const query = input.value.trim();
    const matched = cards.filter((card) => matchesBlogQuery(card.dataset.blogSearch ?? '', query));
    const pages = Math.max(1, Math.ceil(matched.length / pageSize));
    page = Math.max(1, Math.min(page, pages));
    const visible = new Set(matched.slice((page - 1) * pageSize, page * pageSize));
    cards.forEach((card) => { card.hidden = !visible.has(card); });
    pageLinks.forEach((link) => {
      const number = Number(link.dataset.blogPage);
      link.hidden = number > pages;
      link.href = blogPagePath(base, number, query);
      if (number === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    setDirectionalLink(previous, Math.max(1, page - 1), page === 1);
    setDirectionalLink(next, Math.min(pages, page + 1), page === pages);
    if (pagination) pagination.hidden = matched.length === 0;
    if (empty) empty.hidden = matched.length > 0;
    if (clear) clear.hidden = !query;
    if (status) status.textContent = matched.length
      ? `Mostrando ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, matched.length)} de ${matched.length} ${matched.length === 1 ? 'artículo' : 'artículos'}${query ? ` para «${query}»` : ''}`
      : `No encontramos artículos para «${query}».`;
  };
  const updateAddress = (push: boolean): void => {
    const path = `${blogPagePath(base, page, input.value.trim())}#articulos`;
    if (push) window.history.pushState(null, '', path);
    else window.history.replaceState(null, '', path);
  };
  const focusResults = (): void => {
    archive.querySelector<HTMLElement>('#blog-library-title')?.focus({ preventScroll: true });
    archive.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  // Events
  input.addEventListener('input', () => { page = 1; render(); updateAddress(false); });
  const reset = (): void => { input.value = ''; page = 1; render(); updateAddress(false); input.focus({ preventScroll: true }); };
  clear?.addEventListener('click', reset);
  archive.querySelector('[data-blog-reset]')?.addEventListener('click', reset);
  form?.addEventListener('submit', (event) => { event.preventDefault(); render(); focusResults(); });
  pagination?.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (link.getAttribute('aria-disabled') === 'true') return;
    page = link.dataset.blogPage ? Number(link.dataset.blogPage) : page + (link.dataset.blogDirection === 'previous' ? -1 : 1);
    render(); updateAddress(true); focusResults();
  });
  window.addEventListener('popstate', () => {
    input.value = new URLSearchParams(window.location.search).get('q') ?? '';
    page = Number(window.location.pathname.match(/\/page\/(\d+)\/?$/)?.[1]) || 1;
    render();
  });
  render();
};
