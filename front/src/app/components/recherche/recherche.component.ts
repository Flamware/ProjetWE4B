import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {CourseService} from "../../services/course/course.service";
import {Observable} from "rxjs";
import {Course} from "../../models/course";

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.css'
})
export class RechercheComponent implements OnInit{
  listcourses: Course[] = [];
  protected isFocused: boolean | undefined;
  filteredList: Course[] = [];

  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.filteredList = this.listcourses.filter(item =>
      item.title.toLowerCase().startsWith(searchValue)
    );
  }
  constructor( private courseService: CourseService) {
    this.isFocused = false;
    this.filteredList = [];

  }

  ngOnInit(): void {

    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        this.listcourses = response.courses;
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    });


  }
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    setTimeout(() => {
      this.isFocused = false;
    }, 200); // Ajout d'un délai pour permettre le clic sur un élément de la liste
  }

}
