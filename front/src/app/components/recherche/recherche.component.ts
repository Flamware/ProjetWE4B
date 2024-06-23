import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {CourseService} from "../../services/course/course.service";
import {Observable} from "rxjs";
import {Course} from "../../models/course";
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SlicePipe
  ],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.css'
})
export class RechercheComponent implements OnInit{
  listcourses: Course[] = [];
  protected isFocused: boolean | undefined;
  filteredList: Course[] = [];
  @ViewChild('results') results!: ElementRef;

  constructor( private courseService: CourseService, public router: Router) {
    this.isFocused = false;
    this.filteredList = [];
  }

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        this.listcourses = response.courses;
        this.filteredList = this.listcourses;
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    });
  }

  onFocus() {
    this.isFocused = true;
    console.log('focus');
    this.setResultsWidth();
  }
  
  onBlur() {
    setTimeout(() => {
      this.isFocused = false;
    }, 200); // Ajout d'un délai pour permettre le clic sur un élément de la liste
    const searchbar: HTMLInputElement = document.getElementById('searchbar') as HTMLInputElement;
    searchbar.value = '';
  }
  
  onSearch(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.filteredList = this.listcourses.filter(item =>
      item.title.toLowerCase().startsWith(searchValue)
    );
  }
  
  private setResultsWidth() {
    setTimeout(() => {
      const searchbar: HTMLInputElement = document.getElementById('searchbar') as HTMLInputElement;
      if(searchbar && this.results) {
        this.results.nativeElement.style.width = 'calc(' + searchbar.offsetWidth + 'px - 1em)';
        console.log('width:', this.results.nativeElement.style.width);
      }
    }, 10);
  }

  public goToCourse(courseId: number) {
    this.router.navigate(['/cours', courseId]);
    const searchbar: HTMLInputElement = document.getElementById('searchbar') as HTMLInputElement;
    searchbar.value = '';
    this.isFocused = false;
  }

}
