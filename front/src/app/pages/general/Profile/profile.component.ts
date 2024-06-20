import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NgIf } from "@angular/common";
import { ProfileService } from '../../../services/profile/profile.service';
import { Userinfo } from '../../../models/userinfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userInfo: Userinfo = {
    first_name: 'John',
    last_name: 'Default',
    email: 'john.default@example.com',
    username: 'johndoe',
    bio: 'Hello, I am John Doe.',
    role: 'student',
    created_at: new Date('2022-01-01') // S'adapte au pays du client
  };

  userData?:FormGroup;
  getInfoSub?: Subscription;
  updateInfoSub?: Subscription;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getInfoSub = this.profileService.getUserInfo().subscribe({
        next: (data: Userinfo) => {
          console.log(data);
          this.userInfo = data;
          this.userInfo.created_at = new Date(data.created_at);
          this.createForm();
        },
        error: (err) => {
          console.error('Error fetching course details:', err);
        }
      }
    );

  }

  createForm() {
    this.userData = new FormGroup({
      firstname: new FormControl(this.userInfo.first_name),
      lastname: new FormControl(this.userInfo.last_name),
      username: new FormControl(this.userInfo.username),
      email: new FormControl(this.userInfo.email),
      bio: new FormControl(this.userInfo.bio),
      role: new FormControl(this.userInfo.role)
    });
  }

  ngOnDestroy() {
    this.getInfoSub?.unsubscribe();
    this.updateInfoSub?.unsubscribe();
  }

  onSubmit() {
    this.updateUserInfo();
    //TODO: Check les valeurs pour voir si y'a un changement avant de revoyer a la db
  }

  updateUserInfo() {
    if(this.userData === undefined) {
      return;
    }
    console.log(this.userData.value);
    this.getInfoSub = this.profileService.updateUserInfo(this.userData.value).subscribe({
      next: (data: Userinfo) => {
        console.log(data);
      },
      error: (err) => {
          console.error('Error updating user info:', err);
      },
    });
  }


}
