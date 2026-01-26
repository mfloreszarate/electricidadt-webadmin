# Guía de Instalación de Angular Material

## ✅ Configuración Completada

Los siguientes archivos ya han sido configurados:
- ✅ `src/app/material.module.ts` - Módulo compartido de Material
- ✅ `src/app/app.module.ts` - Importa MaterialModule
- ✅ `src/styles.scss` - Tema de Material agregado
- ✅ `package.json` - Dependencias agregadas

## 📦 Paso 1: Instalar paquetes

Ejecuta en tu terminal:

```bash
npm install
```

Esto instalará:
- `@angular/material` - Componentes de Material Design
- `@angular/cdk` - Component Development Kit (requerido por Material)
- `@angular/animations` - Ya estaba instalado, necesario para Material

## Paso 3: Usar componentes

Importa solo los módulos que necesites en `material.module.ts`:

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// etc...
```

## Componentes disponibles

Puedes usar cualquier componente de Angular Material. Los más comunes:
- `MatButtonModule` - Botones
- `MatInputModule` - Inputs
- `MatCardModule` - Tarjetas
- `MatToolbarModule` - Barra de herramientas
- `MatSidenavModule` - Menú lateral
- `MatIconModule` - Iconos
- `MatFormFieldModule` - Campos de formulario
- `MatSnackBarModule` - Notificaciones
- `MatDialogModule` - Diálogos
- `MatTableModule` - Tablas
- `MatProgressSpinnerModule` - Spinners

## Ejemplo de uso

```typescript
// En tu componente
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Título</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput>
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary">Guardar</button>
      </mat-card-actions>
    </mat-card>
  `
})
export class ExampleComponent { }
```
