import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgIf,
    HttpClientModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userInfo = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    bio: 'Hello, I am John Doe.',
    role: 'User',
    created_at: new Date('2022-01-01').toLocaleDateString() // S'adapte au pays du client
  };


  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/getuserinfo')
      .subscribe((response) => {
        this.userInfo = response;

      });
  }


}
