import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div *ngIf="mediaUrl">
      <img *ngIf="mediaType === 'image'" [src]="mediaUrl" alt="Media">
      <video *ngIf="mediaType === 'video'" [src]="mediaUrl" controls></video>
      <audio *ngIf="mediaType === 'audio'" [src]="mediaUrl" controls></audio>
    </div>
  `
})
export class MediaViewerComponent {
  @Input() mediaUrl: string = '';
  @Input() mediaType: string = '';
}
