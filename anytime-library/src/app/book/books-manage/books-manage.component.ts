import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../service/book.service';

@Component({
  selector: 'app-books-manage',
  templateUrl: './books-manage.component.html',
  styleUrls: ['./books-manage.component.scss']
})
export class BooksManageComponent implements OnInit {

  displayedColumns;
  dataSource;
  constructor(private route: ActivatedRoute, private bookService: BookService) {
  }

  ngOnInit() {

    this.displayedColumns = [ 'title', 'copiesissued',
      'issuedstatus', 'issueddate',
      'returneddate', 'borrower'];
    const dSource = [];

    this.bookService.getIssuesLog().subscribe((data: any) => {

      data.forEach((value) => {
        console.log(value.bookDetails);
        const detail: any = {};
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
}
