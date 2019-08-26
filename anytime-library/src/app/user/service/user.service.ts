import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const TOKEN = 'TOKEN';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  googleForm: any;

  setToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem(TOKEN) != null;
  }

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(registerData) {
    this.http.post('http://localhost:3000/register', registerData).subscribe(res => {
      console.log(res);
    });
  }

  loginUser(loginData) {
    this.http.post('http://localhost:3000/login', loginData).subscribe(res => {
     if (res['token']) {
       this.setToken(res['token']);
       this.router.navigateByUrl('/welcome');
     }
    }, res => {
      alert(res.error.error);
    });
  }
}
