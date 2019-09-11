import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from './appConstants';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  path: string;

  TOKEN_KEY = 'token';

  constructor(private http: HttpClient, private router: Router) {
    this.path = AppConstants.apiUrl + '/auth';
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    // Double Negation Returns true if token exists.
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  registerUser(registerData) {
    this.http.post<any>(this.path + '/register', registerData).subscribe(res => {
      this.saveToken(res.token);
    }, res => {
      alert(res.error.error);
    });
  }

  loginUser(loginData) {
    this.http.post<any>(this.path + '/login', loginData).subscribe(res => {
      this.saveToken(res.token);
    }, res => {
      alert(res.error.error);
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.router.navigateByUrl('/books');
  }
}
