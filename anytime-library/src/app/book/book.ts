export class Book {
  bookId: string;
  copies: string;
  authors: Author[];
  genre: Genre[];
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  publisher: string;
  publishedDate: string;
}

export class Author {
  name: string;
}

export class Genre {
  name: string;
}
