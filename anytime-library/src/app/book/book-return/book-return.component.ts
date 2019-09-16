import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {BookService} from "../service/book.service";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-book-return',
  templateUrl: './book-return.component.html',
  styleUrls: ['./book-return.component.scss']
})
export class BookReturnComponent implements OnInit {

  borrowReturnForm: FormGroup;
  emailMessage: string;
  bookId: string;
  book: any;
  availCopies: number;
  availableCopies;

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };


  constructor(private route: ActivatedRoute, private fb: FormBuilder, private bookService: BookService) { }

  ngOnInit() {
    this.borrowReturnForm = this.fb.group({
      userId: {value: ''},
      bookId: {value: ''},
      bookName: {value: '', disabled: true},
      bookAuthor: {value: '', disabled: true},
      copiesBorrow: '',
      termsAndConditions: true,
      phone: '',
      notification: 'email',
      // Move the below field to book return form.
      feedback: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.borrowReturnForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.borrowReturnForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl)
    );

    this.route.paramMap.subscribe(
      params => {
        this.bookId = params.get('bookid');
        // Get book details by ID.
        this.bookService.getBookDetails(this.bookId).subscribe((data: {}) => {
          if (data !== null && Object.keys(data).length !== 0) {
            // Book details available.
            this.book = data;
            this.populateBookData(this.book);
          }
        });
      }
    );
  }

  save() {
    this.bookService.borrowBook(this.borrowReturnForm.value);
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.borrowReturnForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  populateBookData(book): void {
    // Get Book details by ID.
    let author = '';
    book.authors.forEach((value, index) => {
      author += value.name;
      if ((index + 1) < book.authors.length) {
        author += ', ';
      }
    });

    this.borrowReturnForm.patchValue({
      bookId: book.bookId,
      bookName: book.title,
      bookAuthor: author
    });

    this.availCopies = book.copies;
    if (typeof book.copiesIssued !== 'undefined') {
      this.availCopies = book.copies - book.copiesIssued;
    }

    const arrayCopies = [];
    for (let i = 1; i <= this.availCopies; i++) {
      arrayCopies.push(i);
    }
    this.availableCopies = arrayCopies;
  }

}
