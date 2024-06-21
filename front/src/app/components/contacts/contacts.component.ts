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

    selectContact(contact: any): void {
      this.contactSelected.emit(contact);
    }
}
