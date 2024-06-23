import { Component, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../../services/message/message.service'; // Chemin à adapter si nécessaire
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];

  @Output() userAdded = new EventEmitter<any>(); // Événement pour signaler l'ajout d'un utilisateur

  constructor(private messageService: MessageService) {}

  searchUsers(): void {
    if (this.searchQuery.trim() !== '') {
      this.messageService.searchUsers(this.searchQuery).subscribe({
        next: (users: any[]) => {
          this.searchResults = users;
        },
        error: (error: any) => {
          console.error('Error searching users:', error);
        }
      });
    }
  }

  addUser(user: any): void {
    const contact = {
      contactId: user.id // Assurez-vous que 'id' est la clé correcte pour l'ID utilisateur de l'utilisateur recherché
    };

    this.messageService.addContact(contact).subscribe({
      next: (addedUser: any) => {
        this.userAdded.emit(addedUser);
        this.searchQuery = '';
        this.searchResults = [];
      },
      error: (error: any) => {
        console.error('Error adding user:', error);
      }
    });
  }
  

  isContact(user: any): boolean {
    // Vérifiez s'il est déjà dans les contacts, cette fonction devrait être fournie par le parent
    return false;
  }
}
