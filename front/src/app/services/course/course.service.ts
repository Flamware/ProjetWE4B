import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000';  // Changez l'URL si besoin

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/getAllCourses`, {
      headers: this.getHeaders()
    });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/getCourseById/${id}`, {
      headers: this.getHeaders()
    });
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/createCourse`, course, {
      headers: this.getHeaders()
    });
  }

  rateCourse(courseId: number, rating: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/rateCourse`, { courseId, rating }, {
      headers: this.getHeaders()
    });
  }



  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Assurez-vous d'avoir stocké le token d'authentification
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
