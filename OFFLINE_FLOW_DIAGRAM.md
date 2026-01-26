# 📊 Diagrama de Flujo - Sistema Offline PWA

## 🔄 Flujo General del Sistema

```mermaid
graph TB
    Start([Usuario hace petición HTTP]) --> CheckMethod{Tipo de petición?}
    
    CheckMethod -->|GET| GetFlow[Flujo GET]
    CheckMethod -->|POST/PUT/PATCH/DELETE| PostFlow[Flujo POST]
    
    GetFlow --> GetCache[Service Worker busca en caché]
    PostFlow --> PostInterceptor[Interceptor HTTP]
    
    style Start fill:#e1f5ff
    style GetFlow fill:#c8e6c9
    style PostFlow fill:#fff9c4
```

## 📥 Flujo de Peticiones GET

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as Angular App
    participant SW as Service Worker
    participant N as Red/API
    participant C as Cache Storage

    U->>A: Solicita datos (GET)
    A->>SW: Petición HTTP GET
    
    alt Hay conexión
        SW->>N: Intenta obtener datos frescos
        N-->>SW: Datos frescos
        SW->>C: Guarda en caché
        SW-->>A: Devuelve datos frescos
        A-->>U: Muestra datos
    else No hay conexión
        SW->>C: Busca en caché
        alt Datos en caché
            C-->>SW: Datos cacheados
            SW-->>A: Devuelve datos del caché
            A-->>U: Muestra datos (con badge Offline)
        else Sin datos en caché
            C-->>SW: No encontrado
            SW-->>A: Error 404
            A-->>U: Muestra mensaje de error
        end
    end
```

## 📤 Flujo de Peticiones POST/PUT/PATCH/DELETE

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as Angular App
    participant I as Offline Interceptor
    participant CS as Connection Service
    participant OQ as Offline Queue Service
    participant IDB as IndexedDB
    participant N as Red/API

    U->>A: Envía datos (POST/PUT/PATCH/DELETE)
    A->>I: Petición HTTP
    
    I->>CS: ¿Está online?
    
    alt Está ONLINE
        CS-->>I: Sí, online
        I->>N: Envía petición normalmente
        N-->>I: Respuesta exitosa
        I-->>A: Respuesta del servidor
        A-->>U: Muestra éxito
    else Está OFFLINE
        CS-->>I: No, offline
        I->>OQ: Encola petición
        OQ->>IDB: Guarda en IndexedDB
        IDB-->>OQ: Confirmación
        OQ-->>I: ID de petición encolada
        I-->>A: Respuesta simulada (202 Accepted)
        A-->>U: Muestra "Petición encolada"
        
        Note over OQ,IDB: Petición queda pendiente
        
        CS->>CS: Detecta cambio a ONLINE
        CS->>OQ: Notifica conexión restaurada
        OQ->>IDB: Obtiene peticiones pendientes
        IDB-->>OQ: Lista de peticiones
        
        loop Para cada petición pendiente
            OQ->>N: Envía petición
            alt Éxito
                N-->>OQ: Respuesta exitosa
                OQ->>IDB: Elimina de cola
            else Error
                N-->>OQ: Error
                OQ->>IDB: Incrementa reintentos
                alt Reintentos < 3
                    Note over OQ: Reintentará después
                else Reintentos >= 3
                    OQ->>IDB: Elimina de cola (fallida)
                end
            end
        end
    end
```

## 🔌 Indicador de Conexión

```mermaid
stateDiagram-v2
    [*] --> Online: App inicia
    
    Online --> Offline: Pérdida de conexión
    Offline --> Online: Conexión restaurada
    
    state Offline {
        [*] --> MostrarBanner
        MostrarBanner --> ActualizarContador: Cada 2 segundos
        ActualizarContador --> MostrarBanner
        MostrarBanner --> OcultarBanner: Usuario cierra
    }
    
    state Online {
        [*] --> MostrarBanner: Conexión restaurada
        MostrarBanner --> OcultarBanner: Después de 3 segundos
    }
```

## 🗄️ Estructura de Datos

### IndexedDB - Cola Offline

```mermaid
erDiagram
    OFFLINE_QUEUE ||--o{ QUEUED_REQUEST : contiene
    
    OFFLINE_QUEUE {
        string dbName "electricidadt-offline-queue"
        string storeName "requests"
    }
    
    QUEUED_REQUEST {
        string id PK
        string url
        string method
        object body
        object headers
        number timestamp
        number retries
    }
```

### Cache Storage - Service Worker

```mermaid
erDiagram
    CACHE_STORAGE ||--o{ CACHE_GROUP : contiene
    
    CACHE_STORAGE {
        string name "ngsw:/..."
    }
    
    CACHE_GROUP {
        string name "app | assets | api-cache | api-offline"
        array resources
        string strategy
        number maxAge
    }
```

## 🔀 Flujo Completo: Escenario Real

```mermaid
graph TB
    subgraph "Escenario: Usuario trabaja offline"
        A[Usuario abre app] --> B{¿Hay conexión?}
        
        B -->|Sí| C[Carga datos desde API]
        B -->|No| D[Carga datos desde caché]
        
        C --> E[Usuario ve datos frescos]
        D --> F[Usuario ve datos cacheados]
        
        E --> G[Usuario intenta crear factura POST]
        F --> G
        
        G --> H{¿Hay conexión?}
        
        H -->|Sí| I[Envía POST al servidor]
        H -->|No| J[Interceptor detecta offline]
        
        I --> K[Factura creada exitosamente]
        
        J --> L[Encola en IndexedDB]
        L --> M[Muestra mensaje: Petición encolada]
        M --> N[Indicador muestra: 1 pendiente]
        
        N --> O[Usuario sigue trabajando offline]
        O --> P[Crea más facturas]
        P --> Q[Se encolan más peticiones]
        Q --> R[Indicador muestra: 3 pendientes]
        
        R --> S[Usuario vuelve a tener conexión]
        S --> T[ConnectionService detecta cambio]
        T --> U[OfflineQueueService procesa cola]
        
        U --> V[Envía petición 1]
        V --> W[Envía petición 2]
        W --> X[Envía petición 3]
        
        X --> Y[Todas exitosas]
        Y --> Z[Elimina de IndexedDB]
        Z --> AA[Indicador muestra: Conexión restaurada]
        AA --> AB[Indicador se oculta después de 3s]
    end
    
    style A fill:#e1f5ff
    style J fill:#fff9c4
    style L fill:#ffccbc
    style U fill:#c8e6c9
    style Y fill:#c8e6c9
```

