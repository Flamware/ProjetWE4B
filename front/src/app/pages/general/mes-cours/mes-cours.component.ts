import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './mes-cours.component.html',
  styleUrl: './mes-cours.component.css'
})
export class MesCoursComponent {
  listeCours: any = [1,2,3,4,5]

}
