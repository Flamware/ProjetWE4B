import { Renderer2, Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../services/auth/auth.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {

  formconnexion: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.formconnexion = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    this.authService.login(this.formconnexion.value.email, this.formconnexion.value.password)
      .subscribe({
        next: response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('userId', response.userId);
            this.router.navigate(['/']).then(r => console.log(r));
          }
        },
        error: err => {
          console.log(err);
          this.errorMessage = 'Login incorrect. Please check your credentials.';
        }
      });
  }
}
