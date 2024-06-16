import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface UserResponse {
  existing: boolean;
}

@Component({
  selector: 'login-button',
  template: `
    <button class="login-btn" (click)="login()">Se connecter</button>
  `,
  standalone: true,
  styleUrls: ['./login-button.css']
})
export class LoginButton implements OnDestroy {
  private userSubscription: Subscription | undefined;

  constructor(public auth: AuthService, private http: HttpClient) {}

  async login(): Promise<void> {
    try {
      await this.auth.loginWithRedirect();
      const tokenClaims = await this.auth.idTokenClaims$.toPromise();

      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error('Token claims are missing or undefined');
      }

      const token = tokenClaims.__raw;
      await this.checkForAndCreateUser(token);
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (e.g., show error message to the user)
    }
  }

  private async checkForAndCreateUser(token: string): Promise<void> {
    const url = 'http://localhost:3000/user-logged-in';

    try {
      const response = await this.http.post<UserResponse>(url, { token }).toPromise();

      if (response?.existing) {
        console.log('User already exists');
      } else {
        console.log('New user created');
      }
    } catch (error) {
      console.error('Error checking user or creating user:', error);
      // Handle error (e.g., show error message to the user)
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
