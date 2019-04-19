import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Book } from '../book';
import {BookService} from '../book.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {

  bookSearchForm: FormGroup;
  book = new Book();

  constructor(private fb: FormBuilder, private bookService: BookService) { }

  ngOnInit() {
    this.bookSearchForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', [Validators.required]],
      author: ['', [Validators.required]]
    });
  }

  searchBooks() {
    console.log(JSON.stringify(this.bookSearchForm.value));
    this.bookService.searchBooks(this.bookSearchForm.value);
  }

}
