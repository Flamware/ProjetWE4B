import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MyCourseService } from '../../services/course/my/my-course.service';
import { MyCourse } from '../../models/mycourse';
import { Router } from "@angular/router";

@Component({
  selector: 'app-form-cours',
  templateUrl: './form-cours.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./form-cours.component.css']
})
export class FormCoursComponent implements OnInit {
  myForm: FormGroup;
  @Output() courseCreated = new EventEmitter<MyCourse>();

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
      image: [''],
      rate: ['']
    });
  }

  ngOnInit(): void {
    this.hideForm();
  }

  submit(): void {
    if (this.myForm.valid) {
      const courseData = this.myForm.value;
      this.courseService.createCourse(courseData).subscribe({
        next: (data: MyCourse) => {
          console.log('Course created successfully:', data);
          this.myForm.reset();
          this.showCourseAddedDialog(); // Show confirmation dialog
          this.hideForm(); // Hide the form
          // Optionally, you can emit an event to notify the parent component
          this.courseCreated.emit(data);
          // Navigate to /mes-cours if needed
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
    // Implement your confirmation dialog here
    alert('Course added successfully!');
  }

  private hideForm(): void {
    let formulaire = document.getElementById('formulaire');
    if (formulaire) {
      formulaire.style.display = 'none';
    }
  }
}
