import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import {RechercheComponent} from "../components/recherche/recherche.component";
import { ProfileService } from '../services/profile/profile.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    RechercheComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isconnected: boolean = false; // Assurez-vous que cette propriété est correctement définie
  profilePictureUrl: string | undefined;
  @ViewChild('boutonlogin') boutonlogin: ElementRef | undefined;

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.authService.authStatus.subscribe((status: boolean) => {
      this.isconnected = status;
      if (status) {
        // Chargez l'image de profil si l'utilisateur est connecté
        this.loadProfilePicture();
      } else {
        this.profilePictureUrl = undefined;
      }
    });
  }

  loadProfilePicture(): void {
    // Utilisation du service ProfileService pour récupérer l'URL de l'image de profil
    this.profileService.getProfilePictureUrl().subscribe({
      next: (url: string) => {
        // Assurez-vous que l'URL ne contient que des slashes ('/') et non des backslashes ('\')
        this.profilePictureUrl = `http://localhost:3000/${url.replace(/\\/g, '/')}`;
      },
      error: (error: any) => {
        console.error('Error loading profile picture:', error);
      },
      complete: () => {
        console.log('Profile picture loading completed.');
      }
    });
  }  

  logout(): void {
    this.authService.logout();
  }
}
