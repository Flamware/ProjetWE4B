import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, NgIf } from "@angular/common";
import { ProfileService } from '../../../services/profile/profile.service';
import { Userinfo } from '../../../models/userinfo';
import { Subscription } from 'rxjs';
import {MesDocumentComponent} from '../../../components/mes-document/mes-document.component'
import { environment } from '../../../../../../environments/environment';

type errors = {
  firstname: string,
  lastname: string,
  username: string,
  email: string
};
@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    MesDocumentComponent
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  baseUrl: string | undefined = environment.baseUrl;

  formErrors: errors = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
  };

  userData?:FormGroup;
  getInfoSub?: Subscription;
  updateInfoSub?: Subscription;
  userInfo?: Userinfo;
  profilePictureUrl?: string;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getInfoSub = this.profileService.getUserInfo("Olivier").subscribe({
        next: (data: Userinfo) => {
          console.log(data);
          this.userInfo = data;
          this.userInfo.created_at = new Date(data.created_at);
          this.createForm();
          this.loadProfilePicture();
        },
        error: (err) => {
          console.error('Error fetching course details:', err);
        }
      }
    );

  }

  loadProfilePicture(): void {
    this.profileService.getProfilePictureUrl().subscribe({
      next: (url: string) => {
        this.profilePictureUrl = this.baseUrl + `/${this.userInfo?.profile_picture?.replace(/\\/g, '/')}`;
      },
      error: (error: any) => {
        console.error('Error loading profile picture:', error);
      },
      complete: () => {
        console.log('Profile picture loading completed.');
      }
    });
  }  

  createForm() {
    if(this.userInfo === undefined) {
      return;
    }
    this.userData = new FormGroup({
      firstname: new FormControl(this.userInfo.first_name, [Validators.required, Validators.maxLength(255)]),
      lastname: new FormControl(this.userInfo.last_name, [Validators.required, Validators.maxLength(255)]),
      username: new FormControl(this.userInfo.username, [Validators.required, Validators.maxLength(255)]),
      email: new FormControl(this.userInfo.email, [Validators.required, Validators.email, Validators.maxLength(255)]),
      bio: new FormControl(this.userInfo.bio),
      role: new FormControl(this.userInfo.role, [Validators.required])
    });
  }

  ngOnDestroy() {
    this.getInfoSub?.unsubscribe();
    this.updateInfoSub?.unsubscribe();
  }

  onSubmit() { 
    if(this.userData === undefined) {
      return;
    }
    if(this.userData.invalid) {
      this.setErrors();
      console.log("Form is invalid");
      return;
    }
    this.resetErrors();
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

  private setErrors() {
    const form = this.userData;
    if(form === undefined) {
      return;
    }
    const first_name = form.get('firstname');
    const last_name = form.get('lastname');
    const username = form.get('username');
    const email = form.get('email');

    if(first_name && first_name.errors) {
      Object.keys(first_name.errors).forEach((key) => {
        switch(key) {
          case 'required':
            this.formErrors.firstname = 'First name is required';
            break;
          case 'maxlength':
            this.formErrors.firstname = 'First name is too long';
            break;
        }
      });
    }
    if(last_name && last_name.errors) {
      Object.keys(last_name.errors).forEach((key) => {
        switch(key) {
          case 'required':
            this.formErrors.lastname = 'Last name is required';
            break;
          case 'maxlength':
            this.formErrors.lastname = 'Last name is too long';
            break;
        }
      });
    }
    if(username && username.errors) {
      Object.keys(username.errors).forEach((key) => {
        switch(key) {
          case 'required':
            this.formErrors.username = 'Username is required';
            break;
          case 'maxlength':
            this.formErrors.username = 'Username is too long';
            break;
        }
      });
    }
    if(email && email.errors) {
      Object.keys(email.errors).forEach((key) => {
        switch(key) {
          case 'required':
            this.formErrors.email = 'Email is required';
            break;
          case 'email':
            this.formErrors.email = 'Email is invalid';
            break;
          case 'maxlength':
            this.formErrors.email = 'Email is too long';
            break;
        }
      });
    }
  }

  private resetErrors() {
    this.formErrors.firstname = '';
    this.formErrors.lastname = '';
    this.formErrors.username = '';
    this.formErrors.email = '';
  }

}
