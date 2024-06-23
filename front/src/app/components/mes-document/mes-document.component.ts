import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup ,ReactiveFormsModule,Validators} from '@angular/forms';
import {NgForOf} from "@angular/common";
import { catchError, throwError } from 'rxjs';
import { MyCourseService } from '../../services/course/my/my-course.service';

@Component({
  selector: 'app-mes-document',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './mes-document.component.html',
  styleUrl: './mes-document.component.css'
})
export class MesDocumentComponent {
  baseUrl = 'http://localhost:3000/src'; // Ajoutez ici votre préfixe d'URL
  uploadForm: FormGroup;
  selectedFile: { file: File | null; } | undefined
  files: any[] = [];

  constructor(private courseService: MyCourseService, private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      namefile: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getFiles();
  }

  getFiles(): void {
    this.courseService.getRessources().subscribe(
      data => {
        this.files = data;
      },
      error => {
        console.error('Error fetching resources:', error);
      }
    );
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = { file };
    }
  }

  async upload(): Promise<void> {
    console.log(this.selectedFile, this.uploadForm.get('namefile')?.value);
    if (this.uploadForm.valid && this.selectedFile) {
      const fileName = this.uploadForm.get('namefile')?.value;

      try {
        const response = await this.uploadResourceFile(this.selectedFile.file!, fileName);
        console.log('Upload successful:', response);
        this.getFiles(); // Mettre à jour la liste des documents après l'upload
      } catch (error) {
        console.error('Error uploading file:', error);
        // Gérer l'erreur d'upload ici
      }
    } else {
      console.error('Form is invalid or file is not selected');
      // Gérer le cas où le formulaire n'est pas else {
      console.error('File or name is invalid');
      // Gérer le cas où le fichier ou le nom est invalide
    }
  }

  private async uploadResourceFile(file: File, fileName: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file, fileName);

    return this.courseService.uploadResourceFile(formData).pipe(
      catchError(err => {
        console.error('Upload failed:', err);
        return throwError(() => err); // Utilisation de la fonction factory pour throwError
      })
    ).toPromise();
  }
}
