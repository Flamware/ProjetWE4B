// message.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
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
      sender_id: '',
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

  getContactById(id: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.get<any>(`${this.apiUrl}/getUser/${id}`, { headers }).pipe(
      tap(data => console.log(`Get user by id:`, data)),
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(error); // Renvoyer l'erreur
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

  getMessagesByReceiver(receiverId: string): Observable<Message[]> {
    const headers = this.getHeaders();
    console.log(`Fetching messages for receiverId: ${receiverId} with headers:`, headers);
    
    return this.http.get<Message[]>(`${this.apiUrl}/messagesG/${receiverId}`, { headers }).pipe(
      tap(messages => {
        console.log(`Messages fetched for receiverId ${receiverId}:`, messages);
      }),
      catchError(error => {
        console.error(`Error fetching messages by receiver (receiverId: ${receiverId}):`, error);
        return throwError(() => error);
      })
    );
  }

  getMessagesBySender(): Observable<Message[]> {
    const headers = this.getHeaders();
    console.log('Fetching messages for current user as sender with headers:', headers);
    
    return this.http.get<Message[]>(`${this.apiUrl}/messagesP`, { headers }).pipe(
      tap(messages => {
        console.log('Messages fetched for current user as sender:', messages);
      }),
      catchError(error => {
        console.error('Error fetching messages by sender:', error);
        return throwError(() => error);
      })
    );
  }


// Méthode pour détecter les contacts avec lesquels vous avez interagi
detectInteractedContacts(userId: string): Observable<any[]> {
  return forkJoin({
    receivedMessages: this.getMessagesByReceiver(userId).pipe(catchError(() => of([]))), // Gestion d'erreur simplifiée
    sentMessages: this.getMessagesBySender().pipe(catchError(() => of([]))) // Gestion d'erreur simplifiée
  }).pipe(
    map(({ receivedMessages, sentMessages }) => {
      console.log('Messages reçus:', receivedMessages);
      console.log('Messages envoyés:', sentMessages);

      // Utilisation d'un Set pour éviter les doublons
      const interactedContacts = new Set<string>();

      receivedMessages.forEach(message => interactedContacts.add(message.sender_id));
      sentMessages.forEach(message => interactedContacts.add(message.receiver_id));

      // Retourne un tableau d'objets { id: contactId }
      return Array.from(interactedContacts).map(id => ({ id }));
    }),
    catchError(error => {
      console.error('Erreur lors de la détection des contacts interactifs:', error);
      return throwError(() => error); // Propagation de l'erreur pour être gérée plus haut
    })
  );
}

// Méthode pour détecter et ajouter de nouveaux contacts
detectAndAddNewContacts(userId: string): Observable<any[]> {
  console.log(`Début de la détection des contacts pour l'utilisateur: ${userId}`);
  
  return this.detectInteractedContacts(userId).pipe(
    tap(interactedContacts => {
      console.log(`Contacts interactifs détectés pour l'utilisateur ${userId}:`, interactedContacts);
    }),
    switchMap(interactedContacts => {
      console.log('Récupération des contacts existants pour la comparaison...');

      return this.getContacts().pipe(
        map(existingContacts => {
          console.log('Contacts existants récupérés:', existingContacts);

          const existingContactIds = new Set(existingContacts.map(contact => contact.id));
          console.log('IDs des contacts existants:', Array.from(existingContactIds));

          const newContacts = interactedContacts.filter(contact => !existingContactIds.has(contact.id));
          console.log('Nouveaux contacts détectés:', newContacts);

          return newContacts;
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération des contacts existants:', error);
          return of([]); // Retourner un tableau vide en cas d'erreur
        })
      );
    }),
    switchMap(newContacts => {
      if (newContacts.length === 0) {
        console.log('Aucun nouveau contact à ajouter.');
        return of([]);
      }

      console.log('Ajout des nouveaux contacts à la liste...');

      return forkJoin(newContacts.map(contact => 
        this.addContact({ id: contact.id }).pipe(
          catchError(error => {
            console.error(`Erreur lors de l'ajout du contact ${contact.id}:`, error);
            return of(null); // Retourner null pour indiquer l'échec d'ajout
          })
        )
      ));
    }),
    tap(addedContacts => {
      console.log('Nouveaux contacts ajoutés avec succès:', addedContacts);
    }),
    catchError(error => {
      console.error('Erreur lors de la détection et de l\'ajout des nouveaux contacts:', error);
      return throwError(() => error); // Propagation de l'erreur pour être gérée plus haut
    })
  );
}
}
