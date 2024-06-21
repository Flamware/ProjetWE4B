import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import {AbstractControl, ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';  // Replace with your server's login endpoint
  private registerUrl = 'http://localhost:3000/register';  // Replace with your server's register endpoint
  // @ts-ignore
  private loggedIn = new BehaviorSubject<boolean>(this.getToken());

  authStatus = this.loggedIn.asObservable();
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, {email, password}).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userId', response.userId);
          this.loggedIn.next(true);
        }
      })
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.loggedIn.next(false);
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.registerUrl}`, formData);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}
