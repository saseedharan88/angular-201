import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { BookService } from '../book/service/book.service';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

    private mediaMatcher: MediaQueryList =
        matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

    isDarkTheme: boolean = false;
    filterChoosen: string;
    constructor(private router: Router, private bookService: BookService) {
    }

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    ngOnInit() {
      this.router.events.subscribe(() => {
          if (this.isScreenSmall())
              this.sidenav.close();
      });

      this.bookService.getSubjects();
      this.filterChoosen = 'subjects';
    }

    isScreenSmall(): boolean {
        return this.mediaMatcher.matches;
    }

    onFilterByChange(filterBy: string) {
      this.filterChoosen = filterBy;
      // Reset the filters.
      if (this.filterChoosen === 'subjects') {
        this.bookService.getSubjects();
      } else if (this.filterChoosen === 'authors') {
        this.bookService.getAuthors();
      }
    }
}
