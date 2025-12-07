# ✅ CHECKLIST DE IMPLEMENTACIÓN

Marca cada paso al completarlo. Sigue el orden exacto.

---

## FASE 1: Setup Inicial (15 minutos)

### A. Seguridad en Supabase
- [ ] Abrir Supabase: https://lxrqcqagnusnabpvuugx.supabase.co
- [ ] Ir a: SQL Editor
- [ ] Abrir archivo: `supabase-rls-policies.sql`
- [ ] Copiar TODO el contenido
- [ ] Pegar en SQL Editor
- [ ] Click "Run"
- [ ] Verificar mensaje: "Success. No rows returned"

### B. Configurar Google OAuth
- [ ] En Supabase: Authentication → Providers → Google
- [ ] Activar toggle "Enable"
- [ ] Ir a: https://console.cloud.google.com
- [ ] Crear proyecto nuevo (o usar existente)
- [ ] Habilitar Google+ API
- [ ] Crear OAuth Client ID (Web application)
- [ ] Agregar redirect URI: `https://lxrqcqagnusnabpvuugx.supabase.co/auth/v1/callback`
- [ ] Copiar Client ID
- [ ] Copiar Client Secret
- [ ] Pegar ambos en Supabase
- [ ] Save

### C. Preparar Entorno Local
- [ ] Abrir terminal
- [ ] Navegar a carpeta del proyecto: `cd ideacanvas-app`
- [ ] Verificar Node.js: `node --version` (debe ser 18+)
- [ ] Si no tienes Node.js, descargar de: https://nodejs.org

---

## FASE 2: Instalación Local (5 minutos)

- [ ] Instalar dependencias: `npm install`
- [ ] Esperar a que termine (puede tardar 2-3 minutos)
- [ ] Verificar que no hay errores

---

## FASE 3: Primera Ejecución (2 minutos)

- [ ] Ejecutar: `npm run dev`
- [ ] Verificar que dice: "Local: http://localhost:3000"
- [ ] Abrir navegador en: http://localhost:3000
- [ ] Ver pantalla de login
- [ ] Click "Iniciar sesión con Google"
- [ ] Seleccionar cuenta Google
- [ ] Aceptar permisos
- [ ] Ver dashboard de IdeaCanvas

---

## FASE 4: Prueba Funcional (5 minutos)

### Crear Primera Carta
- [ ] Click "Nueva Idea"
- [ ] Seleccionar "Proyecto"
- [ ] Ver carta creada en canvas
- [ ] Cambiar título: "Mi Primer Proyecto"
- [ ] Escribir contenido: "Esto funciona!"
- [ ] Arrastrar la carta a otra posición

### Probar Tags
- [ ] Click icono de tag en la carta
- [ ] Crear nuevo tag: "importante"
- [ ] Asignar tag a la carta
- [ ] Ver tag aplicado

### Probar Modos de Vista
- [ ] Click "Organizar"
- [ ] Ver cartas organizadas por tipo
- [ ] Click "Canvas"
- [ ] Volver a vista libre

### Verificar Persistencia
- [ ] Cerrar pestaña del navegador
- [ ] Abrir nuevamente: http://localhost:3000
- [ ] Verificar que las cartas siguen ahí
- [ ] ✅ Si están, la persistencia funciona

---

## FASE 5: Deploy a Producción (10 minutos)

### Preparar Git
- [ ] En terminal, en carpeta del proyecto
- [ ] Ejecutar: `git init`
- [ ] Ejecutar: `git add .`
- [ ] Ejecutar: `git commit -m "Initial commit: IdeaCanvas"`

### Crear Repositorio GitHub
- [ ] Ir a: https://github.com/new
- [ ] Nombre: `ideacanvas`
- [ ] Visibilidad: Private (recomendado)
- [ ] NO inicializar con README
- [ ] Click "Create repository"
- [ ] Copiar la URL del repo

### Subir Código
- [ ] Ejecutar: `git remote add origin <URL-DEL-REPO>`
- [ ] Ejecutar: `git branch -M main`
- [ ] Ejecutar: `git push -u origin main`
- [ ] Actualizar GitHub, ver código subido

### Deploy en Vercel
- [ ] Ir a: https://vercel.com
- [ ] Sign up con GitHub
- [ ] Click "Add New" → "Project"
- [ ] Importar repositorio `ideacanvas`
- [ ] Framework: Vite (auto-detectado)
- [ ] Click "Deploy"
- [ ] Esperar 2-3 minutos
- [ ] Ver mensaje: "Deployment Ready"
- [ ] Click en URL generada
- [ ] Probar app en producción

---

## FASE 6: Verificación Final (5 minutos)

### En Producción (URL de Vercel)
- [ ] Iniciar sesión con Google
- [ ] Crear una carta
- [ ] Crear un tag
- [ ] Arrastrar carta
- [ ] Cerrar y reabrir
- [ ] Verificar persistencia

### En Local (si sigues desarrollando)
- [ ] Hacer un cambio en App.jsx
- [ ] Ver hot reload automático
- [ ] Commit: `git add . && git commit -m "test"`
- [ ] Push: `git push`
- [ ] Vercel auto-deploye en 1-2 minutos

---

## 🎉 ¡COMPLETADO!

Si marcaste todos los checks, tienes:
- ✅ App funcionando localmente
- ✅ Deploy en producción
- ✅ Base de datos segura
- ✅ Autenticación funcionando
- ✅ CI/CD automático

---

## 📝 SIGUIENTE: FASE 2

Una vez que todo funcione, avísame para implementar:
- Relaciones visuales entre cartas
- Canvas dentro de proyectos
- Evolución de cartas (Nota → Idea → Proyecto)
- Confirmaciones visuales

---

## 🆘 SI ALGO FALLA

### No puedo instalar npm
**Error:** "npm no se reconoce"
**Solución:** Instalar Node.js de nodejs.org

### Error al ejecutar npm install
**Error:** "Cannot find module"
**Solución:** 
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### No se conecta a Supabase
**Error:** "Failed to fetch"
**Solución:**
1. Verificar que ejecutaste RLS policies
2. Verificar credenciales en `src/supabaseClient.js`
3. Abrir consola (F12) y revisar error específico

### OAuth no funciona
**Error:** "Invalid redirect URI"
**Solución:**
1. Verificar redirect URI en Google Cloud Console
2. Debe ser EXACTAMENTE: `https://lxrqcqagnusnabpvuugx.supabase.co/auth/v1/callback`
3. Sin espacios ni caracteres extra

### Vercel no detecta el proyecto
**Solución:**
1. Verificar que `vite.config.js` existe
2. Verificar que `package.json` tiene scripts correctos
3. En Vercel, configurar manualmente:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

**¿Atascado en algún paso?** Marca dónde te quedaste y avísame.
