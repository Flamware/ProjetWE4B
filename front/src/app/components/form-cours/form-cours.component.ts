import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyCourseService } from '../../services/course/my/my-course.service';
import { MyCourse } from '../../models/mycourse';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-cours',
  templateUrl: './form-cours.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule // Ensure ReactiveFormsModule is imported here
  ],
  styleUrls: ['./form-cours.component.css']
})
export class FormCoursComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: MyCourseService
  ) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      theme: ['', Validators.required],
      date: [''],
      image: [''],
      rate: ['']
    });
    console.log('Form initialized:', this.myForm);
  }

  ngOnInit(): void {
    console.log('FormCoursComponent initialized');
    let formulaire = document.getElementById('formulaire');
    if (formulaire) {
      formulaire.style.display = 'none';
    }
  }

  submit(): void {
    console.log('Submit button clicked');
    if (this.myForm.valid) {
      console.log('Form is valid. Submitting...');
      const courseData = this.myForm.value;
      this.courseService.createCourse(courseData).subscribe({
        next: (data: MyCourse) => {
          console.log('Course created successfully:', data);
          // Réinitialiser le formulaire ou effectuer toute autre action nécessaire
          this.myForm.reset();
        },
        error: (error: any) => {
          console.error('Error creating course:', error);
          // Gérer l'erreur de création de cours ici
        }
      });
    } else {
      console.log('Form is invalid. Cannot submit.');
    }
  }
  

  afficher(): void {
    console.log('Toggle display of formulaire');
    let formulaire = document.getElementById('formulaire');
    let btn = document.getElementById('bouttonafficher');
    if (formulaire) {
      if (getComputedStyle(formulaire).display != 'none') {
        formulaire.style.display = 'none';
        if (btn) {
          btn.innerHTML = 'Ajouter un cours';
        }
      } else {
        formulaire.style.display = 'block';
        if (btn) {
          btn.innerHTML = 'Fermer';
        }
      }
    }
  }
}
