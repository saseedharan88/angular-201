import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Author, Book, Genre } from '../book';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import {AppConstants} from '../../appConstants';
// import {forEach} from "@angular/router/src/utils/collection";

const headers = new HttpHeaders({
  'Content-type': 'application/json',
});

@Injectable({
  providedIn: 'root'
})
export class BookService {
  books: any = [];
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = AppConstants.apiUrl;
  }

  getBooks() {
    return this.http.get(this.apiUrl + '/books').subscribe((res: {}) => {
      console.log('Res:' + res);
      this.books = res;
    });
  }

  // searchBooks(args) {
  //     const headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     const params = new HttpParams().set('isbn', args.isbn).set('title', args.title).set('author', args.author);
  //     return this.http.get('http://55.55.55.5:3000/search-books', { params: params }).subscribe((res: {}) => {
  //         this.books = res;
  //     });
  // }

  // Error handling.
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  // HttpClient API get() method => Search books.
  searchBooks(args): Observable<any> {
    const params = new HttpParams().set('isbn', args.isbn).set('title', args.title).set('author', args.author);
    return this.http.get(this.apiUrl + '/search-books', {params: params})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Update book details to mongodb.
  updateBookDetails(args): Observable<any> {

    console.log("args:: "+JSON.stringify(args));
    const bookDetail = new Book();
    bookDetail.bookId = args.bookId;
    bookDetail.copies = args.copies;
    const authors = [];
    args.authors.forEach((value) => {
      const author = new Author();
      author.name = value;
      authors.push(author);
    });
    bookDetail.authors = authors;
    const genres = [];
    args.genre.forEach((value) => {
      const genre = new Genre();
      genre.name = value;
      genres.push(genre);
    });
    bookDetail.genre = genres;
    bookDetail.title = args.title;
    bookDetail.subtitle = args.subtitle;
    bookDetail.publisher = args.publisher;
    bookDetail.publishedDate = args.publishedDate;
    bookDetail.description = args.description;
    bookDetail.thumbnail = args.thumbnail;
    console.log("args bk:: "+JSON.stringify(bookDetail));
    return this.http.post<any>(this.apiUrl + '/update-book-details', bookDetail, {headers: headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get individual book inventory details by ID.
  getBookDetails(bookId: string): Observable<any> {
    const params = new HttpParams().set('bookId', bookId);
    return this.http.get(this.apiUrl + '/book/inventory/details', {params: params})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
}
