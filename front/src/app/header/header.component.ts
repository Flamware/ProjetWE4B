import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('boutonlogin') boutonlogin: ElementRef | undefined;
  isconnected = false;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.authStatus.subscribe((status: boolean) => {
      this.isconnected = status;
    });
    console.log('isconnected', this.isconnected);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    this.isconnected = false;
  }
}
