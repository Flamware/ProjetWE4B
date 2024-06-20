import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../../models/mycourse';
import { CourseService } from '../../../../services/course/course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormCoursComponent} from "../../../../components/form-cours/form-cours.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tous-cours',
  standalone: true,
  imports: [
    FormCoursComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent {
  ListeCours: MyCourse[] = [];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getAllCoursesAndShuffle().subscribe({
      next: (response: any) => {
        this.ListeCours = response.courses;
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    }
      
    );
  }
}