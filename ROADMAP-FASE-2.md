# 🗺️ ROADMAP FASE 2 - Funcionalidades Avanzadas

## Estado Actual ✅

**Implementado en Fase 1:**
- ✅ CRUD de cartas (Nota, Idea, Tarea, Proyecto)
- ✅ Dos modos: Canvas libre + Vista organizada
- ✅ Drag & drop básico
- ✅ Sistema de tags
- ✅ Estado activo/inactivo
- ✅ Autenticación con Google
- ✅ Persistencia en Supabase
- ✅ Deploy automatizado

---

## Funcionalidades Pendientes 🚀

### 1. Relaciones Visuales entre Cartas

**Objetivo:** Conectar cartas relacionadas con líneas visuales

**Implementación:**
```javascript
// Componente ConnectionLine.jsx
- Dibuja línea SVG entre dos cartas
- Tipos: 'contains' (padre-hijo), 'related' (libre)
- Colores: Heredan del proyecto padre o personalizados

// Interacciones:
- Click en carta → Modo "conectar"
- Click en otra carta → Crea relación
- Hover en carta → Resalta conexiones
- Click en línea → Opciones (eliminar, cambiar tipo)
```

**Schema DB (ya existe):**
```sql
card_relationships:
- from_card_id → to_card_id
- relationship_type ('contains', 'related')
```

**UI:**
- Botón en carta: "Conectar con..."
- Mini-mapa para proyectos grandes
- Filtro: "Ver solo conexiones de este proyecto"

**Estimación:** 4-6 horas

---

### 2. Canvas dentro de Proyectos (Navegación Jerárquica)

**Objetivo:** Cada proyecto tiene su propio canvas interno

**Implementación Opción A (Modal):**
```javascript
// Estado adicional:
const [activeProject, setActiveProject] = useState(null);
const [breadcrumb, setBreadcrumb] = useState(['Principal']);

// Al hacer click en proyecto:
<ProjectModal
  project={activeProject}
  cards={cards.filter(c => c.parent_project_id === activeProject.id)}
  onClose={() => setActiveProject(null)}
/>
```

**Implementación Opción B (Navegación completa):**
```javascript
// Cambio de vista completo
const [currentContext, setCurrentContext] = useState('root');

// Breadcrumb: Principal > Proyecto X > Sub-proyecto Y
<Breadcrumb path={breadcrumb} onChange={navigateTo} />
```

**Features:**
- Crear cartas dentro de un proyecto
- Mover cartas entre proyectos (drag & drop)
- Ver jerarquía: Proyecto → Ideas/Tareas/Notas
- Botón "Fullscreen" para enfocarse en un proyecto

**Estimación:** 5-7 horas

---

### 3. Evolución de Cartas

**Objetivo:** Nota → Idea → Tarea/Proyecto con confirmación visual

**Flujo:**
```
┌─────┐    ┌──────┐    ┌──────────┐
│NOTA │ -> │ IDEA │ -> │ TAREA    │
└─────┘    └──────┘    │    O     │
                        │ PROYECTO │
                        └──────────┘
```

**Implementación:**
```javascript
const EvolveCardDialog = ({ card, onConfirm, onCancel }) => {
  const [targetType, setTargetType] = useState(null);
  
  return (
    <Modal>
      <h3>Evolucionar carta</h3>
      <p>Convertir "{card.title}" de {card.type} a:</p>
      
      <RadioGroup onChange={setTargetType}>
        {allowedEvolutions[card.type].map(type => (
          <Radio value={type}>{type}</Radio>
        ))}
      </RadioGroup>
      
      <Checkbox>
        Mantener relaciones existentes
      </Checkbox>
      
      <ButtonGroup>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onConfirm(targetType)}>
          Confirmar
        </Button>
      </ButtonGroup>
    </Modal>
  );
};

// Reglas de evolución:
const allowedEvolutions = {
  note: ['idea'],
  idea: ['task', 'project'],
  task: [], // No puede evolucionar
  project: [] // Inmutable
};
```

