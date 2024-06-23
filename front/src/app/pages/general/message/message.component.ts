import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message/message.service';
import { Message } from '../../../models/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserSearchComponent } from '../../../components/user-search/user-search.component';
import { ContactsComponent } from '../../../components/contacts/contacts.component';
import { interval, Subscription, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    UserSearchComponent,
    ContactsComponent
  ],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  sender: string | null = null;
  messages: Message[] = [];
  contacts: any[] = [];
  newMessage: string = '';
  interlocuteur: string = '';
  searchQuery: string = '';
  selectedContactId: string | null = null;
  selectedContact: any;
  private refreshSubscription: Subscription | undefined;
  userId = localStorage.getItem('userId'); // Remplacez par l'ID de l'utilisateur actuel

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.sender = 'moi';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const contactId = params.get('contactId');
      if (contactId) {
        this.loadMessagesForContact(contactId);

        // Démarrez le rafraîchissement périodique des messages toutes les 10 secondes
        this.refreshSubscription = interval(10000) // 10 secondes
          .pipe(
            switchMap(() => this.messageService.getMessages(contactId))
          )
          .subscribe({
            next: (messages: Message[]) => {
              this.messages = messages;
            },
            error: (error: any) => {
              console.error('Error fetching messages:', error);
            }
          });
      } else {
        // Logic to handle when no contact is selected
        console.log('No contact selected.');
      }
    });
    console.log(this.userId);
    // Détecter et ajouter de nouveaux contacts
    //this.detectAndAddNewContacts();
    this.detectContacts();
  }

  ngOnDestroy(): void {
    // Nettoyez l'abonnement au rafraîchissement périodique lors de la destruction du composant
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  toggleContactMenu(event: { action: string, contactId: string }): void {
    switch (event.action) {
      case 'deleteContact':
        this.removeContact(event.contactId);
        break;
      case 'deleteConversation':
        this.removeConversation(event.contactId);
        break;
    }
  }
  
  removeContact(contactId: string): void {
    // Logique pour effacer le contact
    console.log(`Effacer le contact avec ID: ${contactId}`);
    // Supprimer le contact de la liste
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
  }
  
  removeConversation(contactId: string): void {
    // Logique pour supprimer la conversation
    console.log(`Supprimer la conversation pour le contact avec ID: ${contactId}`);
    // Supprimer les messages associés à ce contact
    this.messages = this.messages.filter(message => message.sender_id !== contactId && message.receiver_id !== contactId);
  }  

  loadMessagesForContact(contactId: string): void {
    this.messageService.getMessages(contactId).subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        // Find the selected contact based on contactId
        this.selectedContactId = contactId;
      },
      error: (error: any) => {
        console.error('Error fetching messages:', error);
      }
    });

    console.log(this.selectedContact);
  }

  sendMessage(): void {
    if (this.selectedContactId && this.newMessage.trim() !== '') {
      this.messageService.sendMessage(this.selectedContactId, this.newMessage).subscribe({
        next: (message: Message) => {
          // Ajoute le message envoyé aux messages existants
          this.messages.push(message);
          // Efface le champ de saisie après l'envoi
          this.newMessage = '';
          // Charge à nouveau les messages pour le contact sélectionné
          this.loadMessagesForContact(this.selectedContactId!);
        },
        error: (error: any) => {
          console.error('Error sending message:', error);
        }
      });
    }
  }
  

  navigateToMessage(contactId: string): void {
    this.router.navigate(['/message', contactId]);
  }

  searchUsers(): void {
    if (this.searchQuery.trim() !== '') {
      this.messageService.searchUsers(this.searchQuery).subscribe({
        next: (users: any[]) => {
          this.contacts = users;
        },
        error: (error: any) => {
          console.error('Error searching users:', error);
        }
      });
    }
  }

  detectContacts(): void {
    this.messageService.detectInteractedContacts(this.userId!).subscribe({
      next: newContacts => {
        if (newContacts.length > 0) {
          console.log('Nouveaux contacts détectés et ajoutés:', newContacts);
          this.contacts.push(...newContacts);
        } else {
          console.log('Aucun nouveau contact à ajouter.');
        }
      },
      error: error => {
        console.error('Erreur lors de la détection et de l\'ajout des nouveaux contacts:', error);
      }
    });
  }

  detectInteractedContacts(): void {
    this.messageService.detectInteractedContacts(this.userId!).subscribe({
      next: (interactedContacts: any[]) => {
        this.contacts = interactedContacts;
      },
      error: (error: any) => {
        console.error('Error detecting interacted contacts:', error);
      }
    });
  }

  detectAndAddNewContacts(): void {
    this.messageService.detectAndAddNewContacts(this.userId!).subscribe({
      next: newContacts => {
        if (newContacts.length > 0) {
          console.log('Nouveaux contacts détectés et ajoutés:', newContacts);
          this.contacts.push(...newContacts);
        } else {
          console.log('Aucun nouveau contact à ajouter.');
        }
      },
      error: error => {
        console.error('Erreur lors de la détection et de l\'ajout des nouveaux contacts:', error);
      }
    });
  }

  addContact(contact: any): void {
    this.messageService.addContact(contact).subscribe({
      next: (addedContact: any) => {
        this.contacts.push(addedContact);
        this.searchQuery = ''; // Réinitialisez la recherche
      },
      error: (error: any) => {
        console.error('Error adding contact:', error);
      }
    });
  }

  isContact(contact: any): boolean {
    return this.contacts.some(c => c.id === contact.id);
  }

  selectContact(contact: any): void {
    this.selectedContactId = contact.id;
    this.messageService.getContactById(this.selectedContactId).subscribe(
      (data: any) => {
        this.selectedContact = data; // Stockez les informations de l'utilisateur récupérées dans userInfo
      },
      (error: any) => {
        console.error('Error fetching user info:', error);
        // Gérez l'erreur comme nécessaire (par exemple, afficher un message d'erreur à l'utilisateur)
      });

    this.navigateToMessage(contact.id); // Naviguer vers la conversation du contact sélectionné
  }

  // Méthode pour sélectionner un contact depuis ContactsComponent
  onContactSelected(contact: any): void {
    this.selectedContactId = contact.id;
    this.messageService.getContactById(this.selectedContactId).subscribe(
      (data: any) => {
        this.selectedContact = data; // Stockez les informations de l'utilisateur récupérées dans userInfo
      },
      (error: any) => {
        console.error('Error fetching user info:', error);
        // Gérez l'erreur comme nécessaire (par exemple, afficher un message d'erreur à l'utilisateur)
      });
    this.loadMessagesForContact(contact.id); // Charger les messages du contact sélectionné
  }
}
