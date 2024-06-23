import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../../../services/course/course.service';
import { Course } from '../../../../../models/course';
import { MediaViewerComponent } from '../../../../../components/media-viewer/media-viewer.component';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MediaViewerComponent
  ],
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {
  baseUrl: string | undefined = environment.baseUrl;
  mediaTypeMapping: any = environment.mediaTypeMapping;
  id_cours: number | undefined;
  courinfo: Course | undefined;
  rating: FormGroup;
  showMedia: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {
    this.rating = new FormGroup({
      stars: new FormControl(0, Validators.required)
    });
  }

  toggleMedia(): void {
    this.showMedia = !this.showMedia;
  }

  rate(value: number): void {
    console.log(`Rated with ${value} stars`);
    if(!this.id_cours){
      console.error('No course ID provided');
      return;
    }
    this.courseService.rateCourse(this.id_cours, value).subscribe({
      next: (data: Course) => {
        console.log('Course rated:', data);
      },
      error: (error) => {
        console.error('Error rating course:', error);
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_cours = params['id'];
      if(!this.id_cours){
        console.error('No course ID provided');
        return;
      }

      this.loadCourse(this.id_cours)
    });
  }

  private loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (response: any) => {
        this.courinfo = response.course;
        console.log('Course details:', this.courinfo);

      },
      error: (error) => {
        console.error('Error fetching course details:', error);
      }
    });
  }

  determineMediaType(mediaUrl: string): string {
    if (!mediaUrl) {
      return '';
    }

    const extension = mediaUrl.split('.').pop()?.toLowerCase();
    if (extension && this.mediaTypeMapping[extension]) {
      return this.mediaTypeMapping[extension];
    }
    return '';
  }
}
