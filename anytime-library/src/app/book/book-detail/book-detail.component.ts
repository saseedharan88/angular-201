import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  bookId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
  }

}
