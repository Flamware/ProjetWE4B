import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyCourseService } from '../../services/course/my/my-course.service';
import { MyCourse } from '../../models/mycourse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-cours',
  templateUrl: './form-cours.component.html',
  standalone: true,
  styleUrls: ['./form-cours.component.css']
})
export class FormCoursComponent implements OnInit {
  myForm: FormGroup;
  @Output() courseCreated = new EventEmitter<MyCourse>();
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: MyCourseService,
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
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submit(): void {
    if (this.myForm.valid) {
      const formData = new FormData();
      formData.append('name', this.myForm.get('name')?.value);
      formData.append('theme', this.myForm.get('theme')?.value);
      formData.append('description', this.myForm.get('description')?.value);
      formData.append('date', this.myForm.get('date')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.courseService.createCourse(formData).subscribe({
        next: (data: MyCourse) => {
          console.log('Course created successfully:', data);
          this.myForm.reset();
          this.showCourseAddedDialog();
          this.hideForm();
          this.courseCreated.emit(data);
          this.router.navigate(['/mes-cours']).then(r => console.log('Navigated to /mes-cours'));
        },
        error: (error: any) => {
          console.error('Error creating course:', error);
        }
      });
    }
  }

  afficher(): void {
    let formulaire = document.getElementById('formulaire');
    if (formulaire) {
      if (getComputedStyle(formulaire).display != 'none') {
        formulaire.style.display = 'none';
      } else {
        formulaire.style.display = 'block';
      }
    }
  }

  private showCourseAddedDialog(): void {
    alert('Course added successfully!');
  }

  private hideForm(): void {
    let formulaire = document.getElementById('formulaire');
    if (formulaire) {
      formulaire.style.display = 'none';
    }
  }
}
