import { Component } from '@angular/core';
import { FormCoursComponent } from '../../../components/form-cours/form-cours.component';
import {NgForOf, NgIf} from "@angular/common";
import {MyCourse} from "../../../models/mycourse";
import {MyCourseService} from "../../../services/course/my/my-course.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CourseService} from "../../../services/course/course.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [FormCoursComponent, NgForOf, NgIf, RouterLink],
})
export class HomeComponent {
  ListeCours: MyCourse[] = [];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getAllCourse().subscribe({
        next: (response: any) => {
          this.ListeCours = response.courses;
        },
        error: (error: any) => {
          console.error('Error fetching courses:', error);
        }
      }

    );
  }

  handleCourseCreated(newCourse: MyCourse): void {
    this.ListeCours.push(newCourse); // Add newly created course to the list
  }
}
