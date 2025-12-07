# IdeaCanvas

Aplicación de gestión de portafolio y brainstorming con integración a Supabase.

## 🚀 Características

- ✅ Gestión de cartas (Notas, Ideas, Tareas, Proyectos)
- ✅ Dos modos de vista: Canvas libre y Vista organizada
- ✅ Drag & drop en modo canvas
- ✅ Sistema de tags personalizables
- ✅ Estado activo/inactivo por carta
- ✅ Autenticación con Google
- ✅ Persistencia en tiempo real con Supabase
- ✅ Sincronización automática

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Supabase (gratuita)
- npm o yarn

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Supabase**

El proyecto ya está configurado con las credenciales de Supabase en `src/supabaseClient.js`

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

## 📦 Deploy en Vercel

1. **Subir a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <tu-repo>
git push -u origin main
```

2. **Conectar con Vercel**
- Ir a [vercel.com](https://vercel.com)
- Importar tu repositorio de GitHub
- Vercel detectará automáticamente la configuración de Vite
- Deploy!

## 🗄️ Schema de Base de Datos

El schema ya está creado en Supabase con las siguientes tablas:
- `cards` - Tarjetas principales
- `card_relationships` - Relaciones entre cartas
- `tags` - Tags disponibles
- `card_tags` - Relación entre cartas y tags

## 🔐 Configuración de Row Level Security (RLS)

**IMPORTANTE**: Antes de usar en producción, necesitas habilitar las políticas RLS en Supabase:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_tags ENABLE ROW LEVEL SECURITY;

-- Políticas para cards
CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para tags
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para card_tags (requiere join con cards)
CREATE POLICY "Users can manage tags on their cards"
  ON card_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_tags.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- Políticas para card_relationships
CREATE POLICY "Users can manage relationships on their cards"
  ON card_relationships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_relationships.from_card_id
      AND cards.user_id = auth.uid()
    )
  );
```

## 📝 Uso

1. **Iniciar sesión** con tu cuenta de Google
2. **Crear cartas** usando el botón "Nueva Idea"
3. **Arrastrar y soltar** en modo Canvas
4. **Organizar** usando el modo Vista Organizada
5. **Agregar tags** para categorizar tus ideas
6. **Activar/Desactivar** cartas según su relevancia

## 🎯 Próximas Funcionalidades (Fase 2)

- [ ] Relaciones visuales entre cartas
- [ ] Canvas dentro de proyectos
- [ ] Evolución de cartas (Nota → Idea → Tarea/Proyecto)
- [ ] Confirmación visual para cambios de estado

## 📄 Licencia

Proyecto personal de Víctor
