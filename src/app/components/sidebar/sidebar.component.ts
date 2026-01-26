import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  private subscription?: Subscription;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'people', label: 'Empleados', route: '/empleados' },
    { icon: 'bolt', label: 'Consumo', route: '/consumo' },
    { icon: 'receipt', label: 'Facturas', route: '/facturas' },
    { icon: 'power', label: 'Dispositivos', route: '/dispositivos' },
    { icon: 'bar_chart', label: 'Estadísticas', route: '/estadisticas' },
    { icon: 'settings', label: 'Configuración', route: '/configuracion' },
    { icon: 'help', label: 'Ayuda', route: '/ayuda' }
  ];

  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.subscription = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => {
        if (this.isOpen !== isOpen) {
          this.isOpen = isOpen;
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeSidebar();
  }

  closeSidebar() {
    this.sidebarService.close();
    this.close.emit();
  }

  logout() {
    // Lógica de logout
    this.router.navigate(['/login']);
    this.closeSidebar();
  }
}
