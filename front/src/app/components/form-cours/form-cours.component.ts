import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup ,ReactiveFormsModule,Validators} from '@angular/forms';
import { CourseService } from '../../services/course/my/my-course.service';



@Component({
  selector: 'app-form-cours',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './form-cours.component.html',
  styleUrls: ['./form-cours.component.css']
})


export class FormCoursComponent implements OnInit {
  myForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    theme: new FormControl('', Validators.required)
  });

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    let formulaire = document.getElementById('formulaire');
    if (formulaire) {
      formulaire.style.display = 'none';
    }
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const courseData = this.myForm.value;
      this.courseService.createCourse(courseData).subscribe(
        (data) => {
          console.log('Course created successfully:', data);
          this.myForm.reset();
        },
        (error) => {
          console.error('Error creating course:', error);
        }
      );
    }
  }

  afficher(): void {
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

