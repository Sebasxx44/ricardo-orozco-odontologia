export const normalizeBlogQuery = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('es')
  .trim();

export const matchesBlogQuery = (text: string, query: string): boolean => {
  const normalized = normalizeBlogQuery(text);
  return normalizeBlogQuery(query).split(/\s+/).filter(Boolean).every((word) => normalized.includes(word));
};

export const blogPagePath = (base: string, page: number, query = ''): string => {
  const path = page === 1 ? base : `${base}/page/${page}`;
  return query ? `${path}?${new URLSearchParams({ q: query })}` : path;
};
