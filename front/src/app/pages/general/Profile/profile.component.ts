import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import {NgIf} from "@angular/common";

type userinfo = {
  first_name: string,
  last_name: string,
  email: string,
  username: string,
  bio: string,
  role: 'User',
  created_at: Date,
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgIf,
    HttpClientModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userInfo: userinfo = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    bio: 'Hello, I am John Doe.',
    role: 'User',
    created_at: new Date('2022-01-01') // S'adapte au pays du client
  };

  userData?:FormGroup;

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/getuserinfo')
      .subscribe((response) => {
        this.userInfo = response;

      });
    this.userData = new FormGroup({
      username: new FormControl(this.userInfo.username),
      email: new FormControl(this.userInfo.email),
      biography: new FormControl(this.userInfo.bio)
    }); 
  }

  onSubmit() {
    if(this.userData === undefined) {
      return;
    }
    console.log(this.userData.value);
    //TODO: Check les valeurs pour voir si y'a un changement avant de revoyer a la db
  }


}
