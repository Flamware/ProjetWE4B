import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MesDocumentComponent } from '../../../../../components/mes-document/mes-document.component';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../../../services/course/course.service';
import { Course } from '../../../../../models/course';
import { MediaViewerComponent } from '../../../../../components/media-viewer/media-viewer.component';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  standalone: true,
  imports: [
    MesDocumentComponent,
    NgOptimizedImage,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MediaViewerComponent
  ],
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {
  baseUrl = 'http://localhost:3000'; // Ajoutez ici votre préfixe d'URL
  id_cours: number | undefined;
  courinfo: Course | undefined; // Déclarez courinfo comme un type ou undefined
  rating: FormGroup;
  showMedia: boolean = false; // Ajoutez cette propriété

  constructor(

    private route: ActivatedRoute,
    private courseService: CourseService // Injection du service
  ) {
    this.rating = new FormGroup({
      stars: new FormControl(0, Validators.required)
    });
  }

  toggleMedia(): void {
    this.showMedia = !this.showMedia;
  }
  
  // Méthode pour gérer la notation
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
      this.id_cours = params['id']; // Récupérer l'ID du cours
      if(!this.id_cours){
        console.error('No course ID provided');
        return;
      }

      this.loadCourse(this.id_cours)
    }); // Charger les détails du cours
  }

  // Méthode pour charger les détails du cours
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
}
