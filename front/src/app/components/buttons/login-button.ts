import { Component } from '@angular/core';

// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'Loggin-button',
  template: '<button (click)="auth.loginWithRedirect()">Log in</button>',
  standalone: true
})
export class LoginButton {
  // Inject the authentication service into your component through the constructor
  constructor(public auth: AuthService) {}
}
