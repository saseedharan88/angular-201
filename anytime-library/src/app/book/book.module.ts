import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatMenuModule, MatTabsModule, MatInputModule, MatCardModule } from '@angular/material';

import { ReactiveFormsModule } from '@angular/forms';

import { BookService } from './book.service';

import { BookRoutingModule } from './book-routing.module';
import { BooksComponent } from './books/books.component';

import { SharedModule } from '../shared/shared.module';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookAddComponent } from './book-add/book-add.component';
import { BookSearchComponent } from './book-search/book-search.component';

@NgModule({
  declarations: [
    BooksComponent,
    BookDetailComponent,
    BookEditComponent,
    BookAddComponent,
    BookSearchComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BookRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatInputModule,
    MatCardModule
  ],
  providers: [
    BookService
  ]
})
export class BookModule { }
