import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {FooterComponent} from "./footer/footer.component";
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    FooterComponent,
    RouterOutlet,
    HeaderComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription | undefined;
  title: string = 'ProjetWE4B';

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Subscribe to user$ to handle user authentication state changes
    this.userSubscription = this.auth.user$.subscribe(
      (user) => {
        if (user) {
          this.handleUser(user);
        }
      },
      (error) => {
        console.error('Error retrieving user information:', error);
      }
    );

    // Handle the Auth0 redirect callback
    this.handleAuthCallback();
  }

  handleAuthCallback(): void {
    // Handle the redirect callback when the user returns from Auth0
    this.auth.handleRedirectCallback().subscribe(
      () => {
        // Redirect callback complete, do nothing for now or add logic as needed
      },
      (error) => {
        console.error('Error handling redirect callback:', error);
      }
    );
  }

  handleUser(user: any): void {
    console.log('Checking if user exists...');
    this.auth.idTokenClaims$.subscribe((claims: any) => {
      if (claims) {
        const token = claims.__raw;
        console.log('JWT Token:', token);  // Log the token to the console
        const headers = { Authorization: `Bearer ${token}` };
        this.http
          .get<any>(`http://localhost:3000/user-exists?email=${user.email}`, { headers })
          .subscribe((response) => {
            if (response.exists) {
              console.log('User exists:', response);
            } else {
              console.log('User does not exist:', response);
              this.createUser(user, headers);
            }
          });
      }
    });
  }

  createUser(user: any, headers: any): void {
    const apiUrl = 'http://localhost:3000/create-user';
    const userData = {
      email: user.email,
      first_name: user.given_name,
      last_name: user.family_name,
    };

    this.http.post(apiUrl, userData, { headers }).subscribe(
      (response) => {
        console.log('User created successfully:', response);
      },
      (error) => {
        console.error('Error creating user:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
