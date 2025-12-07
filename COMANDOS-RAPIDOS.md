# ⚡ COMANDOS RÁPIDOS

## 📋 Comandos Esenciales

### Desarrollo Local
```bash
# Instalar dependencias (primera vez)
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000

# Detener servidor
Ctrl + C
```

### Build y Preview
```bash
# Crear build de producción
npm run build

# Vista previa del build
npm run preview
```

---

## 🗄️ Comandos Supabase

### Consultas Útiles
```sql
-- Ver todas tus cartas
SELECT * FROM cards WHERE user_id = auth.uid();

-- Contar cartas por tipo
SELECT type, COUNT(*) FROM cards 
WHERE user_id = auth.uid() 
GROUP BY type;

-- Ver todas las relaciones
SELECT * FROM card_relationships;

-- Ver todos tus tags
SELECT * FROM tags WHERE user_id = auth.uid();

-- Buscar cartas por texto
SELECT * FROM cards 
WHERE user_id = auth.uid() 
AND (title ILIKE '%buscar%' OR content ILIKE '%buscar%');

-- Eliminar todas las cartas (¡CUIDADO!)
DELETE FROM cards WHERE user_id = auth.uid();
```

### Gestión de DB
```sql
-- Ver políticas RLS activas
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Ver índices
SELECT * FROM pg_indexes 
WHERE schemaname = 'public';

-- Ver tamaño de tablas
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🐙 Comandos Git

### Setup Inicial
```bash
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: IdeaCanvas app"

# Crear branch main
git branch -M main

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/ideacanvas.git

# Subir código
git push -u origin main
```

### Workflow Diario
```bash
# Ver estado actual
git status

# Ver cambios
git diff

# Agregar archivos modificados
git add .

# Commit con mensaje
git commit -m "feat: agregar nueva funcionalidad"

# Subir cambios
git push

# Ver historial
git log --oneline

# Ver branches
git branch -a

# Crear nuevo branch
git checkout -b feature/nueva-funcionalidad

# Cambiar de branch
git checkout main

# Mergear branch
git merge feature/nueva-funcionalidad
```

### Deshacer Cambios
```bash
# Descartar cambios locales
git checkout -- archivo.js

# Descartar todos los cambios
git reset --hard HEAD

# Volver al commit anterior
git reset --soft HEAD~1

# Volver 3 commits atrás
git reset --hard HEAD~3
```

---

## 🚀 Comandos Vercel

### Usando Vercel CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy desde local
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Ver lista de deployments
vercel list

# Ver dominios
vercel domains

# Agregar variable de entorno
vercel env add VARIABLE_NAME
```

---

## 🔍 Debugging

### Navegador
```bash
# Abrir DevTools
F12 o Cmd+Opt+I (Mac)

# Ver console errors
Console tab

# Ver network requests
Network tab

# Inspeccionar elementos
Elements tab

# Ver componentes React
React DevTools (instalar extensión)
```

### Terminal
```bash
# Ver logs del servidor dev
npm run dev -- --debug

# Ver qué procesos usan el puerto 3000
lsof -i :3000        # Mac/Linux
netstat -ano | findstr :3000   # Windows

# Matar proceso en puerto 3000
npx kill-port 3000

# Limpiar cache de npm
npm cache clean --force

# Reinstalar todo desde cero
rm -rf node_modules package-lock.json
npm install
```

---

## 🧹 Mantenimiento

### Actualizar Dependencias
```bash
# Ver qué paquetes tienen updates
npm outdated

# Actualizar todo
npm update

# Actualizar un paquete específico
npm install react@latest

# Ver versión actual de paquetes
npm list --depth=0

# Auditoría de seguridad
npm audit

# Arreglar vulnerabilidades
npm audit fix
```

### Limpiar Proyecto
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Eliminar build anterior
rm -rf dist

# Limpiar cache de Vite
rm -rf node_modules/.vite
```

---

## 📊 Análisis de Código

### Tamaño del Bundle
```bash
# Ver tamaño del build
npm run build
du -sh dist/

# Análisis detallado del bundle
npx vite-bundle-visualizer
```

### Linting (si instalas)
```bash
# Instalar ESLint
npm install -D eslint

