import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = [
    { label: 'Consumo Actual', value: '2.4', unit: 'kW', icon: 'bolt', color: '#0B3C5D', trend: '+5%' },
    { label: 'Factura Mensual', value: '€125', unit: '', icon: 'receipt', color: '#0B3C5D', trend: '-12%' },
    { label: 'Dispositivos', value: '8', unit: 'activos', icon: 'power', color: '#0B3C5D', trend: '+2' },
    { label: 'Eficiencia', value: '87', unit: '%', icon: 'bar_chart', color: '#0B3C5D', trend: '+3%' }
  ];

  recentActivity = [
    { time: 'Hace 5 min', action: 'Luz cocina encendida', icon: 'lightbulb' },
    { time: 'Hace 15 min', action: 'Aire acondicionado apagado', icon: 'ac_unit' },
    { time: 'Hace 1 hora', action: 'Carga completa del vehículo', icon: 'battery_charging_full' },
    { time: 'Hace 2 horas', action: 'Lavadora finalizada', icon: 'local_laundry_service' }
  ];

  constructor(private sidebarService: SidebarService) { }

  ngOnInit() {
    // El dashboard se carga
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
