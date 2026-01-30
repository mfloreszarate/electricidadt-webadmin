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
    },
    {
      id: 4,
      nombre: 'Ana',
      apellido: 'Martínez',
      email: 'ana.martinez@electricidadt.com',
      telefono: '+34 600 456 789',
      puesto: 'Administradora',
      departamento: 'Administración',
      fechaIngreso: '2021-02-14',
      activo: true
    },
    {
      id: 5,
      nombre: 'Pedro',
      apellido: 'Sánchez',
      email: 'pedro.sanchez@electricidadt.com',
      telefono: '+34 600 567 890',
      puesto: 'Técnico Instalador',
      departamento: 'Instalaciones',
      fechaIngreso: '2020-09-05',
      activo: true
    },
    {
      id: 6,
      nombre: 'Laura',
      apellido: 'Fernández',
      email: 'laura.fernandez@electricidadt.com',
      telefono: '+34 600 678 901',
      puesto: 'Diseñadora de Sistemas',
      departamento: 'Diseño',
      fechaIngreso: '2019-11-18',
      activo: true
    },
    {
      id: 7,
      nombre: 'Roberto',
      apellido: 'González',
      email: 'roberto.gonzalez@electricidadt.com',
      telefono: '+34 600 789 012',
      puesto: 'Mantenimiento',
      departamento: 'Operaciones',
      fechaIngreso: '2022-01-10',
      activo: true
    },
    {
      id: 8,
      nombre: 'Carmen',
      apellido: 'Rodríguez',
      email: 'carmen.rodriguez@electricidadt.com',
      telefono: '+34 600 890 123',
      puesto: 'Gerente de Proyectos',
      departamento: 'Operaciones',
      fechaIngreso: '2017-04-22',
      activo: true
    },
    {
      id: 9,
      nombre: 'David',
      apellido: 'Torres',
      email: 'david.torres@electricidadt.com',
      telefono: '+34 600 901 234',
      puesto: 'Electricista Senior',
      departamento: 'Instalaciones',
      fechaIngreso: '2016-08-30',
      activo: true
    },
    {
      id: 10,
      nombre: 'Isabel',
      apellido: 'Ruiz',
      email: 'isabel.ruiz@electricidadt.com',
      telefono: '+34 600 012 345',
      puesto: 'Contadora',
      departamento: 'Administración',
      fechaIngreso: '2020-05-12',
      activo: true
    },
    {
      id: 11,
      nombre: 'Francisco',
      apellido: 'Jiménez',
      email: 'francisco.jimenez@electricidadt.com',
      telefono: '+34 600 123 456',
      puesto: 'Técnico de Campo',
      departamento: 'Instalaciones',
      fechaIngreso: '2021-07-25',
      activo: true
    },
    {
      id: 12,
      nombre: 'Patricia',
      apellido: 'Moreno',
      email: 'patricia.moreno@electricidadt.com',
      telefono: '+34 600 234 567',
      puesto: 'Ingeniera de Proyectos',
      departamento: 'Diseño',
      fechaIngreso: '2018-12-03',
      activo: false
    },
    {
      id: 13,
      nombre: 'Miguel',
      apellido: 'Álvarez',
      email: 'miguel.alvarez@electricidadt.com',
      telefono: '+34 600 345 678',
      puesto: 'Coordinador de Instalaciones',
      departamento: 'Operaciones',
      fechaIngreso: '2019-03-15',
      activo: true
    },
    {
      id: 14,
      nombre: 'Elena',
      apellido: 'Morales',
      email: 'elena.morales@electricidadt.com',
      telefono: '+34 600 456 789',
      puesto: 'Asistente Administrativa',
      departamento: 'Administración',
      fechaIngreso: '2022-06-20',
      activo: true
    },
    {
      id: 15,
      nombre: 'Javier',
      apellido: 'Ortega',
      email: 'javier.ortega@electricidadt.com',
      telefono: '+34 600 567 890',
      puesto: 'Técnico Especialista',
      departamento: 'Instalaciones',
      fechaIngreso: '2017-09-08',
      activo: true
    },
    {
      id: 16,
      nombre: 'Sofía',
      apellido: 'Delgado',
      email: 'sofia.delgado@electricidadt.com',
      telefono: '+34 600 678 901',
      puesto: 'Diseñadora CAD',
      departamento: 'Diseño',
      fechaIngreso: '2021-04-11',
      activo: true
    },
    {
      id: 17,
      nombre: 'Antonio',
      apellido: 'Castro',
      email: 'antonio.castro@electricidadt.com',
      telefono: '+34 600 789 012',
      puesto: 'Supervisor de Mantenimiento',
      departamento: 'Operaciones',
      fechaIngreso: '2015-11-27',
      activo: true
    },
    {
      id: 18,
      nombre: 'Lucía',
      apellido: 'Ortiz',
      email: 'lucia.ortiz@electricidadt.com',
      telefono: '+34 600 890 123',
      puesto: 'Recursos Humanos',
      departamento: 'Administración',
      fechaIngreso: '2020-08-19',
      activo: true
    },
    {
      id: 19,
      nombre: 'Manuel',
      apellido: 'Navarro',
      email: 'manuel.navarro@electricidadt.com',
      telefono: '+34 600 901 234',
      puesto: 'Electricista',
      departamento: 'Instalaciones',
      fechaIngreso: '2022-02-28',
      activo: true
    },
    {
      id: 20,
      nombre: 'Raquel',
      apellido: 'Ramos',
      email: 'raquel.ramos@electricidadt.com',
      telefono: '+34 600 012 345',
      puesto: 'Ingeniera de Sistemas',
      departamento: 'Diseño',
      fechaIngreso: '2019-10-07',
      activo: false
    },
    {
      id: 21,
      nombre: 'Alberto',
      apellido: 'Vázquez',
      email: 'alberto.vazquez@electricidadt.com',
      telefono: '+34 600 123 456',
      puesto: 'Técnico de Instalaciones',
      departamento: 'Instalaciones',
      fechaIngreso: '2021-01-16',
      activo: true
    },
    {
      id: 22,
      nombre: 'Marta',
      apellido: 'Serrano',
      email: 'marta.serrano@electricidadt.com',
      telefono: '+34 600 234 567',
      puesto: 'Jefa de Administración',
      departamento: 'Administración',
      fechaIngreso: '2016-05-09',
      activo: true
    },
    {
      id: 23,
      nombre: 'Fernando',
      apellido: 'Molina',
      email: 'fernando.molina@electricidadt.com',
      telefono: '+34 600 345 678',
      puesto: 'Coordinador Técnico',
      departamento: 'Operaciones',
      fechaIngreso: '2018-07-23',
      activo: true
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
