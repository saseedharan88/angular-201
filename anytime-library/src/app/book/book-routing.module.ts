import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookAddComponent } from './book-add/book-add.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { BooksManageComponent } from './books-manage/books-manage.component';
import { AuthGuard } from '../user/auth.guard';
import {BookBorrowComponent} from './book-borrow/book-borrow.component';

const routes: Routes = [
    { path: 'books/:bookid/borrow', canActivate: [AuthGuard], component: BookBorrowComponent },
    { path: 'books/:bookid/details', component: BookDetailComponent },
    { path: 'books/:filter_by/:filter_value', component: BooksComponent },
    { path: 'books/search', canActivate: [AuthGuard], data: { roles: ['admin'] }, component: BookSearchComponent },
    { path: 'books/add', canActivate: [AuthGuard], data: { roles: ['admin'] }, component: BookAddComponent },
    { path: 'books/manage', canActivate: [AuthGuard], data: { roles: ['admin'] }, component: BooksManageComponent },
    { path: 'books/:id/edit', component: BookEditComponent },
    { path: 'books', component: BooksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
