import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Empleado, EmpleadosService } from '../../../../core/services/empleados.service';
import { SidebarService } from '../../../../core/services/sidebar.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
  standalone: false
})
export class EmployeeEditComponent implements OnInit {
  empleadoForm: FormGroup;
  empleadoId?: number;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      puesto: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      fechaIngreso: ['', [Validators.required]],
      activo: [true]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.isEditMode = true;
      this.empleadoId = +id;
      this.loadEmpleado();
    }
  }

  loadEmpleado() {
    if (!this.empleadoId) return;

    this.loading = true;
    this.empleadosService.getById(this.empleadoId).subscribe({
      next: (empleado) => {
        if (empleado) {
          this.empleadoForm.patchValue({
            ...empleado,
            fechaIngreso: empleado.fechaIngreso ? empleado.fechaIngreso.split('T')[0] : ''
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar empleado:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar empleado', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/empleados']);
      }
    });
  }

  onSubmit() {
    if (this.empleadoForm.valid) {
      this.loading = true;
      const empleadoData: Empleado = this.empleadoForm.value;

      if (this.isEditMode && this.empleadoId) {
        this.empleadosService.update(this.empleadoId, empleadoData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Empleado actualizado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/empleados']);
          },
          error: (error) => {
            console.error('Error al actualizar empleado:', error);
            this.loading = false;
            this.snackBar.open('Error al actualizar empleado', 'Cerrar', {
              duration: 3000
            });
          }
        });
      } else {
        this.empleadosService.create(empleadoData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Empleado creado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/empleados']);
          },
          error: (error) => {
            console.error('Error al crear empleado:', error);
            this.loading = false;
            this.snackBar.open('Error al crear empleado', 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar() {
    this.router.navigate(['/empleados']);
  }

  private markFormGroupTouched() {
    Object.keys(this.empleadoForm.controls).forEach(key => {
      const control = this.empleadoForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.empleadoForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
