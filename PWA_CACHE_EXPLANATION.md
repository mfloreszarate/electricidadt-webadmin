# Explicación: Cacheo de Peticiones HTTP en PWA

## ¿Qué se cachea?

### 1. **Archivos Estáticos** (assetGroups)
- ✅ CSS (`/*.css`)
- ✅ JavaScript (`/*.js`)
- ✅ HTML (`/index.html`)
- ✅ Imágenes y assets (`/assets/**`)
- ✅ Fuentes y otros recursos

### 2. **Peticiones HTTP** (dataGroups) - NUEVO ✨

#### Estrategia: `freshness` (Prioridad a red)
```json
{
  "name": "api-cache",
  "urls": ["/api/**"],
  "strategy": "freshness",
  "maxAge": "1h",
  "timeout": "5s"
}
```
**Cómo funciona:**
- Intenta obtener datos frescos de la red primero
- Si la red falla o tarda más de 5s, usa caché
- Cachea respuestas por 1 hora
- Máximo 100 respuestas cacheadas

#### Estrategia: `performance` (Prioridad a caché)
```json
{
  "name": "api-offline",
  "urls": ["/api/consumo/**", "/api/facturas/**"],
  "strategy": "performance",
  "maxAge": "1d"
}
```
**Cómo funciona:**
- Usa caché primero (más rápido)
- Actualiza en segundo plano si hay conexión
- Cachea por 1 día
- Perfecto para datos que no cambian frecuentemente

## Peticiones GET vs POST

### ✅ GET - Se pueden cachear
```typescript
// Ejemplo: Obtener lista de facturas
this.http.get('/api/facturas').subscribe(data => {
  // Si hay conexión: datos frescos
  // Si no hay conexión: datos del caché (si existen)
});
```

### ❌ POST - NO se pueden cachear directamente
```typescript
// Las peticiones POST no se cachean automáticamente
// Necesitas implementar una cola offline manualmente
```

## Solución para POST offline

Para manejar POST cuando no hay conexión, necesitas:

1. **Cola de peticiones offline**
```typescript
// Guardar peticiones pendientes en IndexedDB
// Cuando vuelva la conexión, enviarlas automáticamente
```

2. **Usar IndexedDB** para almacenar datos localmente
```typescript
// Guardar datos localmente mientras no hay conexión
// Sincronizar cuando vuelva la conexión
```

## Configuración Actual

### Rutas cacheadas:
- `/api/**` - Cacheo con estrategia freshness (1 hora)
- `/api/consumo/**` - Cacheo con estrategia performance (1 día)
- `/api/facturas/**` - Cacheo con estrategia performance (1 día)
- `/api/dispositivos/**` - Cacheo con estrategia performance (1 día)

### Indicador de Conexión
- Muestra cuando estás offline
- Se oculta automáticamente cuando vuelve la conexión
- Puedes cerrarlo manualmente

## Cómo Probar

1. **Build de producción:**
```bash
ng build --configuration production
```

2. **Servir con HTTP:**
```bash
npx http-server dist/electricidadt -p 4200
```

3. **Probar offline:**
   - Abre DevTools → Network → Throttling → Offline
   - Las peticiones GET a `/api/**` usarán caché si existen
   - Verás el indicador de conexión en la parte superior

4. **Ver caché:**
   - DevTools → Application → Cache Storage
   - Verás los datos cacheados de las peticiones GET

## Próximos Pasos Recomendados

1. **Implementar cola offline para POST**
2. **Usar IndexedDB para datos locales**
3. **Sincronización automática cuando vuelva la conexión**
4. **Mostrar datos cacheados con badge "Offline"**
