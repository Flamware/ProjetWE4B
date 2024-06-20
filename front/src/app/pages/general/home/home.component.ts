import { Component } from '@angular/core';
import { FormCoursComponent } from '../../../components/form-cours/form-cours.component';
import { RecentCoursesComponent } from '../../../components/courses-components/recent-courses/recent-courses.component';
import {Course} from "../../../models/course";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CourseService} from "../../../services/course/course.service";
import { CoursComponent } from '../tous-les-cours/cours/cours.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [FormCoursComponent, CoursComponent, RecentCoursesComponent], // Assurez-vous que MesCoursComponent est ici
})
export class HomeComponent {
  showCourses = true;

  ListeCours: Course[] = [];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    /*this.loadCourses();*/
  }

  /*
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
  }*/
}
