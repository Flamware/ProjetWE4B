import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'login-button',
  template: `
    <button class="login-btn" (click)="login()">Se connecter</button>`,
  standalone: true,
  styleUrls: ['./login-button.css']
})
export class LoginButton implements OnDestroy {
  private userSubscription: Subscription | undefined;

  constructor(public auth: AuthService, private http: HttpClient) {}

  login(): void {
    // Call this method to log in
    this.auth.loginWithRedirect();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the user$ observable when the component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
