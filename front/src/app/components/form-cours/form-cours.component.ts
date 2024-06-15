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
export class FormCoursComponent implements OnInit {
  myForm: FormGroup;
  ngOnInit() {
    let formulaire = document.getElementById("formulaire");
    // @ts-ignore
    formulaire.style.display = "none";
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

   afficher() : void{
    let formulaire = document.getElementById("formulaire");
    let btn = document.getElementById("bouttonafficher");
    // @ts-ignore
    if(getComputedStyle(formulaire).display != "none"){
      // @ts-ignore
      formulaire.style.display = "none";
      // @ts-ignore
      btn.innerHTML = "Ajouter un cours";

    } else {
      // @ts-ignore
      formulaire.style.display = "block";
      // @ts-ignore
      btn.innerHTML = "Fermer";
    }
  }

}

