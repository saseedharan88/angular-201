import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthGuard } from './user/auth.guard';
import { BooksComponent } from './book/books/books.component';

const routes: Routes = [
    { path: 'books', canActivate: [AuthGuard], component: BooksComponent },
    { path: '', redirectTo: 'books', pathMatch: 'full' },
    { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
