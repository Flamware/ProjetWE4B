import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MesDocumentComponent } from '../../../components/mes-document/mes-document.component';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../services/course/course.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  standalone: true,
  imports: [
    MesDocumentComponent,
    NgOptimizedImage,
    RouterLink,
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {
  id_cours: number | undefined;
  courinfo: Course | undefined; // Déclarez courinfo comme un type ou undefined
  rating: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService // Injection du service
  ) {
    this.rating = new FormGroup({
      stars: new FormControl(0, Validators.required)
    });
  }

  // Méthode pour gérer la notation
  rate(value: number): void {
    console.log(`Rated with ${value} stars`);
    if (this.courinfo) {
      // Logique de notation à ajouter ici
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_cours = +params['id']; // Convertit l'ID de chaîne en nombre
      if (this.id_cours) {
        this.loadCourse(this.id_cours); // Charger les détails du cours
      }
    });
  }

  // Méthode pour charger les détails du cours
  private loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe(
      (data: Course) => {
        this.courinfo = data;
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
}
