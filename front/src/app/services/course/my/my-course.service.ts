import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
      catchError(this.handleError('getCoursesByUserId'))
    );
  }

  getAllCoursesFromUser(): Observable<MyCourse[]> {
    return this.http.get<MyCourse[]>(`${this.apiUrl}/allCoursesFromUser`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log(`Courses fetched for user`, data)),
      catchError(this.handleError('getAllCoursesFromUser'))
    );
  }

  createCourse(courseData: FormData): Observable<MyCourse> {
    // Construire le corps de la requête avec les données extraites de FormData
    const body = {
      date: courseData.get('date'),
      description: courseData.get('description'),
      image: courseData.get('image'),
      name: courseData.get('name'),
      theme: courseData.get('theme')
    };

    // Envoi de la requête HTTP avec le corps JSON
    return this.http.post<MyCourse>(`${this.apiUrl}/createCourse`, body, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Course created successfully:', data))
    );
  }

  deleteCourse(courseId: string): Observable<void> {
    console.log('Deleting course:', courseId);
    return this.http.delete<void>(`${this.apiUrl}/deleteCourse/${courseId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('Course deleted successfully:', courseId)),
      catchError(this.handleError('deleteCourse'))
    );
  }

  private getHeaders(isMultipart: boolean = false): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    if (!isMultipart) {
      headers = headers.append('Content-Type', 'application/json');
    }
    return headers;
  }

  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(error);
    };
  }
}
