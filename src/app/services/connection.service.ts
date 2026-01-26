import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private connectionStatus$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    // Escuchar cambios de conexión
    if (typeof window !== 'undefined') {
      merge(
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false)),
        of(navigator.onLine)
      ).subscribe(status => {
        this.connectionStatus$.next(status);
      });
    }
  }

  /**
   * Observable que emite el estado de conexión
   * true = online, false = offline
   */
  get isOnline$(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  /**
   * Obtiene el estado actual de conexión
   */
  get isOnline(): boolean {
    return this.connectionStatus$.value;
  }
}
