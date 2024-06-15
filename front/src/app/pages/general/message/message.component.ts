import { Component } from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  messages: any[] = [];
  sender: string = 'Alice'; // Changez cela pour filtrer par un autre expéditeur


  constructor(public auth: AuthService) {}
  ngOnInit(): void {
    this.getMessagesBySender(this.sender);
  }

  getMessagesBySender(sender: string): void {
    this.messages = this.messageService.getMessages().filter(message => message.sender === sender);
  }
}
