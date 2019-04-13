import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Book } from '../book';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {

  bookSearchForm: FormGroup;
  book = new Book();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.bookSearchForm = this.fb.group({
      title: '',
      author: ''
    });
  }

  searchBooks() {
    console.log(JSON.stringify(this.bookSearchForm.value));
  }

}
