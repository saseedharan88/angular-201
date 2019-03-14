import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registerUser(registerData) {
    this.http.post('http://55.55.55.5:3000/register', registerData).subscribe(res => {
      console.log(res);
    });
  }
}
