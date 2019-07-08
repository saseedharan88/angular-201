import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

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

    constructor(
        private router: Router) {
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
    }

    isScreenSmall(): boolean {
        return this.mediaMatcher.matches;
    }
}
