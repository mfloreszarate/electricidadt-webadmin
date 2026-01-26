import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ConnectionService } from '../../services/connection.service';
import { OfflineQueueService } from '../../services/offline-queue.service';

@Component({
  selector: 'app-connection-indicator',
  templateUrl: './connection-indicator.component.html',
  styleUrls: ['./connection-indicator.component.scss']
})
export class ConnectionIndicatorComponent implements OnInit, OnDestroy {
  isOnline = true;
  showIndicator = false;
  pendingRequests = 0;
  private subscription?: Subscription;
  private queueSubscription?: Subscription;

  constructor(
    private connectionService: ConnectionService,
    private offlineQueue: OfflineQueueService
  ) { }

  async ngOnInit() {
    this.isOnline = this.connectionService.isOnline;
    await this.updatePendingCount();
    
    this.subscription = this.connectionService.isOnline$.subscribe(async status => {
      const wasOnline = this.isOnline;
      this.isOnline = status;
      
      // Mostrar indicador solo cuando cambia a offline
      if (!status && wasOnline) {
        this.showIndicator = true;
        // Actualizar contador cada 2 segundos cuando está offline
        this.startQueueMonitoring();
      }
      
      // Ocultar después de 3 segundos cuando vuelve online
      if (status && !wasOnline) {
        this.stopQueueMonitoring();
        await this.updatePendingCount();
        setTimeout(() => {
          this.showIndicator = false;
        }, 3000);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.stopQueueMonitoring();
  }

  private async updatePendingCount() {
    this.pendingRequests = await this.offlineQueue.getPendingCount();
  }

  private startQueueMonitoring() {
    this.stopQueueMonitoring();
    this.queueSubscription = interval(2000).subscribe(() => {
      this.updatePendingCount();
    });
  }

  private stopQueueMonitoring() {
    this.queueSubscription?.unsubscribe();
  }

  dismiss() {
    this.showIndicator = false;
  }
}
