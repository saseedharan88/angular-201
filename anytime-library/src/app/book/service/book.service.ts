import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Author, Book, Genre } from '../book';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import {AppConstants} from '../../appConstants';
import {ActivatedRoute, Router} from '@angular/router';

const headers = new HttpHeaders({
  'Content-type': 'application/json',
});

@Injectable({
  providedIn: 'root'
})
export class BookService {
  books: Array<Book> = [];
  filterList: Array<string> = [];
  apiUrl: string;
  statusMessage: string;
  statusMessageText: string;
  returnUrl: string;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.apiUrl = AppConstants.apiUrl;
  }

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

  // Get Subjects.
  getSubjects() {
    return this.http.get(this.apiUrl + '/library/subjects').subscribe((res: any) => {
      this.filterList = res;
    });
  }

  // Get Authors.
  getAuthors() {
    return this.http.get(this.apiUrl + '/library/authors').subscribe((res: any) => {
      this.filterList = res;
    });
  }

  // Get Books.
  getBooks(filterBy, filterValue): Observable<any> {
    const httpParams = new HttpParams().set('filterBy', filterBy).set('filterValue', filterValue);
    return this.http.get(this.apiUrl + '/library/books', {params: httpParams})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Search books in google book library.
  searchBooks(args): Observable<any> {
    const httpParams = new HttpParams().set('isbn', args.isbn).set('title', args.title).set('author', args.author);
    return this.http.get(this.apiUrl + '/search-books', {params: httpParams})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Update book details to mongodb.
  updateBookDetails(args): Observable<any> {
    const bookDetail = new Book();
    bookDetail.bookId = args.bookId;
    bookDetail.copies = args.copies;
    if (args.authors !== null) {
      const authors = [];
      args.authors.forEach((value) => {
        const author = new Author();
        author.name = value;
        authors.push(author);
      });
      bookDetail.authors = authors;
    }
    if (args.genre !== null) {
      const genres = [];
      args.genre.forEach((value) => {
        const genre = new Genre();
        genre.name = value;
        genres.push(genre);
      });
      bookDetail.genre = genres;
    }
    bookDetail.title = args.title;
    bookDetail.subtitle = args.subtitle;
    bookDetail.publisher = args.publisher;
    bookDetail.publishedDate = args.publishedDate;
    bookDetail.description = args.description;
    bookDetail.thumbnail = args.thumbnail;
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

  // Borrow books.
  borrowBook(borrowData) {
    const issueData: any = {};
    issueData.bookId = borrowData.bookId;
    issueData.issueDate = '';
    issueData.returnDate = '';
    issueData.reviewComment = '';
    issueData.copies = borrowData.copiesBorrow;
    issueData.email = borrowData.email;
    issueData.phone = borrowData.phone;
    issueData.notificationMode = borrowData.notification;
    issueData.rating = '';
    issueData.issueStatus = 'issued';
    this.http.post<any>(this.apiUrl + '/issue-register', issueData).subscribe(res => {
      this.statusMessage = 'success';
      this.statusMessageText = res.message;
    }, res => {
      this.statusMessage = 'error';
      this.statusMessageText = res.error;
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl('/books/' + borrowData.bookId + '/details');
  }

  // Get all issues log.
  getIssuesLog(): Observable<any> {
    return this.http.get(this.apiUrl + '/issue-log')
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

}
