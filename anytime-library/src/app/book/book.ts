/* Defines the Book entity */
interface IndustryIdentifiers {
    type: string; // ISBN_10, ISBN_13 etc.
    identifier: string;
}


export interface Book {
    id: string;
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    categories: string[];
    pageCount: number;
    averageRating: number;
    ratingsCount: number;
    thumbnail: string;
    language: string;
    identifiers: IndustryIdentifiers[];
}

export class Book {
    id: string;
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    categories: string[];
    pageCount: number;
    averageRating: number;
    ratingsCount: number;
    thumbnail: string;
    language: string;
    identifiers: IndustryIdentifiers[];
}
