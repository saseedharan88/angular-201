import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BooksComponent } from './books/books.component';

import { SharedModule } from '../shared/shared.module';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';

@NgModule({
  declarations: [BooksComponent, BookDetailComponent, BookEditComponent],
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
  ]
})
export class BookModule { }
