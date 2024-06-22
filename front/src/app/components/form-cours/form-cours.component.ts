import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyCourseService } from '../../services/course/my/my-course.service';
import { MyCourse } from '../../models/mycourse';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-form-cours',
  templateUrl: './form-cours.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./form-cours.component.css']
})
export class FormCoursComponent implements OnInit {
  myForm: FormGroup;
  @Output() courseCreated = new EventEmitter<MyCourse>();
  selectedImage: { file: File | undefined; preview: string | ArrayBuffer | null; type: string } | undefined;
  selectedMedias: { file: File | undefined, preview: string | ArrayBuffer | null, type: string }[] = [];
  errorMessage: string = '';
  maxMediaCount: number = 3;
  mediaError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private courseService: MyCourseService,
    private router: Router
  ) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      theme: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.hideForm();
    this.myForm.patchValue({
      date: this.getCurrentDate()
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type.split('/')[0]; // Get the type of file (image, video, audio, etc.)

      this.previewFile(file, (result) => {
        this.selectedImage = {
          file,
          preview: result,
          type: fileType
        };
      });
    }
  }

  onMediaSelected(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type.split('/')[0]; // Get the type of file (image, video, audio, etc.)

      this.previewFile(file, (result) => {
        // Clone the input file element to preserve the selection
        const clonedInput = input.cloneNode(true) as HTMLInputElement;
        input.parentNode?.replaceChild(clonedInput, input); // Replace original input with cloned one

        this.selectedMedias[index] = {
          file,
          preview: result,
          type: fileType
        };
      });
    }
  }

  previewFile(file: File, callback: (result: string | ArrayBuffer | null) => void): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      callback(e.target.result);
    };

    // Read file as data URL
    reader.readAsDataURL(file);
  }

  addMediaInput(): void {
    if (this.selectedMedias.length >= this.maxMediaCount) {
      this.mediaError = `Vous ne pouvez ajouter que ${this.maxMediaCount} médias au maximum.`;
    } else {
      this.selectedMedias.push({ file: undefined, preview: null, type: '' });
      this.mediaError = '';
    }
  }

  removeMediaInput(index: number): void {
    this.selectedMedias.splice(index, 1);
    if (this.selectedMedias.length < this.maxMediaCount) {
      this.mediaError = '';
    }
  }

  submit(): void {
    if (this.myForm.valid) {
      const courseData: any = {
        name: this.myForm.get('name')?.value,
        theme: this.myForm.get('theme')?.value,
        description: this.myForm.get('description')?.value,
        date: this.myForm.get('date')?.value
      };

      // Create course first
      this.courseService.createCourse(courseData).subscribe({
        next: (data:{ course: MyCourse }) => {
          console.log('Course created successfully ---> :', data);
          courseData.id = data.course.id; // Store the created course ID in courseData

          console.log('Course Data ---->:', courseData.id, data.course.id);

          // Upload main image if selected
          if (this.selectedImage) {
            this.uploadFile(courseData.id, this.selectedImage.file!).subscribe(response => {
              courseData.imageUrl = response.url;
              // Upload media files
              this.uploadMedias(courseData.id).then(mediaUrls => {
                courseData.mediaUrls = mediaUrls;
                this.finalizeCourseCreation(courseData);
              });
            });
          } else {
            console.log(this.selectedMedias.length);
            if (this.selectedMedias.length > 0) {
              // If no media selected, create course directly
              this.uploadMedias(courseData.id).then(mediaUrls => {
                courseData.mediaUrls = mediaUrls;
                this.finalizeCourseCreation(courseData);
              });
            } else {
              this.hideForm();
              this.router.navigate(['/mes-cours']).then(r => console.log('Navigated to /mes-cours'));
            }
          }
        },
        error: (error: any) => {
          console.error('Error creating course:', error);
          this.errorMessage = 'Une erreur est survenue lors de la création du cours. Veuillez réessayer.';
        }
      });
    }
  }

  private finalizeCourseCreation(courseData: any): void {
    this.courseService.updateCourseMedias(courseData.id, courseData.mediaUrls, courseData.imageUrl).subscribe({
      next: (response: any) => {
        console.log('Media URLs updated for course:', courseData.id);
        this.myForm.reset();
        this.courseCreated.emit(response.course);
        this.hideForm();
        this.router.navigate(['/mes-cours']).then(r => console.log('Navigated to /mes-cours'));
      },
      error: (error: any) => {
        console.error('Error updating media URLs for course:', courseData.id, error);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour des URLs de médias du cours. Veuillez réessayer.';
      }
    });
  }

  private uploadFile(courseId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.courseService.uploadFile(courseId, formData).pipe(
      catchError(err => {
        console.error('Upload failed:', err);
        return throwError(err);
      })
    );
  }

  private async uploadMedias(courseId: string): Promise<string[]> {
    const mediaUrls: string[] = [];
  
    for (const media of this.selectedMedias) {
      if (media.file) {
        try {
          // Utiliser lastValueFrom pour convertir l'Observable en Promise
          const response = await lastValueFrom(this.uploadFile(courseId, media.file));
          if (response.url) {  // Vérifie que l'URL n'est pas nulle
            mediaUrls.push(response.url);
          } else {
            console.error('No URL returned for media:', media.file);
            this.mediaError = 'Une erreur est survenue lors de l\'upload des médias.';
          }
        } catch (error) {
          console.error('Error uploading media:', error);
          this.mediaError = 'Une erreur est survenue lors de l\'upload des médias.';
        }
      }
    }
  
    return mediaUrls.filter(url => url); // Filtre les URLs nulles ou indéfinies
  }
  

  afficher(): void {
    const formulaire = document.getElementById('formulaire');
    if (formulaire) {
      const display = getComputedStyle(formulaire).display;
      formulaire.style.display = display === 'none' ? 'block' : 'none';
    }
  }

  hideForm(): void {
    const formulaire = document.getElementById('formulaire');
    if (formulaire) {
      formulaire.style.display = 'none';
    }
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // +1 because months are zero indexed
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
