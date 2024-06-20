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
    if(!this.id_cours){
      console.error('No course ID provided');
      return;
    }
    this.courseService.rateCourse(this.id_cours, value).subscribe({
      next: (data: Course) => {
        console.log('Course rated:', data);
      },
      error: (error) => {
        console.error('Error rating course:', error);
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_cours = params['id']; // Récupérer l'ID du cours
      if(!this.id_cours){
        console.error('No course ID provided');
        return;
      }

      this.loadCourse(this.id_cours)
    }); // Charger les détails du cours
  }

  // Méthode pour charger les détails du cours
  private loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (response: any) => {
        this.courinfo = response.course;
        console.log('Course details:', this.courinfo);

      },
      error: (error) => {
        console.error('Error fetching course details:', error);
      }
    });
  }
}
