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
  private createdCourseId: string | undefined; // Variable pour stocker l'ID du cours créé

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

  createCourse(courseData: any): Observable<{ course: MyCourse }> {
    return this.http.post<{ course: MyCourse }>(`${this.apiUrl}/createCourse`, courseData, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => {
        console.log('Course created successfully:', data);
        this.createdCourseId = data.course.id; // Store the created course ID
      }),
      catchError(this.handleError('createCourse'))
    );
  }

  uploadFile(courseId: string, formData: FormData): Observable<any> {
    const email = localStorage.getItem('email');
    return this.http.post<any>(`${this.apiUrl}/uploadFile/${email}/${courseId}`, formData, {
      headers: this.getHeaders(true) // Use multipart for file upload
    }).pipe(
      catchError(this.handleError('uploadFile'))
    );
  }

  updateCourseMedias(courseId: string, mediaUrls: string[], imageUrl: string): Observable<any> {
    const body = {
      mediaUrls: mediaUrls,
      imageUrl: imageUrl
    };
    return this.http.put<any>(`${this.apiUrl}/updateCourse/${courseId}`, body, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Course media updated:', data)),
      catchError(this.handleError('updateCourseMedias'))
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
      console.error(`${operation} failed:`, error);
      return throwError(error);
    };
  }
}
