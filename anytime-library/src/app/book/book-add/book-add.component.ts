import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Book } from '../book';

@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.scss']
})
export class BookAddComponent implements OnInit {
  bookAddForm: FormGroup;
  book = new Book();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.bookAddForm = this.fb.group({
        id: '',
        title: '',
        authors: '',
        publisher: '',
        publishedDate: '',
        description: '',
        categories: '',
        pageCount: '',
        averageRating: '',
        ratingsCount: '',
        thumbnail: '',
        language: '',
        identifiers: '',
        bookCopies: 10
    });
  }

  save() {
    console.log(this.bookAddForm);
    console.log('Saved:' + JSON.stringify(this.bookAddForm.value));
  }

  populateTestData(): void {
    this.bookAddForm.setValue({
        id: '',
        title: '',
        authors: '',
        publisher: '',
        publishedDate: '',
        description: '',
        categories: '',
        pageCount: '',
        averageRating: '',
        ratingsCount: '',
        thumbnail: '',
        language: '',
        identifiers: '',
        bookCopies: 10
    });
  }

  populateOnlyName(): void {
    this.bookAddForm.patchValue({
        id: '',
        title: '',
        authors: '',
        publisher: '',
        publishedDate: '',
        description: '',
        categories: '',
        pageCount: '',
        averageRating: '',
        ratingsCount: '',
        thumbnail: '',
        language: '',
        identifiers: '',
        bookCopies: 10
    });
  }

}
