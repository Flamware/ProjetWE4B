import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  
  constructor(private sanitizer: DomSanitizer) {}

  // Méthode pour vérifier si un document peut être prévisualisé
  isPreviewableDocument(mediaUrl: string): boolean {
    const previewableExtensions = ['pdf', 'txt'];
    const extension = mediaUrl.split('.').pop()?.toLowerCase();
    return previewableExtensions.includes(extension || '');
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
