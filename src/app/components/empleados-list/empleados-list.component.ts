import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { EmpleadosService, Empleado } from '../../services/empleados.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-empleados-list',
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.scss']
})
export class EmpleadosListComponent implements OnInit {
  empleados: Empleado[] = [];
  dataSource = new MatTableDataSource<Empleado>([]);
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'telefono', 'puesto', 'departamento', 'activo', 'acciones'];
  loading = false;
  searchTerm = '';

  constructor(
    private empleadosService: EmpleadosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.loadEmpleados();
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Empleado, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.nombre.toLowerCase().includes(searchStr) ||
        data.apellido.toLowerCase().includes(searchStr) ||
        data.email.toLowerCase().includes(searchStr) ||
        data.puesto.toLowerCase().includes(searchStr) ||
        data.departamento.toLowerCase().includes(searchStr) ||
        data.telefono.toLowerCase().includes(searchStr)
      );
    };
  }

  loadEmpleados() {
    this.loading = true;
    this.empleadosService.getAll().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.dataSource.data = empleados;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar empleados', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  applyFilter() {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  nuevoEmpleado() {
    this.router.navigate(['/empleados/nuevo']);
  }

  editarEmpleado(id: number) {
    this.router.navigate(['/empleados/editar', id]);
  }

  eliminarEmpleado(empleado: Empleado) {
    if (confirm(`¿Estás seguro de eliminar a ${empleado.nombre} ${empleado.apellido}?`)) {
      this.empleadosService.delete(empleado.id!).subscribe({
        next: () => {
          this.snackBar.open('Empleado eliminado correctamente', 'Cerrar', {
            duration: 3000
          });
          this.loadEmpleados();
        },
        error: (error) => {
          console.error('Error al eliminar empleado:', error);
          this.snackBar.open('Error al eliminar empleado', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  onSearchChange() {
    this.applyFilter();
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
