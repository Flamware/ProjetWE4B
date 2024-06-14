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
    // Store user information in the database
    this.storeUserInfo().then(() => console.log('User information stored successfully'));
  }

  async storeUserInfo(): Promise<void> {
    console.log('Storing user information...');
    // Subscribe to the user$ observable to get the user object
    this.userSubscription = this.auth.user$.subscribe(
      (user) => {
        if (!user) {
          console.error('User object is null or undefined');
          return;
        }

        console.log('User object:', user); // Log the user object for debugging

        // Check if the required properties exist before accessing them
        if (!user.email || !user.given_name || !user.family_name) {
          console.error('User object is missing required properties');
          return;
        }

        const apiUrl = 'http://localhost:3000/api/update-user-info';
        const userData = {
          email: user.email,
          first_name: user.given_name,
          last_name: user.family_name
        };

        this.http.post(apiUrl, userData).subscribe(
          (response) => {
            console.log('User information stored successfully:', response);
            // Redirect to dashboard or another page
          },
          (error) => {
            console.error('Error storing user information:', error);
            // Handle error appropriately
          }
        );
      },
      (error) => {
        console.error('Error retrieving user information:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the user$ observable when the component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
