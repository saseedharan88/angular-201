// export class BookInfo {
//     title: string;
//     subtitle: string;
//     authors: string[];
//     imageLinks: ImageLinks;
//     publisher: string;
//     publishedDate: string;
// }
//
// export class ImageLinks {
//     smallThumbnail: string;
//     thumbnail: string;
// }


export class Book {
    kind: string;
    id: string;
    etag: string[];
    selfLink: string;
    // volumeInfo: BookInfo;
    // description: string;
    // categories: string[];
    // pageCount: number;
    // averageRating: number;
    // ratingsCount: number;
    // thumbnail: string;
    // language: string;
    // identifiers: IndustryIdentifiers[];
}

export class BooksVolume {
    kind: string;
    totalItems: number;
    items: Book[];
}

// export class Book {
//     id: string;
//     title: string;
//     authors: string[];
//     publisher: string;
//     publishedDate: string;
//     description: string;
//     categories: string[];
//     pageCount: number;
//     averageRating: number;
//     ratingsCount: number;
//     thumbnail: string;
//     language: string;
//     identifiers: IndustryIdentifiers[];
// }
