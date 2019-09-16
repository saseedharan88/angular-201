import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConstants } from './appConstants';
import { AuthService } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  apiUrl: string;
  path: string;
  isError = false;
  statusMessage: string;
  statusMessageText: string;
  returnUrl: string;

  TOKEN_KEY = 'token';
  USER_ROLE = 'role';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.apiUrl = AppConstants.apiUrl;
    this.path = AppConstants.apiUrl + '/auth';
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    // Double Negation Returns true if token exists.
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get userRole(): string {
    return localStorage.getItem(this.USER_ROLE);
  }

  currentUser(): any {
    return this.http.get(this.apiUrl + '/current_user').subscribe((res: any) => {
      if (typeof res.role !== 'undefined') {
        localStorage.setItem(this.USER_ROLE, res.role);
      }
    });
  }

  registerUser(registerData) {
    this.http.post<any>(this.path + '/register', registerData).subscribe(res => {
      this.saveToken(res.token);
      this.currentUser();
    }, res => {
      this.statusMessage = 'error';
      this.statusMessageText = res.error.message;
    });
  }

  loginUser(loginData) {
    this.http.post<any>(this.path + '/login', loginData).subscribe(res => {
      this.saveToken(res.token);
      this.currentUser();
    }, res => {
      this.statusMessage = 'error';
      this.statusMessageText = res.error.message;
    });
  }

  socialLogin(loginData) {
    this.http.post<any>(this.path + '/slogin', loginData).subscribe(res => {
      this.saveToken(res.token);
      this.currentUser();
    }, res => {
      this.statusMessage = 'error';
      this.statusMessageText = res.error.message;
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE);
    this.authService.signOut();
    this.router.navigateByUrl('/');
  }

  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(this.returnUrl);
  }
}
