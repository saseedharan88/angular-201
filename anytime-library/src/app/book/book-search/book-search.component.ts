import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../service/book.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
    bookId: string;
}

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {

  bookSearchForm: FormGroup;
  booksVolume: any = [];
  books: any[] = [];

  bookId: string;
  constructor(private fb: FormBuilder, private bookService: BookService, public dialog: MatDialog) { }

  ngOnInit() {
    this.bookSearchForm = this.fb.group({
      isbn: ['', [Validators.minLength(3)]],
      title: ['', []],
      author: ['', []]
    });
  }

  searchBooks() {
      return this.bookService.searchBooks(this.bookSearchForm.value).subscribe((data: {}) => {
          this.booksVolume = data;
          this.books = this.booksVolume.items;
      });
  }

  openDialog(): void {
      const dialogRef = this.dialog.open(BookAddDialogComponent, {
          width: '250px',
          data: {bookId: this.bookId}
      });

      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
      });
  }

}


// Dialog box form to add book to application.
@Component({
    selector: 'app-add-more-details',
    templateUrl: './book-add-details.html',
    styleUrls: ['./book-search.component.scss']
})
export class BookAddDialogComponent implements OnInit {

    addToLibraryForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<BookAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder,
        private bookService: BookService) {}

    ngOnInit() {
        this.addToLibraryForm = this.fb.group({
            bookId: ['', []],
            copies: ['', []],
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    updateBookCopies() {
        console.log("this.addToLibraryForm.value:"+this.addToLibraryForm.value);
        // return this.bookService.searchBooks(this.bookSearchForm.value).subscribe((data: {}) => {
        //     this.booksVolume = data;
        //     this.books = this.booksVolume.items;
        // });
    }

}
