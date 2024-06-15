import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {FormCoursComponent} from "../../../components/form-cours/form-cours.component";

class cours {
  id : number=0;
  nom: string="";
  description: string="";
  date: string="";
  image: string="";

}
@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    FormCoursComponent
  ],
  templateUrl: './mes-cours.component.html',
  styleUrl: './mes-cours.component.css'
})


export class MesCoursComponent {
  cour1: cours = {id: 1, nom: "cours1", description: "description1", date: "date1", image: "image1"};
  cour2: cours = {id: 2, nom: "cours2", description: "description2", date: "date2", image: "image2"};
  cour3: cours = {id: 3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  ListeCours: cours[] = [this.cour1, this.cour2, this.cour3];
}
