import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Subscription } from 'rxjs';
import {FooterComponent} from "./footer/footer.component";
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./header/header.component";
import { HttpHeaders } from '@angular/common/http';

interface UserResponse {
  existing: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    FooterComponent,
    RouterOutlet,
    HeaderComponent,
    HttpClientModule
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private userSubscription: Subscription | undefined;

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userSubscription = this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.auth.idTokenClaims$.subscribe(tokenClaims => {
          if (!tokenClaims || !tokenClaims.__raw) {
            console.error('Token claims are missing or undefined');
            return;
          }
          const token = tokenClaims.__raw;
          this.checkForAndCreateUser(token);
        });
      }
    });
  }

  private async checkForAndCreateUser(token: string): Promise<void> {
    const url = 'http://localhost:3000/user-logged-in';

    // Define headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.post<UserResponse>(url, { sub: token }, { headers }).toPromise();

      if (response?.existing) {
        console.log('User already exists');
      } else {
        console.log('New user created');
      }
    } catch (error) {
      console.error('Error checking user or creating user:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