# Configurar
npx eslint --init

# Correr lint
npx eslint src/

# Auto-fix
npx eslint src/ --fix
```

---

## 🧪 Testing (para después)

### Setup
```bash
# Instalar Vitest
npm install -D vitest

# Instalar React Testing Library
npm install -D @testing-library/react @testing-library/jest-dom
```

### Comandos
```bash
# Correr tests
npm test

# Con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Test específico
npm test -- Card.test.jsx
```

---

## 🔥 Comandos de Emergencia

### App no carga
```bash
# 1. Verificar que el servidor esté corriendo
ps aux | grep node

# 2. Matar todos los procesos Node
pkill -9 node

# 3. Reinstalar y ejecutar
rm -rf node_modules
npm install
npm run dev
```

### Error de permisos en npm
```bash
# Mac/Linux
sudo chown -R $USER /usr/local/lib/node_modules

# O usar sin sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Git conflictos
```bash
# Ver archivos en conflicto
git status

# Aceptar cambios locales
git checkout --ours archivo.js

# Aceptar cambios remotos
git checkout --theirs archivo.js

# Después de resolver
git add .
git commit -m "resolve conflicts"
```

---

## 💡 Shortcuts del Editor (VS Code)

```
Ctrl/Cmd + P          - Quick open file
Ctrl/Cmd + Shift + P  - Command palette
Ctrl/Cmd + B          - Toggle sidebar
Ctrl/Cmd + J          - Toggle terminal
Ctrl/Cmd + `          - Toggle terminal
Ctrl/Cmd + /          - Toggle comment
Alt + Up/Down         - Move line up/down
Shift + Alt + Up/Down - Duplicate line
Ctrl/Cmd + D          - Select next occurrence
Ctrl/Cmd + F          - Find
Ctrl/Cmd + H          - Replace
F2                    - Rename symbol
Ctrl/Cmd + Click      - Go to definition
```

---

## 🎯 Aliases Útiles (Opcional)

Agrega a `.bashrc` o `.zshrc`:

```bash
# IdeaCanvas aliases
alias idea-dev='cd ~/ideacanvas-app && npm run dev'
alias idea-build='cd ~/ideacanvas-app && npm run build'
alias idea-deploy='cd ~/ideacanvas-app && git push'
alias idea-logs='vercel logs'
alias idea-db='open https://lxrqcqagnusnabpvuugx.supabase.co'
```

Luego:
```bash
source ~/.bashrc  # o ~/.zshrc
```

Ahora puedes usar:
```bash
idea-dev      # Ejecuta la app
idea-deploy   # Deploy rápido
idea-db       # Abre Supabase
```

---

## 📝 Mensajes de Commit Recomendados

```bash
# Features
git commit -m "feat: agregar sistema de tags"
git commit -m "feat(cards): implementar drag and drop"

# Fixes
git commit -m "fix: corregir bug en autenticación"
git commit -m "fix(ui): resolver problema de scroll"

# Docs
git commit -m "docs: actualizar README"
git commit -m "docs(api): documentar endpoints"

# Style
git commit -m "style: formatear código"
git commit -m "style(ui): ajustar espaciado"

# Refactor
git commit -m "refactor: simplificar lógica de cartas"
git commit -m "refactor(db): optimizar queries"

# Performance
git commit -m "perf: mejorar tiempo de carga"

# Tests
git commit -m "test: agregar tests para Card component"

# Chore
git commit -m "chore: actualizar dependencias"
git commit -m "chore: configurar linter"
```

---

## 🔗 Links Rápidos

```bash
# Local
http://localhost:3000          - App local

# Producción
https://tu-app.vercel.app      - App en Vercel

# Servicios
https://lxrqcqagnusnabpvuugx.supabase.co   - Dashboard Supabase
https://vercel.com/dashboard                - Dashboard Vercel
https://github.com/TU_USUARIO/ideacanvas   - Repositorio GitHub
```

---

## 📌 Nota

Guarda este archivo para referencia rápida. Es tu "cheat sheet" personal.

**Tip:** Imprime o ten abierto en otra pantalla mientras desarrollas.
