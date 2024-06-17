import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
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
    NgIf,
    NgOptimizedImage,
    FormCoursComponent
  ],
  templateUrl: './mes-cours.component.html',
  styleUrl: './mes-cours.component.css'
})


export class MesCoursComponent {
  showForm: boolean = false;
  cour1: cours = {id: 1, nom: "cours1", description: "description1", date: "date1", image: "image1"};
  cour2: cours = {id: 2, nom: "cours2", description: "description2", date: "date2", image: "image2"};
  cour3: cours = {id: 3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour4: cours = {id: 3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour5: cours = {id: 3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour6: cours = {id: 3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour7: cours = {id: 3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  cour8: cours = {id: 3, nom: "cours3", description: "description3", date: "date3", image: "image3"};
  ListeCours: cours[] = [this.cour1, this.cour2, this.cour3, this.cour4, this.cour5, this.cour6, this.cour7, this.cour8];
}
