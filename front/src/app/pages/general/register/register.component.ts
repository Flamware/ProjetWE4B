import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import {NgIf} from "@angular/common";
import { Router } from '@angular/router';

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
  profilePictureFile: File | null = null;
  profilePicturePreview: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formconnexion = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.formconnexion = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePictureFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(this.profilePictureFile);
    }
  }
  
  submit(): void {
    if (this.formconnexion.valid) {
      const formData = new FormData();
      formData.append('username', this.formconnexion.get('username')?.value);
      formData.append('email', this.formconnexion.get('email')?.value);
      formData.append('nom', this.formconnexion.get('nom')?.value);
      formData.append('prenom', this.formconnexion.get('prenom')?.value);
      formData.append('password', this.formconnexion.get('password')?.value);
      formData.append('role', this.formconnexion.get('role')?.value);
  
      // Register the user first
      this.authService.register(formData).subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);
          
          // If registration is successful, attempt to upload profile picture
          if (this.profilePictureFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('profilePicture', this.profilePictureFile);
            uploadFormData.append('email', this.formconnexion.get('email')?.value);

  
            this.authService.uploadProfilePicture(uploadFormData).subscribe({
              next: () => {
                console.log('Profile picture uploaded successfully');
                // Optionally, redirect or notify user of successful registration and upload
              },
              error: (uploadError) => {
                console.error('Error uploading profile picture:', uploadError);
                // Handle error uploading profile picture
              }
            });
          }
        },
        error: (registrationError) => {
          console.error('Error during registration', registrationError);
          // Handle error during registration
        },
        complete: () => {
          console.log('Registration request complete');
          // Redirect to login page after registering
          this.router.navigate(['/login']);
        }
      });
    } else {
      console.error('Form is not valid');
    }
    
  }
  
}
