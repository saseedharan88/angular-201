import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Book } from './book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  books: any = [];

  constructor(private http: HttpClient) { }

    getBooks() {
        return this.http.get('http://55.55.55.5:3000/books').subscribe((res: {}) => {
            console.log('Res:' + res);
            this.books = res;
        });
    }

    searchBooks(args) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const params = new HttpParams().set('isbn', args.isbn).set('title', args.title).set('author', args.author);
        return this.http.get('http://55.55.55.5:3000/search-books', { params: params }).subscribe((res: {}) => {
            this.books = res;
        });
    }

    // getBook(id: number): Observable<Book> {
    //     return this.http.get('http://55.55.55.5:3000/books').pipe(
    //         tap(data => console.log(JSON.stringify(data))),
    //         catchError(this.handleError)
    //     );
    // }
}
