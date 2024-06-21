// recent-courses.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { MyCourseService } from '../../../services/course/my/my-course.service';
import { MyCourse } from '../../../models/mycourse';

@Component({
  selector: 'app-recent-courses',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './recent-courses.component.html',
  styleUrls: ['./recent-courses.component.css']
})
export class RecentCoursesComponent implements OnInit {
  recentCourses: MyCourse[] = [];

  constructor(private courseService: MyCourseService) {}

  ngOnInit(): void {
    this.loadRecentCourses();
  }

  loadRecentCourses(): void {
    this.courseService.getAllCoursesFromUser().subscribe({
      next: (courses) => {
        if (Array.isArray(courses)) {
          this.recentCourses = courses.slice(0, 5); // Display the latest 5 courses
        } else {
          console.error('Error: Expected an array of courses, but received:', courses);
        }
      },
      error: (error) => {
        console.error('Error fetching recent courses:', error);
      }
    });
  }
  
}
