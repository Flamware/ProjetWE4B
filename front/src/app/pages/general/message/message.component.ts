import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message/message.service';
import { Message } from '../../../models/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserSearchComponent } from '../../../components/user-search/user-search.component';
import { ContactsComponent } from '../../../components/contacts/contacts.component';
import { interval, Subscription } from 'rxjs';
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
  private refreshSubscription: Subscription | undefined;

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
  }

  ngOnDestroy(): void {
    // Nettoyez l'abonnement au rafraîchissement périodique lors de la destruction du composant
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
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
    this.navigateToMessage(contact.id); // Naviguer vers la conversation du contact sélectionné
  }

  // Méthode pour sélectionner un contact depuis ContactsComponent
  onContactSelected(contact: any): void {
    this.selectedContactId = contact.id;
    this.loadMessagesForContact(contact.id); // Charger les messages du contact sélectionné
  }
}
