import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Importer catchError et tap pour la gestion des erreurs et les logs
import { MyCourse } from '../../../models/mycourse';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3000';  // URL de votre API

  constructor(private http: HttpClient) { }

  // Exemple de méthode pour récupérer les cours d'un utilisateur
  getCoursesByUserId(userId: number): Observable<MyCourse[]> {
    console.log(`Fetching courses for user with ID: ${userId}`);
    return this.http.get<MyCourse[]>(`${this.apiUrl}/mes-cours/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Courses fetched successfully:', data)),
      catchError(error => {
        console.error('Error fetching courses:', error);
        throw error; // Rethrow the error after logging
      })
    );
  }

  // Méthode pour créer un nouveau cours
  createCourse(courseData: MyCourse): Observable<MyCourse> {
    console.log('Creating course with data:', courseData);
    return this.http.post<MyCourse>(`${this.apiUrl}/createCourse`, courseData, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => console.log('Course created successfully:', data)),
      catchError(error => {
        console.error('Error creating course:', error);
        throw error; // Rethrow the error after logging
      })
    );
  }

  // Fonction privée pour obtenir les en-têtes avec le jeton d'authentification
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
