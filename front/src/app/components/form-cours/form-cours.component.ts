import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyCourseService } from '../../services/course/my/my-course.service';
import { AuthService } from '../../services/auth/auth.service';
import { MyCourse } from '../../models/mycourse';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

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
  selectedImage: { file: File | undefined; preview: string | ArrayBuffer | null; type: string; } | undefined;
  selectedImagePreview: string | ArrayBuffer | null = null;
  selectedMedias: { file: File | undefined, preview: string | ArrayBuffer | null, type: string }[] = [];
  errorMessage: string = '';
  maxMediaCount: number = 3;
  mediaError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private courseService: MyCourseService,
    private authService: AuthService,
    private router: Router
  ) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      theme: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      image: ['']
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

    // Determine how to read based on file type
    if (file.type.startsWith('image')) {
      reader.readAsDataURL(file); // Read image as data URL
    } else if (file.type.startsWith('video')) {
      reader.readAsDataURL(file); // Read video as data URL
    } else if (file.type.startsWith('audio')) {
      reader.readAsDataURL(file); // Read audio as data URL
    } else if (file.type === 'application/pdf') {
      // For PDF files, you may want to handle differently, e.g., using URL.createObjectURL
      reader.readAsDataURL(file); // Read PDF as data URL
    } else {
      reader.readAsDataURL(file); // Fallback for other types (not recommended for non-previewable types)
    }
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

      // Upload l'image principale
      if (this.selectedImage) {
        this.uploadFile(this.selectedImage.file!).subscribe(response => {
          courseData.imageUrl = response.url;
          // Upload des médias
          this.uploadMedias().then(mediaUrls => {
            courseData.mediaUrls = mediaUrls;

            // Créez le cours avec les URLs d'image et de médias
            this.courseService.createCourse(courseData).subscribe({
              next: (data: MyCourse) => {
                console.log('Course created successfully:', data);
                this.myForm.reset();
                this.courseCreated.emit(data);
                this.hideForm();
                this.router.navigate(['/mes-cours']).then(r => console.log('Navigated to /mes-cours'));
              },
              error: (error: any) => {
                console.error('Error creating course:', error);
                this.errorMessage = 'Une erreur est survenue lors de la création du cours. Veuillez réessayer.';
              }
            });
          });
        });
      } else {
        // Si aucune image n'est sélectionnée, créez le cours directement
        this.uploadMedias().then(mediaUrls => {
          courseData.mediaUrls = mediaUrls;

          this.courseService.createCourse(courseData).subscribe({
            next: (data: MyCourse) => {
              console.log('Course created successfully:', data);
              this.myForm.reset();
              this.courseCreated.emit(data);
              this.hideForm();
              this.router.navigate(['/mes-cours']).then(r => console.log('Navigated to /mes-cours'));
            },
            error: (error: any) => {
              console.error('Error creating course:', error);
              this.errorMessage = 'Une erreur est survenue lors de la création du cours. Veuillez réessayer.';
            }
          });
        });
      }
    }
  }

  private uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.authService.uploadFile(file).pipe(
      tap((response: any) => {
        console.log('File uploaded successfully:', response);
      })
    );
  }

  private async uploadMedias(): Promise<string[]> {
    const mediaUrls: string[] = [];

    for (const media of this.selectedMedias) {
      if (media) {
        await this.uploadFile(media.file!).toPromise().then(response => {
          mediaUrls.push(response.url);
        }).catch(error => {
          console.error('Error uploading media:', error);
          this.mediaError = 'Une erreur est survenue lors de l\'upload des médias.';
        });
      }
    }
    return mediaUrls;
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
