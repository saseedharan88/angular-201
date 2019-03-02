import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatMenuModule, MatTabsModule, MatInputModule, MatCardModule } from '@angular/material';

import { BookService } from './book.service';

import { BookRoutingModule } from './book-routing.module';
import { BooksComponent } from './books/books.component';

import { SharedModule } from '../shared/shared.module';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';

@NgModule({
  declarations: [BooksComponent, BookDetailComponent, BookEditComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BookRoutingModule,
    SharedModule,
    MatCardModule
  ],
  providers: [
    BookService
  ]
})
export class BookModule { }
