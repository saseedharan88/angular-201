import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../../appConstants';

const TOKEN = 'TOKEN';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  path: string;

  setToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem(TOKEN) != null;
  }

  constructor(private http: HttpClient, private router: Router) {
    this.path = AppConstants.apiUrl + '/auth';
  }

  registerUser(registerData) {
    this.http.post(this.path + '/register', registerData).subscribe(res => {
      console.log(res);
    });
  }

  loginUser(loginData) {
    this.http.post<any>(this.path + '/login', loginData).subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res.token);
     // if (res['token']) {
     //   this.setToken(res['token']);
     //   this.router.navigateByUrl('/welcome');
     // }
    }, res => {
      alert(res.error.error);
    });
  }
}
