import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BookService } from './service/book.service';
import { BookRoutingModule } from './book-routing.module';
import { BooksComponent } from './books/books.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookAddComponent } from './book-add/book-add.component';
import { BookSearchComponent, BookAddDialogComponent } from './book-search/book-search.component';
import { BookBorrowComponent } from './book-borrow/book-borrow.component';
import { BooksManageComponent } from './books-manage/books-manage.component';

@NgModule({
  declarations: [
    BooksComponent,
    BookDetailComponent,
    BookEditComponent,
    BookAddComponent,
    BookSearchComponent,
    BookAddDialogComponent,
    BookBorrowComponent,
    BooksManageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BookRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  entryComponents: [
    BookAddDialogComponent
  ],
  providers: [
    BookService
  ]
})
export class BookModule { }
