import { Pipe, PipeTransform } from '@angular/core';
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
      return `<iframe [src]="getSafeUrl('${url}')"></iframe>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(linkedText);
  }

  private getSafeUrl(url: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
