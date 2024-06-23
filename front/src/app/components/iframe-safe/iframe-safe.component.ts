import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-safe',
  standalone: true,
  imports: [],
  templateUrl: './iframe-safe.component.html',
  styleUrl: './iframe-safe.component.css'
})
export class IframeSafeComponent implements OnInit {
  @Input() url: string | undefined;
  safeUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url!);
  }
}