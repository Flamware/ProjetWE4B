import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message/message.service'; // Assurez-vous d'avoir le bon chemin vers votre service
import { Message } from '../../../models/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserSearchComponent } from '../../../components/user-search/user-search.component';
import { ContactsComponent } from '../../../components/contacts/contacts.component';

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
export class MessageComponent implements OnInit {
  sender: string | null = null;
  messages: Message[] = [];
  contacts: any[] = [];
  newMessage: string = '';
  interlocuteur: string = '';
  searchQuery: string = '';
  selectedContactId: string | null = null;

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
      } else {
        // Logic to handle when no contact is selected
        console.log('No contact selected.');
      }
    });
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
    if (this.interlocuteur && this.newMessage.trim() !== '') {
      this.messageService.sendMessage(this.interlocuteur, this.newMessage).subscribe({
        next: (message: Message) => {
          this.messages.push(message);
          this.newMessage = ''; // Réinitialisez le champ de saisie après l'envoi
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
