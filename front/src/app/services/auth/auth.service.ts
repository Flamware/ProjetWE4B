import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';  // Replace with your server's login endpoint
  private registerUrl = 'http://localhost:3000/register';  // Replace with your server's register endpoint

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    console.log("login", email, password);
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userId', response.userId);
        }
      })
    );
  }

  register(username: string, email: string, password: string, prenom: string, role: string): Observable<any> {
    console.log("register", username, email, password, prenom, role);
    return this.http.post<any>(this.registerUrl, { username, email, password, prenom, role });
  }
}
