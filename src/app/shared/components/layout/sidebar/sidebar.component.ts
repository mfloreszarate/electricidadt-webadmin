import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  private subscription?: Subscription;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'people', label: 'Empleados', route: '/admin/empleados' },
    { icon: 'build', label: 'Obras', route: '/admin/obras' },
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
