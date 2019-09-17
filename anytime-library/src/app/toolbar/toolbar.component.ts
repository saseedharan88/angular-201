import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService, SocialUser } from 'angularx-social-login';
import { UserAuthService } from '../userauth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  user: SocialUser;
  loggedIn: boolean;
  loginData = {}

  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(public userAuthService: UserAuthService, private authService: AuthService) { }

  ngOnInit() {
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);
    // });
  }
}
