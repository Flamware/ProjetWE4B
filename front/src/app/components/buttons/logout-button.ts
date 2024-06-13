import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {AsyncPipe, CommonModule, DOCUMENT} from '@angular/common';

@Component({
  selector: 'logout-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button (click)="auth.logout({ logoutParams: { returnTo: document.location.origin } })">
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button (click)="auth.loginWithRedirect()">Log in</button>
    </ng-template>
  `,
  styleUrls: ['./login-button.css'],
  imports: [
    CommonModule,
    AsyncPipe
  ],
  standalone: true
})
export class LogoutButton {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}