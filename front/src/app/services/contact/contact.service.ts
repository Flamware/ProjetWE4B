// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  // Supprimer un contact par ID
  removeContact(contactId: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${contactId}`;
    return this.http.delete(url, {headers});
  }

  // Supprimer une conversation par ID de contact
  removeConversation(contactId: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${contactId}/conversations`;
    return this.http.delete(url, {headers});
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }
}
