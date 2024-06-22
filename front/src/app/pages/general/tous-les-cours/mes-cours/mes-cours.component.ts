import { Component, OnInit } from '@angular/core';
import { MyCourse } from '../../../../models/mycourse';
import { MyCourseService } from '../../../../services/course/my/my-course.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormCoursComponent} from "../../../../components/form-cours/form-cours.component";
import {NgForOf, NgIf} from "@angular/common";
import { MediaViewerComponent } from '../../../../components/media-viewer/media-viewer.component';
import { LinkifyPipe } from '../../../../pipes/linkify.pipe';

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
    LinkifyPipe
  ],
  styleUrls: ['./mes-cours.component.css']
})

export class MesCoursComponent implements OnInit {
  ListeCours: MyCourse[] = [];
  baseUrl = 'http://localhost:3000'; // Ajoutez ici votre préfixe d'URL
  showMedia: boolean = false; // Ajoutez cette propriété

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
    }

    );
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
  

  handleCourseCreated(newCourse: MyCourse): void {
    this.ListeCours.push(newCourse); // Add newly created course to the list
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
