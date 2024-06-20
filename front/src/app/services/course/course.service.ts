import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../models/course';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000';  // Changez l'URL si besoin

  constructor(private http: HttpClient) {}

  loadHome() {
    return this.http.get(`${this.apiUrl}/loadAllStoriesForHome`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Courses fetched successfully:', data)),
      catchError(error => {
        console.error('Error fetching courses:', error);
        throw error;
      })
    );
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/getAllCourses`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Courses fetched successfully:', data)),
      catchError(error => {
        console.error('Error fetching courses:', error);
        throw error;
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/getCourseById/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Course details fetched successfully:', data)),
      catchError(error => {
        console.error('Error fetching course details:', error);
        throw error;
      })
    );
  }

  rateCourse(courseId: number, rating: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/rateCourse`, { courseId, rating }, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Course rated successfully:', data)),
      catchError(error => {
        console.error('Error rating course:', error);
        throw error;
      })
    );
  }

  getAllCoursesAndShuffle(): Observable<Course[]> {
    return this.getAllCourses().pipe(
      map(courses => {
        for (let i = courses.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [courses[i], courses[j]] = [courses[j], courses[i]];
        }
        return courses;
      })
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }
}
