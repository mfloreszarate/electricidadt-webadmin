import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body: any;
  headers: any;
  timestamp: number;
  retries: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineQueueService {
  private dbName = 'electricidadt-offline-queue';
  private storeName = 'requests';
  private db: IDBDatabase | null = null;
  private maxRetries = 3;

  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService
  ) {
    this.initDB();
    this.setupConnectionListener();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  private setupConnectionListener(): void {
    this.connectionService.isOnline$.subscribe(isOnline => {
      if (isOnline) {
        this.processQueue();
      }
    });
  }

  /**
   * Encola una petición para cuando vuelva la conexión
   */
  async queueRequest(request: HttpRequest<any>): Promise<string> {
    await this.ensureDB();
    
    const queuedRequest: QueuedRequest = {
      id: this.generateId(),
      url: request.url || '',
      method: request.method,
      body: request.body,
      headers: this.serializeHeaders(request.headers),
      timestamp: Date.now(),
      retries: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(queuedRequest);

      request.onsuccess = () => resolve(queuedRequest.id);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Procesa todas las peticiones en cola
   */
  private async processQueue(): Promise<void> {
    await this.ensureDB();
    
    const requests = await this.getQueuedRequests();
    
    for (const queuedRequest of requests) {
      try {
        await this.processRequest(queuedRequest);
      } catch (error) {
        console.error('Error procesando petición en cola:', error);
        // Si falla y ha excedido los reintentos, eliminarla
        if (queuedRequest.retries >= this.maxRetries) {
          await this.removeRequest(queuedRequest.id);
        } else {
          await this.incrementRetries(queuedRequest.id);
        }
      }
    }
  }

  private async processRequest(queuedRequest: QueuedRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const httpRequest = new HttpRequest(
        queuedRequest.method as any,
        queuedRequest.url,
        queuedRequest.body,
        { headers: this.deserializeHeaders(queuedRequest.headers) }
      );

      this.http.request(httpRequest).subscribe({
        next: (response) => {
          if (response instanceof HttpResponse) {
            this.removeRequest(queuedRequest.id).then(() => resolve());
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private async getQueuedRequests(): Promise<QueuedRequest[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async removeRequest(id: string): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async incrementRetries(id: string): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const request = getRequest.result;
        if (request) {
          request.retries += 1;
          const updateRequest = store.put(request);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Obtiene el número de peticiones pendientes
   */
  async getPendingCount(): Promise<number> {
    const requests = await this.getQueuedRequests();
    return requests.length;
  }

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private serializeHeaders(headers: any): any {
    const serialized: any = {};
    headers.keys().forEach((key: string) => {
      serialized[key] = headers.get(key);
    });
    return serialized;
  }

  private deserializeHeaders(headers: any): any {
    const httpHeaders: any = {};
    Object.keys(headers).forEach(key => {
      httpHeaders[key] = headers[key];
    });
    return httpHeaders;
  }
}
