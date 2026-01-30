import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/common/confirm-dialog/confirm-dialog.component';
import { Empleado, EmpleadosService } from '../../../../core/services/empleados.service';
import { SidebarService } from '../../../../core/services/sidebar.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  standalone: false
})
export class EmployeesListComponent implements OnInit, AfterViewInit {
  empleados: Empleado[] = [];
  dataSource = new MatTableDataSource<Empleado>([]);
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'telefono', 'puesto', 'departamento', 'activo', 'acciones'];
  loading = false;
  searchTerm = '';
  expandedCardId: number | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empleadosService: EmpleadosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService,
    private dialog: MatDialog
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    // Resetear a la primera página cuando se filtra
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  nuevoEmpleado() {
    this.router.navigate(['/empleados/nuevo']);
  }

  editarEmpleado(id: number) {
    this.router.navigate(['/empleados/editar', id]);
  }

  eliminarEmpleado(empleado: Empleado) {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar a ${empleado.nombre} ${empleado.apellido}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',


    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
    });
  }

  onSearchChange() {
    this.applyFilter();
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  // Getter para obtener los datos paginados para las cards
  get paginatedData(): Empleado[] {
    if (!this.paginator) {
      return this.dataSource.filteredData;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  toggleCard(empleadoId: number) {
    if (this.expandedCardId === empleadoId) {
      this.expandedCardId = null;
    } else {
      this.expandedCardId = empleadoId;
    }
  }

  isCardExpanded(empleadoId: number): boolean {
    return this.expandedCardId === empleadoId;
  }
}
