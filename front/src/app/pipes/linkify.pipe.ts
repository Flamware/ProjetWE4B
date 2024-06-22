import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
  standalone: true
})
export class LinkifyPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Regular expression to find URLs in text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Replace URLs with secure iframes
    const linkedText = value.replace(urlRegex, (url) => {
      const safeUrl = this.getSafeUrl(url);
      return `<iframe src="${safeUrl}" width="100%" height="315" frameborder="0" allowfullscreen></iframe>`;
    });

    // Sanitize the HTML before returning
    return this.sanitizer.bypassSecurityTrustHtml(linkedText);
  }

  private getSafeUrl(url: string): string {
    if (!url) return ''; // Handle null or undefined case
  
    // You can further validate or sanitize the URL here if needed
    return this.sanitizer.sanitize(SecurityContext.URL, url) || '';
  }  
}
