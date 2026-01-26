# 🎨 Guía Completa de Angular Material en ElectricidadT

## ✅ Estado de la Integración

Angular Material ha sido integrado en tu proyecto PWA con las siguientes características:

### Configuración Optimizada para PWA
- ✅ **Tree-shaking habilitado** - Solo se incluyen los módulos que usas
- ✅ **Módulo compartido** - `MaterialModule` centraliza todas las importaciones
- ✅ **Tema personalizado** - Indigo-Pink con overrides para móviles
- ✅ **Touch-friendly** - Botones con tamaño mínimo de 44px para móviles
- ✅ **Accesibilidad** - Componentes con ARIA incluidos

## 📁 Archivos Modificados

1. **`src/app/material.module.ts`** (NUEVO)
   - Módulo compartido con todos los módulos de Material
   - Importa solo lo necesario para mantener bundle pequeño

2. **`src/app/app.module.ts`**
   - Agregado `MaterialModule` a imports

3. **`src/styles.scss`**
   - Tema de Material importado
   - Overrides para móviles y PWA
   - Colores personalizados mantenidos

4. **`package.json`**
   - Dependencias agregadas: `@angular/material`, `@angular/cdk`

## 🚀 Cómo Usar

### Opción 1: Usar Material en componentes nuevos

```typescript
// En tu componente
import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-mi-componente',
  standalone: true, // Si usas standalone components
  imports: [MaterialModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Mi Título</mat-card-title>
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
export class MiComponente { }
```

### Opción 2: Migrar componentes existentes

Puedes migrar gradualmente tus componentes. Ejemplo:

**Antes:**
```html
<button class="login-button">Iniciar sesión</button>
```

**Después:**
```html
<button mat-raised-button color="primary" class="login-button">
  Iniciar sesión
</button>
```

Ver ejemplo completo en: `src/app/components/login/login-material.example.html`

## 🎯 Componentes Disponibles

Todos estos componentes están disponibles en `MaterialModule`:

### Formularios
- `MatFormFieldModule` - Campos de formulario con labels y errores
- `MatInputModule` - Inputs mejorados
- `MatSelectModule` - Selects/dropdowns
- `MatCheckboxModule` - Checkboxes
- `MatDatepickerModule` - Selector de fechas

### Botones y Acciones
- `MatButtonModule` - Botones (raised, flat, outlined, icon)
- `MatIconModule` - Iconos de Material Icons
- `MatBadgeModule` - Badges/notificaciones

### Navegación
- `MatToolbarModule` - Barra superior
- `MatSidenavModule` - Menú lateral
- `MatMenuModule` - Menús desplegables
- `MatTabsModule` - Pestañas

### Contenido
- `MatCardModule` - Tarjetas
- `MatListModule` - Listas
- `MatTableModule` - Tablas
- `MatChipsModule` - Chips/tags

### Feedback
- `MatSnackBarModule` - Notificaciones toast
- `MatDialogModule` - Diálogos modales
- `MatProgressSpinnerModule` - Spinners de carga
- `MatTooltipModule` - Tooltips

## 📱 Ejemplos de Uso

### Ejemplo 1: Formulario con validación

```html
<form [formGroup]="myForm">
  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email" required>
    <mat-icon matPrefix>email</mat-icon>
    <mat-error *ngIf="email?.invalid && email?.touched">
      Email inválido
    </mat-error>
  </mat-form-field>

  <button mat-raised-button color="primary" type="submit">
    Enviar
  </button>
</form>
```

### Ejemplo 2: Tarjeta con acciones

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Título</mat-card-title>
    <mat-card-subtitle>Subtítulo</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    Contenido de la tarjeta
  </mat-card-content>
  <mat-card-actions align="end">
    <button mat-button>Cancelar</button>
    <button mat-raised-button color="primary">Guardar</button>
  </mat-card-actions>
</mat-card>
```

### Ejemplo 3: Notificación (Snackbar)

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';

constructor(private snackBar: MatSnackBar) {}

mostrarNotificacion() {
  this.snackBar.open('Operación exitosa', 'Cerrar', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  });
}
```

### Ejemplo 4: Diálogo Modal

```typescript
import { MatDialog } from '@angular/material/dialog';

constructor(private dialog: MatDialog) {}

abrirDialog() {
  const dialogRef = this.dialog.open(MiDialogComponent, {
    width: '400px',
    data: { nombre: 'Juan' }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Resultado:', result);
  });
}
```

## 🎨 Personalización de Tema

### Cambiar colores principales

En `src/styles.scss`:

```scss
.mat-primary {
  --mdc-theme-primary: #667eea; // Tu color primario
}

.mat-accent {
  --mdc-theme-secondary: #764ba2; // Tu color secundario
}
```

### Cambiar tema completo

En `src/styles.scss`, reemplaza:

```scss
// Tema actual
@import '@angular/material/prebuilt-themes/indigo-pink.css';

// Otros temas disponibles:
// @import '@angular/material/prebuilt-themes/deeppurple-amber.css';
// @import '@angular/material/prebuilt-themes/pink-bluegrey.css';
// @import '@angular/material/prebuilt-themes/purple-green.css';
```

## 📦 Optimización para PWA

### Tree-shaking automático

Angular Material usa tree-shaking automáticamente. Solo se incluyen en el bundle los módulos que realmente importas.

### Verificar tamaño del bundle

```bash
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/electricidadt/stats.json
```

### Reducir tamaño

Si necesitas reducir más el bundle:

1. **Elimina módulos no usados** de `material.module.ts`
2. **Usa importaciones directas** en componentes standalone:

```typescript
import { MatButtonModule } from '@angular/material/button';
// En lugar de importar todo MaterialModule
```

## 🔧 Troubleshooting

### Error: "Can't bind to 'matInput'"

**Solución:** Asegúrate de importar `MaterialModule` en tu módulo o componente.

### Error: "No provider for MatDialogRef"

**Solución:** Agrega `MatDialogModule` a tus imports.

### Los estilos no se aplican

**Solución:** Verifica que `@angular/material/prebuilt-themes/indigo-pink.css` esté en `styles.scss`.

### Iconos no aparecen

**Solución:** Agrega a `index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

O instala localmente:

```bash
npm install material-icons
```

## 📚 Recursos

- [Documentación oficial](https://material.angular.io/)
- [Componentes disponibles](https://material.angular.io/components/categories)
- [Guía de temas](https://material.angular.io/guide/theming)
- [Iconos Material](https://fonts.google.com/icons)

## 🎯 Próximos Pasos Recomendados

1. **Migrar formularios** - Usar `mat-form-field` para mejor UX
2. **Agregar Snackbars** - Para notificaciones de éxito/error
3. **Usar MatSidenav** - Para mejorar el sidebar existente
4. **Implementar MatTable** - Para tablas de datos
5. **Agregar MatDialog** - Para confirmaciones y modales

## 💡 Tips

- **Mantén MaterialModule ligero** - Solo importa lo que uses
- **Combina Material con tus estilos** - No necesitas usar solo Material
- **Usa directivas de Material** - `matInput`, `matButton`, etc. funcionan con tus clases CSS
- **Accesibilidad incluida** - Los componentes de Material ya tienen ARIA
