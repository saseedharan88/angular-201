import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../service/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books: any = [];
  filterBy: string;
  filterValue: string;
  filteredText = 'List of Books available';
  constructor(private route: ActivatedRoute, private bookService: BookService) {
    this.route.paramMap.subscribe(
      params => {
        this.filterBy = (params.get('filter_by') !== null) ? params.get('filter_by') : '';
        this.filterValue = (params.get('filter_value') !== null) ? params.get('filter_value') : '';
        return this.bookService.getBooks(this.filterBy, this.filterValue).subscribe((data: {}) => {
          this.books = data;
          if (this.filterBy !== null && this.filterBy === 'subjects') {
            this.filteredText = this.books.length + ' books available under subject "' + this.filterValue + '"';
          } else if (this.filterBy !== null && this.filterBy === 'authors') {
            this.filteredText = this.books.length + ' books written by ' + this.filterValue + ' are available.';
          }
        });
      }
    );

  }

  ngOnInit() {
  }

}