## 📱 Componentes del Sistema

```mermaid
graph LR
    subgraph "Frontend Angular"
        A[App Component]
        B[Connection Indicator]
        C[Login Component]
        D[Dashboard Component]
    end
    
    subgraph "Servicios"
        E[ConnectionService]
        F[OfflineQueueService]
    end
    
    subgraph "Interceptores"
        G[OfflineInterceptor]
    end
    
    subgraph "Almacenamiento"
        H[IndexedDB]
        I[Cache Storage]
    end
    
    subgraph "Backend"
        J[API Server]
    end
    
    A --> B
    A --> C
    A --> D
    
    B --> E
    C --> G
    D --> G
    
    G --> E
    G --> F
    
    E --> K[Window Events]
    F --> H
    G --> J
    
    L[Service Worker] --> I
    L --> J
    
    style E fill:#c8e6c9
    style F fill:#fff9c4
    style G fill:#ffccbc
    style H fill:#e1f5ff
    style I fill:#e1f5ff
```

## ⚙️ Configuración del Service Worker

```mermaid
graph TB
    A[ngsw-config.json] --> B[assetGroups]
    A --> C[dataGroups]
    
    B --> D[app: CSS, JS, HTML]
    B --> E[assets: Imágenes, fuentes]
    
    C --> F[api-cache: freshness strategy]
    C --> G[api-offline: performance strategy]
    
    F --> H[Prioridad: Red primero]
    F --> I[Timeout: 5s]
    F --> J[MaxAge: 1h]
    
    G --> K[Prioridad: Caché primero]
    G --> L[MaxAge: 1d]
    
    style A fill:#e1f5ff
    style F fill:#c8e6c9
    style G fill:#fff9c4
```

## 🎯 Casos de Uso

### Caso 1: Usuario offline hace GET
```mermaid
sequenceDiagram
    participant U as Usuario
    participant SW as Service Worker
    participant C as Cache
    
    U->>SW: GET /api/facturas
    SW->>C: ¿Existe en caché?
    C-->>SW: Sí, datos de hace 2 horas
    SW-->>U: Devuelve datos cacheados
    Note over U: Ve datos con badge "Offline"
```

### Caso 2: Usuario offline hace POST
```mermaid
sequenceDiagram
    participant U as Usuario
    participant I as Interceptor
    participant Q as Queue
    participant IDB as IndexedDB
    
    U->>I: POST /api/facturas
    I->>I: Detecta offline
    I->>Q: Encola petición
    Q->>IDB: Guarda en IndexedDB
    IDB-->>Q: Confirmación
    Q-->>I: ID: abc123
    I-->>U: 202 Accepted (simulado)
    Note over U: Ve mensaje "Petición encolada"
```

### Caso 3: Conexión restaurada
```mermaid
sequenceDiagram
    participant CS as Connection Service
    participant Q as Queue
    participant IDB as IndexedDB
    participant API as API Server
    
    CS->>CS: Detecta cambio a online
    CS->>Q: Notifica conexión
    Q->>IDB: Obtiene peticiones
    IDB-->>Q: 3 peticiones pendientes
    
    loop Para cada petición
        Q->>API: POST /api/facturas
        API-->>Q: 201 Created
        Q->>IDB: Elimina de cola
    end
    
    Q->>CS: Todas procesadas
    CS->>UI: Actualiza indicador
```

## 📊 Métricas y Estados

```mermaid
graph TB
    A[Estado del Sistema] --> B[Online]
    A --> C[Offline]
    
    B --> D[Peticiones GET: Red]
    B --> E[Peticiones POST: Directas]
    B --> F[Cache: Se actualiza]
    
    C --> G[Peticiones GET: Caché]
    C --> H[Peticiones POST: Encoladas]
    C --> I[Cache: Estático]
    
    H --> J[IndexedDB: Almacena]
    J --> K[Contador: Incrementa]
    
    style B fill:#c8e6c9
    style C fill:#ffccbc
    style J fill:#e1f5ff
```

## 🔄 Ciclo de Vida de una Petición POST Offline

```mermaid
stateDiagram-v2
    [*] --> Creada: Usuario envía POST
    
    Creada --> Encolada: Interceptor detecta offline
    Encolada --> EnIndexedDB: Guardada en IndexedDB
    EnIndexedDB --> Pendiente: Esperando conexión
    
    Pendiente --> Procesando: Conexión restaurada
    Procesando --> Enviando: Enviando a servidor
    
    Enviando --> Exitosa: Respuesta 200-299
    Enviando --> Error: Respuesta error
    
    Error --> Reintentando: Reintentos < 3
    Reintentando --> Enviando
    
    Error --> Eliminada: Reintentos >= 3
    Exitosa --> Eliminada: Removida de cola
    
    Eliminada --> [*]
    
    note right of Pendiente
        Usuario puede seguir
        trabajando normalmente
    end note
    
    note right of Exitosa
        Datos sincronizados
        con el servidor
    end note
```
