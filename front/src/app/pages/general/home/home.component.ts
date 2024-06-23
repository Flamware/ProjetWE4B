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
  imports: [FormCoursComponent, CoursComponent, RecentCoursesComponent],
})
export class HomeComponent {
  showCourses = true;

  ListeCours: Course[] = [];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  }
}
