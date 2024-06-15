import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent {
  courinfo = {
    image : 'https://via.placeholder.com/150',
    title: 'Math',
    description: 'This is a math course',
    teacher: 'John Doe',

  }

}
