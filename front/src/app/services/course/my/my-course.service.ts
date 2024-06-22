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

  constructor(private http: HttpClient) {}

  getCoursesByUserId(userId: number): Observable<MyCourse[]> {
    return this.http.get<MyCourse[]>(`${this.apiUrl}/coursesByUserId/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log(`Courses fetched for user ID: ${userId}`, data)),
      catchError(this.handleError('getCoursesByUserId'))
    );
  }

  getMediaByUrl(mediaUrl: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(mediaUrl, { headers }).pipe(
      tap(data => console.log('Media fetched successfully:', data)),
      catchError(error => {
        console.error('Error fetching media:', error);
        throw error;
      })
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

  createCourse(courseData: any): Observable<MyCourse> {
    return this.http.post<MyCourse>(`${this.apiUrl}/createCourse`, courseData, {
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

  uploadMedia(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    const email = localStorage.getItem('email');  // Récupérez l'email depuis le localStorage
  
    return this.http.post<any>(`${this.apiUrl}/uploadFile/${email}`, formData);  // Passez l'email dans l'URL
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
