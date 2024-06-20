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
    return this.http.get<MyCourse[]>(`${this.apiUrl}/coursesByUserId/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log(`Courses fetched for user ID: ${userId}`, data)),
      catchError(error => {
        console.error('Error fetching courses for user:', error);
        throw error;
      })
    );
  }

  getAllCoursesFromUser(): Observable<MyCourse[]> {
    return this.http.get<MyCourse[]>(`${this.apiUrl}/allCoursesFromUser`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log(`Courses fetched for user`, data)),
      catchError(error => {
        console.error('Error fetching courses for user:', error);
        throw error;
      })
    );
  }

  createCourse(courseData: MyCourse): Observable<MyCourse> {
    return this.http.post<MyCourse>(`${this.apiUrl}/createCourse`, courseData, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Course created successfully:', data)),
      catchError(error => {
        console.error('Error creating course:', error);
        throw error;
      })
    );
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCourse/${courseId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('Course deleted successfully:', courseId)),
      catchError(error => {
        console.error('Error deleting course:', error);
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
}
