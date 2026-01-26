# Sistema Offline Completo - ElectricidadT PWA

## 🎯 Funcionalidades Implementadas

### ✅ 1. Cacheo de Peticiones GET
- Las peticiones GET se cachean automáticamente usando el Service Worker
- Funcionan offline si hay datos en caché

### ✅ 2. Cola Offline para POST/PUT/PATCH/DELETE
- Las peticiones modificadoras se encolan cuando no hay conexión
- Se almacenan en IndexedDB
- Se procesan automáticamente cuando vuelve la conexión

### ✅ 3. Indicador de Conexión
- Muestra el estado de conexión en tiempo real
- Indica cuántas peticiones están pendientes
- Se actualiza automáticamente

## 📁 Archivos Creados

### Servicios
- `src/app/services/offline-queue.service.ts` - Maneja la cola de peticiones offline
- `src/app/services/connection.service.ts` - Detecta cambios de conexión

### Interceptores
- `src/app/interceptors/offline.interceptor.ts` - Intercepta peticiones HTTP cuando está offline

### Componentes
- `src/app/components/connection-indicator/` - Indicador visual de conexión

## 🔧 Cómo Funciona

### Flujo de Peticiones GET

```
Usuario hace petición GET
    ↓
¿Hay conexión?
    ├─ SÍ → Obtiene datos frescos de la red
    │        ↓
    │    Cachea respuesta (Service Worker)
    │
    └─ NO → Busca en caché (Service Worker)
            ├─ Encontrado → Devuelve datos cacheados
            └─ No encontrado → Error (manejar en UI)
```

### Flujo de Peticiones POST/PUT/PATCH/DELETE

```
Usuario hace petición POST
    ↓
¿Hay conexión?
    ├─ SÍ → Envía petición normalmente
    │
    └─ NO → Interceptor detecta offline
            ↓
        Encola en IndexedDB
            ↓
        Retorna respuesta simulada (202 Accepted)
            ↓
        Usuario ve mensaje de éxito
            ↓
    Cuando vuelve la conexión:
        ↓
    Procesa cola automáticamente
        ↓
    Envía todas las peticiones pendientes
```

## 📊 Estructura de Datos

### IndexedDB - `electricidadt-offline-queue`

**Store: `requests`**
```typescript
{
  id: string,              // ID único generado
  url: string,             // URL de la petición
  method: string,          // POST, PUT, PATCH, DELETE
  body: any,               // Cuerpo de la petición
  headers: any,            // Headers serializados
  timestamp: number,        // Cuándo se encoló
  retries: number          // Intentos de procesamiento
}
```

## 🎨 Indicador de Conexión

### Estados Visuales

**Online:**
- Banner verde con mensaje "Conexión restaurada"
- Se oculta automáticamente después de 3 segundos

**Offline:**
- Banner rojo con mensaje "Sin conexión - Modo offline"
- Muestra badge con número de peticiones pendientes
- Botón para cerrar manualmente
- Se actualiza cada 2 segundos con el contador

## 💻 Uso en el Código

### Ejemplo: Hacer una petición POST

```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

crearFactura(factura: any) {
  // Si está offline, se encola automáticamente
  this.http.post('/api/facturas', factura).subscribe({
    next: (response: any) => {
      if (response.queued) {
        console.log('Petición encolada para cuando vuelva la conexión');
        // Mostrar mensaje al usuario
      } else {
        console.log('Factura creada exitosamente');
      }
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

### Ejemplo: Verificar estado de conexión

```typescript
import { ConnectionService } from './services/connection.service';

constructor(private connectionService: ConnectionService) {}

ngOnInit() {
  this.connectionService.isOnline$.subscribe(isOnline => {
    if (isOnline) {
      console.log('Conectado');
    } else {
      console.log('Desconectado');
    }
  });
}
```

### Ejemplo: Ver peticiones pendientes

```typescript
import { OfflineQueueService } from './services/offline-queue.service';

constructor(private offlineQueue: OfflineQueueService) {}

async verPendientes() {
  const count = await this.offlineQueue.getPendingCount();
  console.log(`Hay ${count} peticiones pendientes`);
}
```

## ⚙️ Configuración

### Service Worker (`ngsw-config.json`)

**Cacheo de GET:**
```json
{
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": ["/api/**"],
      "strategy": "freshness",
      "maxAge": "1h",
      "timeout": "5s"
    }
  ]
}
```

**Rutas cacheadas:**
- `/api/**` - Estrategia freshness (prioridad a red)
- `/api/consumo/**` - Estrategia performance (prioridad a caché)
- `/api/facturas/**` - Estrategia performance
- `/api/dispositivos/**` - Estrategia performance

## 🧪 Cómo Probar

### 1. Build de Producción
```bash
ng build --configuration production
npx http-server dist/electricidadt -p 4200
```

### 2. Probar Cacheo GET
1. Abre la app con conexión
2. Navega a una página que haga peticiones GET
3. DevTools → Network → Throttling → Offline
4. Recarga la página
5. Los datos deberían aparecer desde caché

### 3. Probar Cola POST
1. Abre la app con conexión
2. DevTools → Network → Throttling → Offline
3. Intenta crear/editar algo (POST/PUT)
4. Verás el indicador de conexión con contador
5. DevTools → Application → IndexedDB → `electricidadt-offline-queue`
6. Verás las peticiones encoladas
7. DevTools → Network → Throttling → Online
8. Las peticiones se procesan automáticamente

### 4. Verificar en DevTools

**Cache Storage:**
- DevTools → Application → Cache Storage
- Verás caches del Service Worker con respuestas GET

**IndexedDB:**
- DevTools → Application → IndexedDB → `electricidadt-offline-queue`
- Verás las peticiones POST/PUT/PATCH/DELETE encoladas

## 🔄 Reintentos Automáticos

- Máximo 3 reintentos por petición
- Si falla después de 3 intentos, se elimina de la cola
- Se incrementa el contador de reintentos automáticamente

## 📝 Notas Importantes

1. **Solo funciona en producción:** El Service Worker solo se activa en builds de producción
2. **HTTPS requerido:** Las PWAs requieren HTTPS (excepto localhost)
3. **IndexedDB:** Se crea automáticamente, no requiere configuración adicional
4. **Límites:** 
   - Máximo 100 respuestas GET cacheadas (api-cache)
   - Máximo 50 respuestas GET cacheadas (api-offline)
   - Sin límite en peticiones POST encoladas (solo limitado por espacio de IndexedDB)

## 🚀 Próximas Mejoras Posibles

1. **Notificaciones:** Avisar cuando se procesen peticiones pendientes
2. **Sincronización parcial:** Permitir editar peticiones antes de enviarlas
3. **Conflictos:** Manejar conflictos cuando los datos cambiaron en el servidor
4. **Prioridades:** Permitir marcar peticiones como prioritarias
5. **UI mejorada:** Mostrar lista de peticiones pendientes en un modal
