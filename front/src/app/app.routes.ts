import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/general/home/home.component';
import { AboutComponent } from './pages/general/about/about.component';
import { ProfileComponent } from './pages/general/Profile/profile.component';
import {MesCoursComponent} from "./pages/general/mes-cours/mes-cours.component";
import {CoursComponent} from "./pages/general/cours/cours.component";
import {MessageComponent} from "./pages/general/message/message.component";
import {MesDocumentComponent} from "./components/mes-document/mes-document.component";
import {ConnexionComponent} from "./pages/general/connexion/connexion.component";
import {RegisterComponent} from "./pages/general/register/register.component";
import {TestComponent} from "../../../src/app/test/test.component";
import {AuthGuard} from "./services/auth/AuthGuard.service";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'mes-cours', component: MesCoursComponent, canActivate: [AuthGuard]},
  {path: 'cours/:id', component: CoursComponent},
  {path: 'message/:contact', component: MessageComponent, canActivate: [AuthGuard]},
  {path : 'mes-document', component: MesDocumentComponent, canActivate: [AuthGuard]},
  {path : 'login', component: ConnexionComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'test', component: TestComponent}, // Add the TestComponent route
  {path: '', redirectTo: '/home', pathMatch: 'full' }, // redirect to `home` route at startup
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
