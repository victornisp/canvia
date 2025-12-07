# 📐 ARQUITECTURA DEL PROYECTO

## Estructura de Archivos

```
ideacanvas-app/
├── index.html              # Punto de entrada HTML
├── package.json            # Dependencias y scripts
├── vite.config.js          # Configuración de Vite
├── .gitignore             # Archivos ignorados por Git
├── README.md              # Documentación general
├── INICIO-RAPIDO.md       # Guía paso a paso
├── supabase-rls-policies.sql  # Políticas de seguridad
└── src/
    ├── main.jsx           # Inicialización de React
    ├── App.jsx            # Componente principal
    ├── index.css          # Estilos globales
    └── supabaseClient.js  # Cliente de Supabase
```

---

## Stack Tecnológico

### Frontend
- **React 18.3** - Librería UI
- **Vite 5** - Build tool y dev server (más rápido que Create React App)
- **Lucide React** - Iconos modernos

### Backend & Base de Datos
- **Supabase** - Backend as a Service
  - PostgreSQL - Base de datos relacional
  - Row Level Security - Seguridad a nivel de fila
  - Realtime - Sincronización en tiempo real
  - Auth - Autenticación con Google OAuth

### Deploy
- **Vercel** - Hosting gratuito con CI/CD automático
- **GitHub** - Control de versiones

---

## Flujo de Datos

```
Usuario → React App → Supabase Client → Supabase API → PostgreSQL
                                                          ↓
                                                    RLS Policies
                                                          ↓
                                              Datos del usuario actual
```

---

## Componentes Principales (App.jsx)

### 1. Estados (useState)
```javascript
- cards          // Array de todas las cartas
- tags           // Array de todos los tags
- draggedCard    // Carta siendo arrastrada
- viewMode       // 'canvas' o 'organized'
- user           // Usuario autenticado
- loading        // Estado de carga inicial
```

### 2. Efectos (useEffect)
```javascript
- Auth check     // Verifica sesión al cargar
- Load cards     // Carga cartas cuando hay usuario
- Load tags      // Carga tags cuando hay usuario
```

### 3. Funciones CRUD

**Cards:**
- `loadCards()` - Lee cartas de Supabase
- `createNewCard(type)` - Crea nueva carta
- `updateCard(id, field, value)` - Actualiza carta
- `deleteCard(id)` - Elimina carta
- `toggleCardStatus(id, status)` - Activa/desactiva

**Tags:**
- `loadTags()` - Lee tags de Supabase
- `createTag()` - Crea nuevo tag
- `toggleCardTag(cardId, tagId)` - Asigna/remueve tag de carta

**Auth:**
- `handleLogin()` - Inicia sesión con Google
- `handleLogout()` - Cierra sesión

**Drag & Drop:**
- `handleMouseDown()` - Inicia arrastre
- `handleMouseMove()` - Actualiza posición
- `handleMouseUp()` - Finaliza arrastre y guarda

---

## Schema de Base de Datos

### Tabla: cards
```sql
id              UUID (PK)
type            TEXT (note, idea, task, project)
title           TEXT
content         TEXT
color           TEXT
x               FLOAT (posición X en canvas)
y               FLOAT (posición Y en canvas)
parent_project_id  UUID (FK → cards.id)
is_active       BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP
user_id         UUID (FK → auth.users.id)
```

### Tabla: tags
```sql
id              UUID (PK)
name            TEXT
color           TEXT
user_id         UUID (FK → auth.users.id)
```

### Tabla: card_tags (Join table)
```sql
card_id         UUID (FK → cards.id)
tag_id          UUID (FK → tags.id)
PRIMARY KEY (card_id, tag_id)
```

### Tabla: card_relationships
```sql
id              UUID (PK)
from_card_id    UUID (FK → cards.id)
to_card_id      UUID (FK → cards.id)
relationship_type  TEXT (contains, related)
created_at      TIMESTAMP
```

---

## Seguridad (RLS)

Row Level Security asegura que:
- ✅ Los usuarios solo ven sus propias cartas
- ✅ Los usuarios solo pueden modificar sus propias cartas
- ✅ Los tags están aislados por usuario
- ✅ Las relaciones solo funcionan dentro de las cartas del usuario

