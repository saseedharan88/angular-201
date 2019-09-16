import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../userauth.service';
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: SocialUser;
  loggedIn: boolean;
  loginData = {}
  hide = true;

  constructor(private userAuthService: UserAuthService,
              private authService: AuthService,
              private router: Router) {
    this.userAuthService.isError = false;
    if (this.userAuthService.isAuthenticated) {
      this.router.navigate(['/books']);
    }
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      if (user !== null) {
        this.user = user;
        // After Successful Social Login.
        this.userAuthService.socialLogin(this.user);
      }
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  post() {
    this.userAuthService.loginUser(this.loginData);
  }

}
