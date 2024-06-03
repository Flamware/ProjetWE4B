import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AsyncPipe} from "@angular/common";
import {AuthService} from '@auth0/auth0-angular';
import {LoginButton} from "../components/buttons/login-button";
import {LogoutButton} from "../components/buttons/logout-button";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginButton,
    LogoutButton,
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}
