import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formconnexion: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.formconnexion = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.formconnexion.valid) {
      this.authService.register(this.formconnexion.value.username, this.formconnexion.value.email, this.formconnexion.value.password, this.formconnexion.value.nom, this.formconnexion.value.prenom, this.formconnexion.value.role)
        .subscribe(response => {
          console.log(response);
        });
    }
  }
}
