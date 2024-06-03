import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'login-button',
  template: '<button class="login-btn" (click)="auth.loginWithRedirect()">Se connecter</button>',
  styleUrls: ['./login-button.css'],
  standalone: true
})
export class LoginButton {
  constructor(public auth: AuthService) {}
}
