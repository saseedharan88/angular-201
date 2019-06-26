import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';

import { Observable } from 'rxjs';

import { Book } from '../book';
import {BookService} from './book.service';

@Injectable({
  providedIn: 'root'
})
export class BookResolverService implements Resolve<Book> {

  constructor(private bookService: BookService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Book> {
    // const isbn = +route.paramMap.get('isbn');
    // return this.bookService.getBookByIsbn(isbn);
    return null;
  }
}
