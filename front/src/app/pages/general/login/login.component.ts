import { Component } from '@angular/core';
import {LoginButton} from "../../../components/buttons/login-button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoginButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
}
