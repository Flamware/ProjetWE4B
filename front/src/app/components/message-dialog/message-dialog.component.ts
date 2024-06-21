import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './message-dialog.component.html',
})
export class MessageDialogComponent {

  constructor(    
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService
  ) { }


  sendMessage(): void {
    if (this.data.newMessage.trim() !== '') {
      // Call sendMessage from MessageService
      this.messageService.sendMessage(this.data.contact.id, this.data.newMessage).subscribe(
        (message) => {
          console.log('Message sent successfully:', message);
          this.dialogRef.close(message); // Close dialog with message sent
        },
        (error) => {
          console.error('Failed to send message:', error);
          // Handle error as needed
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}