import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Userinfo } from '../../models/userinfo'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000';
  private getAccountUrl = `${this.apiUrl}/getAccountInfo`;
  private updateAccountUrl = `${this.apiUrl}/updateAccount`;
  constructor(private http: HttpClient) {}

  public getUserInfo(username: string): Observable<Userinfo> {
    return this.http.post<Userinfo>(this.getAccountUrl, {
      params: { username },
      headers: this.getHeaders()
    },);
  }

  public updateUserInfo(data: Userinfo): Observable<Userinfo> {
    return this.http.post<Userinfo>(this.updateAccountUrl, {
      params: data,
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Assurez-vous d'avoir stocké le token d'authentification
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
