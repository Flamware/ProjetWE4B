import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Userinfo } from '../../models/userinfo';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000';
  private getAccountUrl = `${this.apiUrl}/getAccountInfo`;
  private updateAccountUrl = `${this.apiUrl}/updateAccount`;

  constructor(private http: HttpClient) {}

  public getUserInfo(username?: string): Observable<Userinfo> {
    let params = new HttpParams();
    if (username) {
      params = params.set('username', username);
    }

    const headers = this.getHeaders();

    return this.http.get<Userinfo>(this.getAccountUrl, { headers, params });
  }

  public updateUserInfo(data: Userinfo): Observable<Userinfo> {
    const headers = this.getHeaders();

    return this.http.put<Userinfo>(this.updateAccountUrl, data, { headers });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Ensure the authentication token is stored in localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
