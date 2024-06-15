import {Component, OnInit} from '@angular/core';
import { CourseService } from './CourseService';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  standalone: true,
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit{
  courinfo: any;

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.courseService.getAllCourses().subscribe(data => {
      this.courinfo = data;
    });
  }
}
