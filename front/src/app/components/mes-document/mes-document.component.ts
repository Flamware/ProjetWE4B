import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup ,ReactiveFormsModule,Validators} from '@angular/forms';
import {NgForOf} from "@angular/common";

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
  uploadForm: FormGroup;

  files= [{name:"file1",url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Lapin_belier_hollandais.jpg/1920px-Lapin_belier_hollandais.jpg"},{name:"file2",url:"C:\\Users\\Gachelin Estouan\\Documents\\test.txt"}];

  oninit(){
    this.files = this.getfiles();

  }


  getfiles():any{

  }
  constructor() {
    this.uploadForm = new FormGroup({
      file: new FormControl('', [Validators.required]),
      namefile: new FormControl('', [Validators.required]),

    });
  }
    upload() {
    console.log(this.uploadForm.value);
  }

}