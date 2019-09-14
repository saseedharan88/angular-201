import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BookService } from '../service/book.service';
import { ActivatedRoute } from '@angular/router';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'app-book-borrow',
  templateUrl: './book-borrow.component.html',
  styleUrls: ['./book-borrow.component.scss']
})
export class BookBorrowComponent implements OnInit {
  borrowBookForm: FormGroup;
  emailMessage: string;
  bookId: string;
  book: any;
  availableCopies = [];

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };


  constructor(private route: ActivatedRoute, private fb: FormBuilder, private bookService: BookService) { }

  ngOnInit() {
    this.borrowBookForm = this.fb.group({
      userId: {value: ''},
      bookId: {value: ''},
      bookName: {value: '', disabled: true},
      bookAuthor: {value: '', disabled: true},
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, { validator: emailMatcher }),
      copiesBorrow: '',
      termsAndConditions: true,
      phone: '',
      notification: 'email',
      // Move the below field to book return form.
      feedback: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.borrowBookForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.borrowBookForm.get('emailGroup.email');
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
    this.bookService.borrowBook(this.borrowBookForm.value);
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.borrowBookForm.get('phone');
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

    this.borrowBookForm.patchValue({
      bookId: book.bookId,
      bookName: book.title,
      bookAuthor: author
    });

    this.availableCopies = book.copies;
    if (typeof book.copiesIssued !== 'undefined') {
      this.availableCopies = book.copies - book.copiesIssued;
    }
    this.availableCopies = Array(this.availableCopies).fill().map((x, i) => i + 1);
  }

}
