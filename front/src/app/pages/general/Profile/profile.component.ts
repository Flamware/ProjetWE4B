import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {AsyncPipe, NgIf} from "@angular/common";
import {LogoutButton} from "../../../components/buttons/logout-button";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  imports: [
    AsyncPipe,
    NgIf,
    LogoutButton,
    ReactiveFormsModule
  ],
  standalone: true
})
export class ProfileComponent {
  constructor(public auth: AuthService) {}
}
