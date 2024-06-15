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

  sender: string = 'Alice'; // Changez cela pour filtrer par un autre expéditeur


  constructor(public auth: AuthService) {}
  interlocuteur: string = "Bob";
  messages = [{sender: "Alice", content: "Salut Bob, comment vas-tu ?"},{sender: "Bob", content: "Salut Alice"}];


  ngOnInit(): void {
    //this.getMessagesBySender(this.sender);
  }

  getMessagesBySender(sender: string): void {
    //this.messages = this.messageService.getMessages().filter(message => message.sender === sender);
  }
}
