import { Component, OnDestroy, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
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
    HeaderComponent,
    HttpClientModule
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription | undefined;
  title: string = 'ProjetWE4B';

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userSubscription = this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.auth.user$.subscribe(user => {
          this.handleUser(user);
        });
      }
    });
  }

  handleUser(user: any): void {
    console.log('User logged in...');

    const token = user?.__raw; // Assuming the raw token is accessible in user object
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`
      };
      this.http
        .get<any>(`http://localhost:3000/user-logged-in`, { headers })
        .subscribe((response) => {
          console.log(response);
        });
    } else {
      console.error('Missing token for user object');
      // Handle missing token scenario (optional)
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
