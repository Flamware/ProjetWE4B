import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FooterComponent } from "./footer/footer.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header/header.component";

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
    this.userSubscription = this.auth.user$.subscribe(
      async (user) => {
        if (user) {
          await this.handleUser(user);
        }
      },
      (error) => {
        console.error('Error retrieving user information:', error);
      }
    );
  }

  async handleUser(user: any): Promise<void> {
    console.log('Checking if user exists...');
    try {
      const userEmail = user.email; // Extract email from user object
      this.http.get<any>(`http://localhost:3000/api/user-exists?email=${userEmail}`) // Include email in query parameter
        .subscribe((response) => {
          if (response.exists) {
            console.log('User exists:', response);
          } else {
            console.log('User does not exist:', response);
            this.createUser(user);
          }
        });
    } catch (error) {
      console.error('Error checking if user exists:', error);
    }
  }


  async createUser(user: any): Promise<void> {
    const apiUrl = 'http://localhost:3000/api/create-user';
    const userData = {
      email: user.email,
      first_name: user.given_name,
      last_name: user.family_name
    };

    try {
      const response = await this.http.post(apiUrl, userData).toPromise();
      console.log('User created successfully:', response);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
