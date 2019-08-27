import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerData = {}

  constructor(private userService: UserService, private router: Router) {
    if (this.userService.isLoggedIn) {
      this.router.navigate(['/welcome']);
    }
  }

  ngOnInit() {
  }

  post() {
    console.log(this.registerData);
    this.userService.registerUser(this.registerData);
  }
}
