import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  sender: null | undefined ; // Changez cela pour filtrer par un autre expéditeur


  constructor(private route: ActivatedRoute) {}
  interlocuteur: string = "Bob";
  messages = [{sender: "Alice", content: "Salut Bob, comment vas-tu ?"},{sender: "Bob", content: "Salut Alice"}];
  contacts = [{name: "Alice"},{name: "Bob"}];


  ngOnInit(): void {
    //this.getMessagesBySender(this.sender);
    this.route.params.subscribe(params => {
      this.sender = params['contact']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      // @ts-ignore
      if (this.sender=='') {
        this.sender= null;
      }

    });
  }

  getMessagesBySender(sender: string): void {
    //this.messages = this.messageService.getMessages().filter(message => message.sender === sender);
  }
}
