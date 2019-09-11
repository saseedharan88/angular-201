import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookAddComponent } from './book-add/book-add.component';
import { BookSearchComponent } from './book-search/book-search.component';

const routes: Routes = [
    { path: 'books/:bookid/details', component: BookDetailComponent },
    { path: 'books/:filter_by/:filter_value', component: BooksComponent },
    { path: 'books/search', component: BookSearchComponent },
    { path: 'books/add', component: BookAddComponent },
    { path: 'books/:id/edit', component: BookEditComponent },
    { path: 'books', component: BooksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