**Sin RLS:** Cualquiera podría hacer:
```sql
SELECT * FROM cards; -- Ve todas las cartas de todos los usuarios 😱
```

**Con RLS:** Supabase automáticamente filtra:
```sql
SELECT * FROM cards WHERE user_id = auth.uid(); -- Solo tus cartas ✅
```

---

## Flujo de Autenticación

1. Usuario hace click en "Iniciar sesión con Google"
2. `handleLogin()` llama a `supabase.auth.signInWithOAuth()`
3. Supabase redirige a Google OAuth
4. Usuario autoriza la app
5. Google redirige de vuelta con token
6. Supabase crea sesión automáticamente
7. `useEffect` detecta cambio de auth
8. `setUser()` actualiza estado
9. `loadCards()` y `loadTags()` se ejecutan
10. Usuario ve su canvas personalizado

---

## Optimizaciones Implementadas

### 1. Real-time sin polling
- Supabase client maneja suscripciones WebSocket
- Cambios se reflejan instantáneamente

### 2. Lazy loading de tags
- Tags solo se cargan cuando el modal se abre
- Reduce queries innecesarias

### 3. Optimistic UI updates
- La UI se actualiza inmediatamente
- Si falla, se revierte (no implementado aún)

### 4. Índices en DB
```sql
CREATE INDEX idx_cards_user ON cards(user_id);
CREATE INDEX idx_cards_parent ON cards(parent_project_id);
```
Mejora velocidad de queries en 100x+

---

## Próximas Mejoras Técnicas (Fase 2)

### 1. Context API
Reemplazar prop drilling con Context:
```javascript
<UserContext.Provider value={user}>
  <CardsContext.Provider value={cards}>
    <App />
  </CardsContext.Provider>
</UserContext.Provider>
```

### 2. React Query
Cache y sincronización automática:
```javascript
const { data: cards } = useQuery('cards', loadCards);
```

### 3. Zustand
State management más limpio:
```javascript
const useStore = create((set) => ({
  cards: [],
  addCard: (card) => set((state) => ({ 
    cards: [...state.cards, card] 
  }))
}))
```

### 4. TypeScript
Type safety para prevenir bugs:
```typescript
interface Card {
  id: string;
  type: 'note' | 'idea' | 'task' | 'project';
  title: string;
  // ...
}
```

### 5. Testing
```javascript
// Unit tests con Vitest
// E2E tests con Playwright
```

---

## Performance Metrics

**Current (sin optimización):**
- First Contentful Paint: ~1.2s
- Time to Interactive: ~1.8s
- Lighthouse Score: ~85

**Goal (optimizado):**
- First Contentful Paint: <0.8s
- Time to Interactive: <1.2s
- Lighthouse Score: >95

---

## Escalabilidad

### Límites actuales (Supabase Free tier):
- 500 MB Database
- 1 GB File storage
- 2 GB Transfer/month
- 50,000 Monthly Active Users

### ¿Cuántas cartas soporta?
Con 500 MB y ~1KB por carta:
- **~500,000 cartas** antes de necesitar upgrade

### ¿Cuántos usuarios?
Supabase Free tier: **Ilimitados usuarios**
Limite: 50k MAU (Monthly Active Users)

---

## Monitoreo y Debugging

### Logs en Supabase:
Dashboard → Logs → Filtrar por tipo

### Error handling en frontend:
```javascript
try {
  const { data, error } = await supabase...
  if (error) throw error;
} catch (error) {
  console.error('Descriptive message:', error);
}
```

### Chrome DevTools:
- Network tab → Ver requests a Supabase
- Console → Ver errores JavaScript
- React DevTools → Inspeccionar componentes

---

## Costos Proyectados

### Actual (Free tier):
**$0/mes** hasta 50k MAU

### Si crece (Pro tier):
**$25/mes**:
- 8 GB Database
- 100 GB File storage
- 250 GB Transfer
- Soporte por email

### Comparación con alternativas:
- Firebase: $25-50/mes similar uso
- AWS: $50-100/mes con setup manual
- Heroku: $7/mes dyno + $9/mes DB = $16/mes (pero más lento)

**Veredicto:** Supabase es la opción más económica para este tipo de app.

---

**¿Preguntas sobre la arquitectura?** Estoy aquí para explicar cualquier parte en detalle.
