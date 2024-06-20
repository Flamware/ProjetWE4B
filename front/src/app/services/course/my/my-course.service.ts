import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MyCourse } from '../../../models/mycourse';

@Injectable({
  providedIn: 'root'
})
export class MyCourseService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCoursesByUserId(userId: number): Observable<MyCourse[]> {
    console.log(`Fetching courses for user with ID: ${userId}`);
    return this.http.get<MyCourse[]>(`${this.apiUrl}/mes-cours/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Courses fetched successfully:', data)),
      catchError(error => {
        console.error('Error fetching courses:', error);
        throw error;
      })
    );
  }

  createCourse(courseData: MyCourse): Observable<MyCourse> {
    console.log('Creating course with data:', courseData);
    return this.http.post<MyCourse>(`${this.apiUrl}/create-course`, courseData, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Course created successfully:', data)),
      catchError(error => {
        console.error('Error creating course:', error);
        throw error;
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

  getAllCourse(username ?: string): Observable<MyCourse[]> {
    return this.http.get<MyCourse[]>(`${this.apiUrl}/getAllCourses`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Courses fetched successfully:', data)),
      catchError(error => {
        console.error('Error fetching courses:', error);
        throw error;
      })
    );
  }
  deleteCourse(courseId: string): Observable<void> {
    console.log('Deleting course with ID:', courseId);
    return this.http.delete<void>(`${this.apiUrl}/delete-course/${courseId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('Course deleted successfully')),
      catchError(error => {
        console.error('Error deleting course:', error);
        throw error;
      })
    );
  }
}
