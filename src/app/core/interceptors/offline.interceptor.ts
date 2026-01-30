import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConnectionService } from '../services/connection.service';
import { OfflineQueueService } from '../services/offline-queue.service';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  constructor(
    private connectionService: ConnectionService,
    private offlineQueue: OfflineQueueService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo interceptar métodos que modifican datos (POST, PUT, PATCH, DELETE)
    const isModifyingRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

    if (isModifyingRequest && !this.connectionService.isOnline) {
      // Si está offline, encolar la petición
      return this.handleOfflineRequest(request);
    }

    // Si está online o es GET, proceder normalmente
    return next.handle(request).pipe(
      catchError(error => {
        // Si falla y es una petición modificadora, intentar encolar
        if (isModifyingRequest && error.status === 0) {
          return this.handleOfflineRequest(request);
        }
        return throwError(() => error);
      })
    );
  }

  private handleOfflineRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    // Encolar la petición
    this.offlineQueue.queueRequest(request).then(id => {
      console.log(`Petición encolada (ID: ${id}):`, request.method, request.url);
    }).catch(error => {
      console.error('Error encolando petición:', error);
    });

    // Retornar un observable que simula éxito para que la UI no se rompa
    // En producción, podrías querer mostrar un mensaje al usuario
    return of(new HttpResponse({
      status: 202, // Accepted - indica que fue aceptada pero procesada después
      body: { 
        message: 'Petición encolada para cuando vuelva la conexión',
        queued: true 
      }
    }));
  }
}
