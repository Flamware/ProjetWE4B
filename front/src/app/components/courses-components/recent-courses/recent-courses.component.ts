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
        this.recentCourses = courses.slice(0, 5); // Affiche les 5 cours les plus récents
      },
      error: (error) => {
        console.error('Error fetching recent courses:', error);
      }
    });
  }
}
