// message.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Message } from '../../models/message';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../components/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:3000'; // Remplacez avec l'URL de votre API backend

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  getMessages(receiverId?: string): Observable<Message[]> {
    const headers = this.getHeaders();
    if (receiverId) {
      return this.http.get<Message[]>(`${this.apiUrl}/messages/${receiverId}`, {headers}).pipe(
        tap(data => console.log('Messages fetch successfully:', data)),
        catchError(error => {
          console.error('Error fetching messages:', error);
          throw error; // Renvoyer l'erreur pour une gestion ultérieure
        })
      );
    } else {
      return this.http.get<Message[]>(`${this.apiUrl}/messages`, {headers}).pipe(
        tap(data => console.log('Message from interlocuteur fetch successfully:', data)),
        catchError(error => {
          console.error('Error fetching message:', error);
          throw error; // Renvoyer l'erreur pour une gestion ultérieure
        })
      );
    }
  }

  sendMessage(receiverId: string, content: string): Observable<Message> {
    const newMessage: Message = {
      id: 0, // Laissez le backend générer l'ID
      receiver_id: receiverId,
      content: content,
      created_at: new Date()
    };
    const headers = this.getHeaders();
    return this.http.post<Message>(`${this.apiUrl}/send`, newMessage, {headers}).pipe(
      tap(data => console.log('Message sent successfully:', data)),
      catchError(error => {
        console.error('Error sending message:', error);
        throw error; // Renvoyer l'erreur pour une gestion ultérieure
      })
    );
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${messageId}`);
  }

  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/searchUsers?q=${query}`);
  }

  addContact(contact: any): Observable<any> {
    const headers = this.getHeaders(); // Obtenez les headers avec le token
    return this.http.post<any>(`${this.apiUrl}/addContact`, contact, { headers }).pipe(
      tap(data => console.log('Contact added successfully:', data)),
      catchError(error => {
        console.error('Error adding contact:', error);
        throw error; // Renvoyer l'erreur pour une gestion ultérieure
      })
    );
  }

  getContacts(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/contacts`, { headers }).pipe(
      tap(data => console.log(`Contacts fetched for user`, data)),
      catchError(error => {
        console.error('Error fetching contacts for user:', error);
        throw error;
      })
    );
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

  openMessageDialog(contact: any): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: { contact, newMessage: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Message sent:', result);
        // Ajoutez ici la logique pour envoyer le message à l'utilisateur
      }
    });
  }
}
