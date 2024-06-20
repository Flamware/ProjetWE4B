import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../../models/mycourse';
import { MyCourseService } from '../../../../services/course/my/my-course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormCoursComponent} from "../../../../components/form-cours/form-cours.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-mes-cours',
  templateUrl: './mes-cours.component.html',
  standalone: true,
  imports: [
    FormCoursComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./mes-cours.component.css']
})
export class MesCoursComponent implements OnInit {
  ListeCours: MyCourse[] = [];

  constructor(
    private courseService: MyCourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getAllCoursesFromUser().subscribe({
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

  deleteCourse(courseId: string): void {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.ListeCours = this.ListeCours.filter(course => course.id !== courseId);
      },
      error: (error: any) => {
        console.error('Error deleting course:', error);
      }
    });
  }
}
