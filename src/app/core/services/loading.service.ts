import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff(delay: number = 0) {
    if (delay > 0) {
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, delay);
    } else {
      this.loadingSubject.next(false);
    }
  }
}
