import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  bookId: string;
  bookName: string;
  bookCode: string;
  bookAuthor: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');

    // Retrieving query params.
    this.bookName = this.route.snapshot.queryParamMap.get('name') || '';
    this.bookCode = this.route.snapshot.queryParamMap.get('code') || '';
    this.bookAuthor = this.route.snapshot.queryParamMap.get('author') || '';
  }

}
