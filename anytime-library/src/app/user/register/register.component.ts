import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerData = {}

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  post() {
    console.log(this.registerData);
    this.userService.registerUser(this.registerData);
  }
}
