import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup ,ReactiveFormsModule,Validators} from '@angular/forms';



@Component({
  selector: 'app-form-cours',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './form-cours.component.html',
  styleUrl: './form-cours.component.css'
})
export class FormCoursComponent implements OnInit {myForm: FormGroup;
  ngOnInit() {
  }

  constructor() {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      theme: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.myForm.value);
  }

}

