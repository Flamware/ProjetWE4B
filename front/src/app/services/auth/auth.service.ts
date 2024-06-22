import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login'; // Replace with your server's login endpoint
  private registerUrl = 'http://localhost:3000/register'; // Replace with your server's register endpoint
  private apiUrl = 'http://localhost:3000';
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());

  authStatus = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
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
    // Créez un objet avec les propriétés attendues par le backend
    const body = {
      username: formData.get('username'),
      email: formData.get('email'),
      nom: formData.get('nom'),
      prenom: formData.get('prenom'),
      password: formData.get('password'),
      role: formData.get('role')
    };
  
    // Envoi de la requête HTTP avec le corps JSON
    return this.http.post<any>(this.registerUrl, body);
  }
  

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    const email = formData.get('email');
    const uploadUrl = `${this.apiUrl}/upload/${email}`; // Ajustez l'URL d'envoi pour inclure email
  
    console.log('Upload URL:', uploadUrl); // Log pour afficher l'URL
  
    return this.http.post<any>(uploadUrl, formData);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const uploadUrl = `${this.apiUrl}/uploadFile`;
    return this.http.post<any>(uploadUrl, formData);
  }
  
}
