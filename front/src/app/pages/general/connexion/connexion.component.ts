import { Component } from '@angular/core';
import { FormControl, FormGroup ,ReactiveFormsModule,Validators} from '@angular/forms';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {

  formconnexion: FormGroup;
  constructor( private authService: AuthService, private router: Router) {
    this.formconnexion = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

  }
  submit() {
    this.authService.login(this.formconnexion.value.email, this.formconnexion.value.password)
      .subscribe(response => {
        console.log(response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userId', response.userId);
          this.router.navigate(['/']).then(r => console.log(r));
        }
      });
  }

}
