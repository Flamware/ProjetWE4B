import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './media-viewer.component.html',
  styleUrl: './media-viewer.component.css'
})
export class MediaViewerComponent {
  @Input() mediaUrl: string = '';
  @Input() mediaType: string = '';
}
