import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  showQuickAccess = false;
  private subscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => this.sidebarOpen = isOpen
    );

    // Ocultar barra de accesos rápidos en login
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showQuickAccess = event.url !== '/login';
    });

    // Verificar ruta inicial
    this.showQuickAccess = this.router.url !== '/login';
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  closeSidebar() {
    this.sidebarService.close();
  }
}
