// src/app/services/refresh.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private refreshSubject = new Subject<void>();

  get refreshNeeded$() {
    return this.refreshSubject.asObservable();
  }

  notifyRefresh() {
    this.refreshSubject.next();
  }
}
