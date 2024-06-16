import { Component, OnInit } from '@angular/core';
import { NgIf } from "@angular/common";
import { AppComponent } from "../../../app.component"; // Adjust the import path if necessary

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [NgIf],
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

  constructor(private appComponent: AppComponent) { }

  ngOnInit(): void {
    // Any additional initialization
  }

  onChangeRole(event: any) {

  }
}
