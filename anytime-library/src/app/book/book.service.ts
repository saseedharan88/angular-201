import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getBooks() {
    return this.http.get('http://55.55.55.5:3000/books').subscribe(res => {
      console.log('Res:' + res);
    });
  }
}
