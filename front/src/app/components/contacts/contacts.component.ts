import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from '../../services/message/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})

export class ContactsComponent implements OnInit {

  @Input() contacts: any[] = [];
  @Output() contactSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleMenu = new EventEmitter<any>();
  
  private openMenus: Map<string, boolean> = new Map();

  constructor(private messageService: MessageService) { }

    ngOnInit(): void {
      this.messageService.getContacts().subscribe({
        next: (contacts: any[]) => {
          this.contacts = contacts;
        },
        error: (error: any) => {
          console.error('Error fetching contacts:', error);
        }
      });
    }

    openMessageDialog(contact: any): void {
      this.messageService.openMessageDialog(contact);
    }

    isMenuOpen(contactId: string): boolean {
      return this.openMenus.get(contactId) || false;
    }
  
    toggleMenuFunction(contactId: string): void {
      this.openMenus.set(contactId, !this.isMenuOpen(contactId));
    }
  
    deleteContact(contactId: string): void {
      this.toggleMenu.emit({ action: 'deleteContact', contactId });
      this.openMenus.set(contactId, false); // Close menu
    }
  
    deleteConversation(contactId: string): void {
      this.toggleMenu.emit({ action: 'deleteConversation', contactId });
      this.openMenus.set(contactId, false); // Close menu
    }
  
    selectContact(contact: any): void {
      this.contactSelected.emit(contact);
    }
}
