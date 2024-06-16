import {Component, OnInit} from '@angular/core';
import { CourseService } from './CourseService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  standalone: true,
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit{
  id_cours: number | undefined;
  courinfo: any;

  constructor(private courseService: CourseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id_cours = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });

    this.courseService.getAllCourses().subscribe(data => {
      this.courinfo = data;
    });
  }
}
