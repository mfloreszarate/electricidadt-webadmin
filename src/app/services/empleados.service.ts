import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  puesto: string;
  departamento: string;
  fechaIngreso: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private empleadosSubject = new BehaviorSubject<Empleado[]>([]);
  public empleados$ = this.empleadosSubject.asObservable();

  // Datos de ejemplo almacenados en memoria (simulando backend)
  private empleados: Empleado[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@electricidadt.com',
      telefono: '+34 600 123 456',
      puesto: 'Técnico Electricista',
      departamento: 'Instalaciones',
      fechaIngreso: '2020-01-15',
      activo: true
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'García',
      email: 'maria.garcia@electricidadt.com',
      telefono: '+34 600 234 567',
      puesto: 'Ingeniera Eléctrica',
      departamento: 'Diseño',
      fechaIngreso: '2019-03-20',
      activo: true
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'López',
      email: 'carlos.lopez@electricidadt.com',
      telefono: '+34 600 345 678',
      puesto: 'Supervisor',
      departamento: 'Operaciones',
      fechaIngreso: '2018-06-10',
      activo: false
    }
  ];

  constructor(private http: HttpClient) {
    // Inicializar con datos de ejemplo
    this.empleadosSubject.next([...this.empleados]);
  }

  getAll(): Observable<Empleado[]> {
    // Simular llamada HTTP con delay
    return of([...this.empleados]).pipe(delay(300));
  }

  getById(id: number): Observable<Empleado | undefined> {
    const empleado = this.empleados.find(e => e.id === id);
    return of(empleado).pipe(delay(200));
  }

  create(empleado: Empleado): Observable<Empleado> {
    const nuevoId = Math.max(...this.empleados.map(e => e.id || 0), 0) + 1;
    const nuevoEmpleado: Empleado = {
      ...empleado,
      id: nuevoId
    };
    this.empleados.push(nuevoEmpleado);
    this.empleadosSubject.next([...this.empleados]);
    return of(nuevoEmpleado).pipe(delay(400));
  }

  update(id: number, empleado: Empleado): Observable<Empleado> {
    const index = this.empleados.findIndex(e => e.id === id);
    if (index !== -1) {
      this.empleados[index] = { ...empleado, id };
      this.empleadosSubject.next([...this.empleados]);
      return of(this.empleados[index]).pipe(delay(400));
    }
    throw new Error('Empleado no encontrado');
  }

  delete(id: number): Observable<boolean> {
    const index = this.empleados.findIndex(e => e.id === id);
    if (index !== -1) {
      this.empleados.splice(index, 1);
      this.empleadosSubject.next([...this.empleados]);
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(400));
  }

  // Métodos para uso con HTTP real (comentados para referencia)
  /*
  private apiUrl = '/api/empleados';

  getAll(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  getById(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  create(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }

  update(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${id}`, empleado);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  */
}
