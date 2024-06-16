import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {NgIf} from "@angular/common";
import { take } from 'rxjs/operators'; // Don't forget to import 'take'

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
    created_at: '2022-01-01'
  };


  constructor(public auth: AuthService, private http: HttpClient) {}
  onChangeRole($event : any){
    const role = $event.role

    this.userInfo.role = role;

    const token = this.auth.idTokenClaims$ // get the token from Auth0

    token.subscribe(t => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${t}`);

      this.http.post('http://localhost:3000/set-role',
        {
          username: this.userInfo.username,
          role: role
        },
        { headers: headers }
      ).subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
    });
  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/getuserinfo')
      .subscribe((response) => {
        this.userInfo = response;

      });
  }


}
