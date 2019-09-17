import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../userauth.service';
import { Router } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerData = {
    email: '',
    password: '',
    name: '',
    firstName: '',
    lastName: ''
  }
  hide = true;

  constructor(public userAuthService: UserAuthService, private authService: AuthService, private router: Router) {
    if (this.userAuthService.isAuthenticated) {
      this.router.navigate(['/books']);
    }
  }

  ngOnInit() {
  }

  post() {
    this.userAuthService.registerUser(this.registerData);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
