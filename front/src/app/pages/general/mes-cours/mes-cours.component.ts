import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../models/mycourse';
import { MyCourseService } from '../../../services/course/my/my-course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { NgModule } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormCoursComponent} from "../../../components/form-cours/form-cours.component";

@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    FormCoursComponent,
    RouterLink,
    NgIf
  ],
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.css']
})
export class MesCoursComponent implements OnInit {
  ListeCours: MyCourse[] = [];
  userId: number | undefined;

  constructor(
    private courseService: MyCourseService,
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
    console.log('Loading courses');
    this.courseService.getCoursesByUserId(userId).subscribe({
      next: (data: MyCourse[]) => {
        this.ListeCours = data;
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    });
  }
}
