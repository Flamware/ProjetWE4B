import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/general/home/home.component';
import { AboutComponent } from './pages/general/about/about.component';
import { ProfileComponent } from './pages/general/Profile/profile.component';
import {MesCoursComponent} from "./pages/general/mes-cours/mes-cours.component";
import {CoursComponent} from "./pages/general/cours/cours.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: ProfileComponent },
  {path: 'mes-cours', component: MesCoursComponent},
  {path: 'cours', component: CoursComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // redirect to `home` route at startup
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
