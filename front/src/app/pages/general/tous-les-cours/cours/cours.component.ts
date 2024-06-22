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
  
    // Extraction de l'extension de fichier
    const extension = mediaUrl.split('.').pop()?.toLowerCase();
  
    // Liste des extensions et leur type de média associé
    const mediaTypeMapping: { [key: string]: string } = {
      // Images
      'jpeg': 'image',
      'jpg': 'image',
      'png': 'image',
      'gif': 'image',
      'bmp': 'image',
      'webp': 'image',
  
      // Vidéos
      'mp4': 'video',
      'mov': 'video',
      'avi': 'video',
      'mkv': 'video',
      'flv': 'video',
      'webm': 'video',
  
      // Audios
      'mp3': 'audio',
      'wav': 'audio',
      'ogg': 'audio',
  
      // Documents
      'pdf': 'document',
      'doc': 'document',
      'docx': 'document',
      'xls': 'document',
      'xlsx': 'document',
      'ppt': 'document',
      'pptx': 'document',
      'txt': 'document',
  
      // Archives
      'zip': 'archive',
      'tar': 'archive',
      'gz': 'archive',
      '7z': 'archive',
  
      // Autres types de fichiers
      'json': 'other',
      'xml': 'other',
      'bin': 'other', // fichiers binaires génériques
    };
  
    // Déterminer le type de média basé sur l'extension
    if (extension && mediaTypeMapping[extension]) {
      return mediaTypeMapping[extension];
    }
  
    return ''; // Retourner une valeur par défaut si aucune correspondance n'est trouvée
  }

  toggleMedia(): void {
    this.showMedia = !this.showMedia;
  }
}