import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../service/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  bookName: string;
  bookAuthor: string;
  bookCode: string;

  constructor(private route: ActivatedRoute, private bookService: BookService) {
    this.bookName = this.route.snapshot.paramMap.get('name');
    this.bookAuthor = this.route.snapshot.paramMap.get('author');
    this.bookCode = this.route.snapshot.paramMap.get('code');
  }

  ngOnInit() {
    this.bookService.getBooks();
  }

}
