import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  user: any;

  constructor(private http: HttpClient, private router: Router) {
    this.user = {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      userFirstName: localStorage.getItem('userFirstName'),
      userLastName: localStorage.getItem('userLastName'),
      userEmail: localStorage.getItem('userEmail')
    }
  }

  login(user: any): Observable<any> {
    //return this.http.post<any>('http://localhost:3000/api/user/singin', user);
    return this.http.post<any>('https://wwibd-server-api-image-7qbwpnju7a-uc.a.run.app/api/user/singin', user);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    localStorage.clear();
    document.cookie = "";
    return this.http.post('/user/logout', { token });
  }

  getAllUsers(): Observable<any> {
    //return this.http.get<any>('http://localhost:3000/api/user/getAllUsers');
    return this.http.get<any>('https://wwibd-server-api-image-7qbwpnju7a-uc.a.run.app/api/user/getAllUsers');
  }

  getUser() {
    return this.user;
  }
}
