import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../models/mycourse';
import { CourseService } from '../../../services/course/my/my-course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { NgModule } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormCoursComponent} from "../../../components/form-cours/form-cours.component";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    FormCoursComponent,
    RouterLink,
    HttpClientModule,
    NgIf
  ],
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.css']
})
export class MesCoursComponent implements OnInit {
  ListeCours: MyCourse[] = [];
  userId: number | undefined;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  round(value: number): number {
    return Math.round(value);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId']; // Assuming the userId is passed in the URL
      if (this.userId) {
        this.loadCourses(this.userId);
      }
    });
  }

  private loadCourses(userId: number): void {
    this.courseService.getCoursesByUserId(userId).subscribe(
      (data: MyCourse[]) => {
        this.ListeCours = data;
      },
      error => {
        console.error('Error fetching courses:', error);
      }
    );
  }
}
