import { Component, OnInit } from '@angular/core';
import { BookService } from '../../book/service/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns;
  dataSource;
  constructor(private bookService: BookService) { }

  ngOnInit() {

    this.displayedColumns = [ 'title', 'copiesissued',
      'issuedstatus', 'issueddate',
      'returneddate', 'borrower'];
    const dSource = [];

    this.bookService.getIssuesLog('filterBy', 'userId').subscribe((data: any) => {

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