**Features adicionales:**
- Animación de transformación
- Historial de evolución (audit log)
- Opción de revertir (solo si no es proyecto)

**Estimación:** 3-4 horas

---

### 4. Mejoras en Drag & Drop

**Objetivo:** Drag & drop más robusto y visual

**Features:**
```javascript
// Snap to grid (opcional)
const GRID_SIZE = 20;
const snapToGrid = (x, y) => ({
  x: Math.round(x / GRID_SIZE) * GRID_SIZE,
  y: Math.round(y / GRID_SIZE) * GRID_SIZE
});

// Visual feedback
<Card
  isDragging={draggedCard?.id === card.id}
  style={{
    opacity: isDragging ? 0.7 : 1,
    transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
    cursor: isDragging ? 'grabbing' : 'grab'
  }}
/>

// Drag handle específico
<DragHandle className="drag-handle">
  <GripVertical />
</DragHandle>

// Solo arrastra desde el handle, no desde inputs
```

**Mejoras:**
- Arrastrar múltiples cartas (con Shift+Click)
- Alinear automáticamente
- Duplicar carta (Ctrl+Drag)
- Borrar con drag a zona "trash"

**Estimación:** 3-4 horas

---

### 5. Búsqueda y Filtros Avanzados

**Objetivo:** Encontrar cartas rápidamente

**Implementación:**
```javascript
<SearchBar>
  <Input
    placeholder="Buscar por título, contenido o tag..."
    onChange={handleSearch}
  />
  
  <FilterBar>
    <Dropdown label="Tipo">
      {cardTypes.map(type => (
        <Checkbox checked={filters.types.includes(type)}>
          {type}
        </Checkbox>
      ))}
    </Dropdown>
    
    <Dropdown label="Tags">
      {tags.map(tag => (
        <Checkbox checked={filters.tags.includes(tag.id)}>
          {tag.name}
        </Checkbox>
      ))}
    </Dropdown>
    
    <Dropdown label="Estado">
      <Radio value="all">Todos</Radio>
      <Radio value="active">Activos</Radio>
      <Radio value="inactive">Inactivos</Radio>
    </Dropdown>
  </FilterBar>
</SearchBar>

// Query optimizada:
const searchCards = async (query) => {
  const { data } = await supabase
    .from('cards')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .eq('user_id', user.id);
    
  return data;
};
```

**Features:**
- Búsqueda en tiempo real (debounced)
- Resaltado de coincidencias
- Guardar búsquedas frecuentes
- Exportar resultados

**Estimación:** 4-5 horas

---

### 6. Estados Avanzados por Tipo

**Objetivo:** Estados específicos según tipo de carta

**Definición:**
```javascript
const cardStates = {
  note: ['borrador', 'revisado'],
  idea: ['borrador', 'en_evaluacion', 'aprobada', 'descartada'],
  task: ['pendiente', 'en_progreso', 'bloqueada', 'completada'],
  project: ['planificacion', 'en_desarrollo', 'en_pausa', 'completado', 'cancelado']
};

// Colores por estado:
const stateColors = {
  borrador: '#gray',
  pendiente: '#yellow',
  en_progreso: '#blue',
  completada: '#green',
  bloqueada: '#red',
  // ...
};
```

**UI:**
```javascript
<StateSelector
  type={card.type}
  currentState={card.state}
  onChange={(newState) => updateCard(card.id, 'state', newState)}
/>

// Visual en carta:
<StatusBadge color={stateColors[card.state]}>
  {card.state}
</StatusBadge>
```

**Estimación:** 2-3 horas

---

### 7. Export & Import

**Objetivo:** Backup y compartir proyectos

