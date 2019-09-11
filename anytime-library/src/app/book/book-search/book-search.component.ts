import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {BookService} from '../service/book.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  bookId: string;
  copies: string;
  genre: any;
  authors: any;
  title: string;
  subtitle: string;
  publisher: string;
  publishedDate: string;
  description: string;
  thumbnail: string;
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
  book: any;

  constructor(private fb: FormBuilder, private bookService: BookService, public dialog: MatDialog) {
  }

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

  openDialog(bookId, volumeInfo): void {
    // Fetch book details from database.
    this.bookService.getBookDetails(bookId).subscribe((data: {}) => {
      let copies = 0;
      if (data !== null && Object.keys(data).length !== 0) {
        // Book details available.
        this.book = data;
        copies = this.book.copies;
      }
      const dialogRef = this.dialog.open(BookAddDialogComponent, {
        width: '600px',
        data: {
          bookId: bookId,
          copies: copies,
          genre: volumeInfo.categories,
          authors: volumeInfo.authors,
          title: volumeInfo.title,
          subtitle: volumeInfo.subtitle,
          publisher: volumeInfo.publisher,
          publishedDate: volumeInfo.publishedDate,
          description: volumeInfo.description,
          thumbnail: volumeInfo.imageLinks.thumbnail
        }
      });

      dialogRef.afterClosed().subscribe(result => {
      });

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
  message: string;
  success: boolean;

  constructor(
    public dialogRef: MatDialogRef<BookAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private bookService: BookService) {
  }

  ngOnInit() {
    this.addToLibraryForm = this.fb.group({
      bookId: [this.data.bookId, []],
      copies: [this.data.copies, []],
      genre: [this.data.genre, []],
      authors: [this.data.authors, []],
      title: [this.data.title, []],
      subtitle: [this.data.subtitle, []],
      publisher: [this.data.publisher, []],
      publishedDate: [this.data.publishedDate, []],
      description: [this.data.description, []],
      thumbnail: [this.data.thumbnail, []],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateBookCopies() {
    return this.bookService.updateBookDetails(this.addToLibraryForm.value).subscribe((data: any) => {
      this.data = data.data;
      this.message = data.message;
      this.success = data.success;
    });
  }

  closeAlert() {
    this.success = false;
  }

}
