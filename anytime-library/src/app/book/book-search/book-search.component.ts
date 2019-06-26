import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../service/book.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
    animal: string;
    name: string;
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

  animal: string;
  name: string;
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
          data: {name: this.name, animal: this.animal}
      });

      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.animal = result;
      });
  }

}


// Dialog box form to add book to application.
@Component({
    selector: 'app-add-more-details',
    templateUrl: './book-add-details.html',
    styleUrls: ['./book-search.component.scss']
})
export class BookAddDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<BookAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

}