**Implementación:**
```javascript
// Export
const exportProject = async (projectId) => {
  const cards = await loadProjectCards(projectId);
  const relationships = await loadRelationships(projectId);
  const tags = await loadProjectTags(projectId);
  
  const data = {
    version: '1.0',
    project: { ...projectData },
    cards,
    relationships,
    tags,
    exported_at: new Date().toISOString()
  };
  
  downloadJSON(data, `proyecto-${projectId}.json`);
};

// Import
const importProject = async (file) => {
  const data = JSON.parse(await file.text());
  
  // Validar versión
  if (data.version !== '1.0') {
    throw new Error('Versión incompatible');
  }
  
  // Importar con nuevos IDs
  const newIds = {};
  for (const card of data.cards) {
    const { id: newId } = await createCard({
      ...card,
      user_id: user.id
    });
    newIds[card.id] = newId;
  }
  
  // Re-mapear relaciones
  for (const rel of data.relationships) {
    await createRelationship({
      from_card_id: newIds[rel.from_card_id],
      to_card_id: newIds[rel.to_card_id],
      type: rel.type
    });
  }
};
```

**Formatos:**
- JSON (completo)
- Markdown (solo texto)
- CSV (tabla simple)

**Estimación:** 3-4 horas

---

## Orden de Implementación Recomendado

**Sprint 1 (8-10 horas):**
1. ✅ Estados avanzados (2-3h) - Base para todo
2. ✅ Evolución de cartas (3-4h) - Funcionalidad core
3. ✅ Canvas en proyectos - Opción A Modal (3h)

**Sprint 2 (8-10 horas):**
4. ✅ Relaciones visuales (4-6h)
5. ✅ Mejoras drag & drop (3-4h)

**Sprint 3 (7-9 horas):**
6. ✅ Búsqueda y filtros (4-5h)
7. ✅ Export/Import (3-4h)

**Sprint 4 (Opcional, 5h):**
8. ✅ Canvas en proyectos - Opción B Fullscreen
9. ✅ Analytics básicos
10. ✅ Compartir proyectos (colaboración)

---

## Mejoras de Performance (Paralelo)

### Optimizaciones:
```javascript
// 1. React.memo para cartas
const Card = React.memo(({ card, onUpdate }) => {
  // Solo re-renderiza si card cambia
});

// 2. Virtualización para muchas cartas
import { FixedSizeList } from 'react-window';

// 3. Debounce en drag
const debouncedUpdate = useDebouncedCallback(updateCard, 300);

// 4. IndexedDB para offline-first
import { openDB } from 'idb';
```

**Estimación:** 4-6 horas

---

## Testing (Crítico antes de producción)

```javascript
// Unit tests
describe('Card evolution', () => {
  it('should evolve note to idea', () => {
    const result = evolveCard(noteCard, 'idea');
    expect(result.type).toBe('idea');
  });
  
  it('should not allow task evolution', () => {
    expect(() => evolveCard(taskCard, 'idea')).toThrow();
  });
});

// E2E tests
test('should create and connect cards', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Nueva Idea');
  await page.click('text=Proyecto');
  await page.fill('input[name="title"]', 'Test Project');
  // ...
});
```

**Estimación:** 6-8 horas

---

## Total Estimado

**Funcionalidades Core:** 25-30 horas
**Performance & Testing:** 10-14 horas
**Buffer (bugs, ajustes):** 10 horas

**TOTAL:** ~45-54 horas de desarrollo

**Timeline sugerido:**
- Si trabajas 2h/día → 3-4 semanas
- Si trabajas 4h/día → 2 semanas
- Sprint intensivo → 1 semana

---

## Priorización

**MUST HAVE (Fase 2):**
- Estados avanzados
- Evolución de cartas
- Canvas en proyectos (Modal)
- Relaciones visuales básicas

**SHOULD HAVE:**
- Búsqueda y filtros
- Mejoras drag & drop
- Export/Import

**NICE TO HAVE (Fase 3):**
- Canvas fullscreen
- Colaboración
- Analytics
- Offline-first

---

**¿Listo para empezar Fase 2?** Avísame cuando completes el CHECKLIST.md
