import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../../models/mycourse';
import { MyCourseService } from '../../../../services/course/my/my-course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormCoursComponent} from "../../../../components/form-cours/form-cours.component";
import {NgForOf, NgIf} from "@angular/common";
import { MediaViewerComponent } from '../../../../components/media-viewer/media-viewer.component';
import { LinkifyPipe } from '../../../../pipes/linkify.pipe';
import { YoutubeEmbedPipe } from '../../../../pipes/youtube-embed.pipe';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-mes-cours',
  templateUrl: './mes-cours.component.html',
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
  styleUrls: ['./mes-cours.component.css']
})

export class MesCoursComponent implements OnInit {
  ListeCours: MyCourse[] = [];
  baseUrl: string | undefined = environment.baseUrl;
  mediaTypeMapping: any = environment.mediaTypeMapping;
  showMedia: boolean = false;

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
  

  handleCourseCreated(newCourse: MyCourse): void {
    this.ListeCours.push(newCourse);
  }

  deleteCourse(courseId: string): void {
    console.log('Deleting course:', courseId);
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.ListeCours = this.ListeCours.filter(course => course.id !== courseId);
      },
      error: (error: any) => {
        console.error('Error deleting course:', error);
      }
    });
  }

  toggleMedia(): void {
    this.showMedia = !this.showMedia;
  }
}
