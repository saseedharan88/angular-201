import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../service/book.service';
import { UserAuthService } from '../../userauth.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  bookId: string;
  book: any;
  dataLoaded = false;
  constructor(private route: ActivatedRoute, private bookService: BookService, private userAuthService: UserAuthService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.bookId = params.get('bookid');
        // Get book details by ID.
        this.bookService.getBookDetails(this.bookId).subscribe((data: {}) => {
          if (data !== null && Object.keys(data).length !== 0) {
            // Book details available.
            this.dataLoaded = true;
            this.book = data;
            console.log("c:" + JSON.stringify(this.book));
          }
        });
      }
    );
  }

  borrowBook() {
    alert("Borrow Book !!");
  }
}
