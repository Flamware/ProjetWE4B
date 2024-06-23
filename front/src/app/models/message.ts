export class Message {
    id: number;
    receiver_id: string;
    sender_id: string;
    content: string;
    created_at: Date; // Utilisez le nom de champ correspondant à votre base de données
  
    constructor(id: number, sender_id: string, receiver_id: string, content: string, created_at: Date) {
      this.id = id;
      this.receiver_id = receiver_id;
      this.content = content;
      this.created_at = created_at;
      this.sender_id = '';
    }
  }
  