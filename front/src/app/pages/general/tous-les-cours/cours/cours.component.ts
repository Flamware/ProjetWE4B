import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../../models/mycourse';
import { CourseService } from '../../../../services/course/course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormCoursComponent} from "../../../../components/form-cours/form-cours.component";
import {NgForOf, NgIf} from "@angular/common";
import { MediaViewerComponent } from '../../../../components/media-viewer/media-viewer.component';

@Component({
  selector: 'app-tous-cours',
  standalone: true,
  imports: [
    FormCoursComponent,
    NgForOf,
    NgIf,
    RouterLink,
    MediaViewerComponent
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent {
  ListeCours: MyCourse[] = [];
  baseUrl = 'http://localhost:3000';
  showMedia: boolean = false; // Ajoutez cette propriété

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
    }
      
    );
  }

  handleCourseCreated(newCourse: MyCourse): void {
    this.ListeCours.push(newCourse); // Add newly created course to the list
  }

  determineMediaType(mediaUrl: string): string {
    if (!mediaUrl) {
      return ''; // Gestion du cas où mediaUrl est null ou undefined
    }
  
    const extension = mediaUrl.split('.').pop()?.toLowerCase();
    if (extension) {
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return 'image';
      } else if (['mp4', 'mov', 'avi'].includes(extension)) {
        return 'video';
      } else if (['mp3', 'wav'].includes(extension)) {
        return 'audio';
      }
    }
  
    return ''; // Retourner une valeur par défaut si aucune correspondance n'est trouvée
  }

  toggleMedia(): void {
    this.showMedia = !this.showMedia;
  }
}