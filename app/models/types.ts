export interface Article {
  id: number;
  title: string;
  content: string;
}

export interface Book {
  id: number;
  name: string;
  articles: Array<Article>;
}
