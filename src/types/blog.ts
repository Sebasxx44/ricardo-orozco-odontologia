export interface BlogReference {
  title: string;
  url: string;
}

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
}

export interface BlogArticle {
  slug: string;
  path: string;
  title: string;
  originalTitle: string;
  publishedAt: string;
  date: string;
  category: "Noticias";
  categoryPath: "/blog/c/new";
  topic: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  sourceImage: string;
  sourceUrl: string;
  sections: readonly BlogSection[];
  references: readonly BlogReference[];
  tags: readonly string[];
  originalReadingMinutes: number;
}
