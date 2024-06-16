import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MesDocumentComponent} from "../../../components/mes-document/mes-document.component";
import {NgOptimizedImage} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  standalone: true,
  imports: [
    MesDocumentComponent,
    NgOptimizedImage
  ],
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit{
  id_cours: number | undefined;
  courinfo: any = {
    teacher: 'Nom du professeur',
    title: 'Titre du cours',
    description: 'Description du cours'
  };



  constructor( private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id_cours = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });

    ///this.courseService.getAllCourses().subscribe(data => {
      ///this.courinfo = data;
    ////});
  }
}
