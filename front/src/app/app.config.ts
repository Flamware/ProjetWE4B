import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideAuth0} from "@auth0/auth0-angular";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-o6cd4ntq3e4xav4u.eu.auth0.com',
      clientId: 'gVbC5EINtdEgMVrHcHTzDxiDm0xHFANZ',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ],
};
