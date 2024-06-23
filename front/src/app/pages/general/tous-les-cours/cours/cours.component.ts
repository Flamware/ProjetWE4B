import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../../models/mycourse';
import { CourseService } from '../../../../services/course/course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormCoursComponent} from "../../../../components/form-cours/form-cours.component";
import {NgForOf, NgIf} from "@angular/common";
import { MediaViewerComponent } from '../../../../components/media-viewer/media-viewer.component';
import { LinkifyPipe } from '../../../../pipes/linkify.pipe';
import { YoutubeEmbedPipe } from '../../../../pipes/youtube-embed.pipe';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-tous-cours',
  standalone: true,
  imports: [
    FormCoursComponent,
    NgForOf,
    NgIf,
    RouterLink,
    MediaViewerComponent,
    LinkifyPipe,
    YoutubeEmbedPipe
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})

export class CoursComponent {
  ListeCours: MyCourse[] = [];
  baseUrl: string | undefined = environment.baseUrl;
  mediaTypeMapping: any = environment.mediaTypeMapping;
  showMedia: boolean = false;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getAllCoursesAndShuffle().subscribe({
      next: (response: any) => {
        this.ListeCours = response.courses;
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    });
  }

  handleCourseCreated(newCourse: MyCourse): void {
    this.ListeCours.push(newCourse);
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

  toggleMedia(): void {
    this.showMedia = !this.showMedia;
  }
}