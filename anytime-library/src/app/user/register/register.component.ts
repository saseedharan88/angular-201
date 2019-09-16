import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../userauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerData = {}
  hide = true;

  constructor(private userAuthService: UserAuthService, private router: Router) {
    if (this.userAuthService.isAuthenticated) {
      this.router.navigate(['/books']);
    }
  }

  ngOnInit() {
  }

  post() {
    this.userAuthService.registerUser(this.registerData);
  }
}
