import { Component, Inject, OnInit } from '@angular/core';
import { BookService } from '../../book/service/book.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

export interface DialogData {
  issueRegisterId: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns;
  dataSource;
  constructor(private bookService: BookService, public dialog: MatDialog) { }

  ngOnInit() {

    this.displayedColumns = [ 'title', 'copiesissued', 'issueddate',
      'returneddate', 'issueRegisterId'];
    const dSource = [];

    this.bookService.getIssuesLog('filterBy', 'userId').subscribe((data: any) => {

      data.forEach((value) => {
        const detail: any = {};
        detail.issueRegisterId = value._id;
        detail.bookId = value.bookId;
        detail.title = value.bookDetails[0].title;
        detail.copies = value.bookDetails[0].copies;
        detail.copiesissued = value.copies;
        detail.copiesavilable = (value.bookDetails[0].copies - value.copies);
        detail.issuedstatus = value.issueStatus;
        detail.issueddate = value.issueDate;
        detail.returneddate = value.returnDate;
        if (typeof value.userDetails[0] !== 'undefined')
          detail.borrower = value.userDetails[0].email;
        dSource.push(detail);
      });
      this.dataSource = dSource;
    });
  }

  openDialog(issueRegisterId): void {
    // Get return feedback.
    const dialogRef = this.dialog.open(BookReturnDialogComponent, {
      width: '600px',
      data: {
        issueRegisterId: issueRegisterId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}


// Dialog box form to add book to application.
@Component({
  selector: 'app-book-return',
  templateUrl: './book-return.html',
  styleUrls: ['./dashboard.component.scss']
})
export class BookReturnDialogComponent implements OnInit {

  bookReturnForm: FormGroup;
  message: string;
  success: boolean;

  constructor(
    public dialogRef: MatDialogRef<BookReturnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private bookService: BookService) {
  }

  ngOnInit() {
    this.bookReturnForm = this.fb.group({
      issueRegisterId: [this.data.issueRegisterId, []],
      feedback: ['', []]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  returnBook() {
    return this.bookService.returnBook(this.bookReturnForm.value).subscribe((data: any) => {
      this.data = data.data;
      this.message = data.message;
      this.success = data.success;
    });
  }

  closeAlert() {
    this.success = false;
  }

}
