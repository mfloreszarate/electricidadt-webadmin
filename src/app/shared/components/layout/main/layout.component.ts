import { Component, OnDestroy, OnInit } from "@angular/core";
import { SidebarService } from "../../../../core/services/sidebar.service";
import { Subscription } from "rxjs";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false
})
export class AppLayoutComponent implements OnInit, OnDestroy {

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

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  closeSidebar() {
    this.sidebarService.close();
  }
}
