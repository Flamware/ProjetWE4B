import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormCoursComponent} from "../../../components/form-cours/form-cours.component";
import {HttpClientModule} from "@angular/common/http";

class cours {
  id : number=0;
  nom: string="";
  description: string="";
  date: string="";
  image: string="";
  rate: number=0;

}
@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    FormCoursComponent,
    RouterLink,
    HttpClientModule,
    NgIf
  ],
  templateUrl: './mes-cours.component.html',
  styleUrl: './mes-cours.component.css'
})


export class MesCoursComponent {
  cour1: cours = {id: 1,rate:4.5, nom: "cours1", description: "description1", date: "date1", image: "image1"};
  cour2: cours = {id: 2,rate:2, nom: "cours2", description: "description2", date: "date2", image: "image2"};
  cour3: cours = {id: 3,rate:4, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour4: cours = {id: 3,rate:4, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour5: cours = {id: 3,rate:3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour6: cours = {id: 3,rate:4, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour7: cours = {id: 3,rate:8, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour8: cours = {id: 3,rate:4, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  ListeCours: cours[] = [this.cour1, this.cour2, this.cour3, this.cour4, this.cour5, this.cour6, this.cour7, this.cour8];
  protected readonly clearInterval = clearInterval;
  protected readonly onclick = onclick;
  protected readonly Math = Math;
}
