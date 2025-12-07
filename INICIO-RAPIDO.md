# 🚀 GUÍA DE INICIO RÁPIDO - IdeaCanvas

## PASO 1: Configurar Seguridad en Supabase (CRÍTICO)

1. Ve a tu proyecto en Supabase: https://lxrqcqagnusnabpvuugx.supabase.co
2. En el menú lateral, ve a: **SQL Editor**
3. Click en **"New Query"**
4. Abre el archivo `supabase-rls-policies.sql` de este proyecto
5. Copia TODO el contenido y pégalo en el editor SQL
6. Click en **"Run"** (abajo derecha)
7. ✅ Deberías ver: "Success. No rows returned"

**¿Por qué es importante?**
Sin esto, cualquier usuario podría ver las cartas de otros. Las políticas RLS protegen tus datos.

---

## PASO 2: Habilitar Autenticación con Google

1. En Supabase, ve a: **Authentication → Providers**
2. Busca **"Google"** y haz click en editar
3. Activa el toggle **"Enable"**
4. Necesitas crear credenciales OAuth en Google:
   
   **A. Ve a Google Cloud Console:**
   - https://console.cloud.google.com/
   - Crea un proyecto nuevo o selecciona uno existente
   
   **B. Habilita Google+ API:**
   - APIs & Services → Library
   - Busca "Google+ API" y habilítala
   
   **C. Crear credenciales OAuth:**
   - APIs & Services → Credentials
   - "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Authorized redirect URIs: `https://lxrqcqagnusnabpvuugx.supabase.co/auth/v1/callback`
   - Copia el **Client ID** y **Client Secret**
   
   **D. Pegar en Supabase:**
   - Pega Client ID y Client Secret en Supabase
   - Save

---

## PASO 3: Instalar y Ejecutar Localmente

1. **Abre la terminal en la carpeta del proyecto**
   ```bash
   cd ideacanvas-app
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```
   
   Esto instalará:
   - React + React DOM
   - Vite (bundler)
   - Supabase client
   - Lucide icons

3. **Ejecuta en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   - Debería abrirse automáticamente en: `http://localhost:3000`
   - Si no, ábrelo manualmente

5. **Inicia sesión con Google**
   - Click en "Iniciar sesión con Google"
   - Selecciona tu cuenta
   - ¡Ya puedes empezar a crear cartas!

---

## PASO 4: Deploy en Vercel (GRATIS)

### Opción A: Deploy Directo desde GitHub

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: IdeaCanvas app"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/ideacanvas.git
   git push -u origin main
   ```

2. **Ve a Vercel:**
   - https://vercel.com
   - Sign up con tu cuenta de GitHub
   - Click en "Add New" → "Project"
   - Importa tu repositorio "ideacanvas"
   - Vercel detectará automáticamente que es un proyecto Vite
   - Click en **"Deploy"**

3. **¡Listo!**
   - En 2-3 minutos tendrás tu app en: `https://tu-proyecto.vercel.app`
   - Cada push a GitHub se deployará automáticamente

### Opción B: Deploy Rápido sin GitHub

```bash
# Instala Vercel CLI
npm install -g vercel

# Deploy
cd ideacanvas-app
vercel

# Sigue las instrucciones en terminal
# Selecciona: Yes → nombre del proyecto → Deploy
```

---

## PASO 5: Configurar Dominio Personalizado (Opcional)

1. En Vercel → Tu proyecto → Settings → Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones de Vercel

---

## 🎯 PRÓXIMOS PASOS - FASE 2

Una vez que tengas todo funcionando, implementaremos:

- [ ] **Relaciones visuales** entre cartas (líneas conectoras)
- [ ] **Canvas dentro de proyectos** (navegación jerárquica)
- [ ] **Evolución de cartas** con confirmación visual
- [ ] **Drag & drop mejorado** con snap-to-grid opcional
- [ ] **Búsqueda y filtros** avanzados

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Failed to fetch"
- ✅ Verifica que ejecutaste las políticas RLS en Supabase
- ✅ Revisa la consola del navegador (F12) para más detalles

### No puedo iniciar sesión con Google
- ✅ Verifica que configuraste OAuth correctamente en Google Cloud
- ✅ La URL de callback debe ser exacta en Google Cloud Console
- ✅ Asegúrate de que el provider de Google está habilitado en Supabase

### Error: "Cannot find module"
- ✅ Ejecuta: `npm install` nuevamente
- ✅ Borra `node_modules` y ejecuta `npm install` de nuevo

### Puerto 3000 ya en uso
- ✅ Cambia el puerto en `vite.config.js`: `port: 3001`
- ✅ O mata el proceso: `npx kill-port 3000`

---

## 📞 SIGUIENTES ACCIONES

1. ✅ Ejecuta las políticas RLS en Supabase (PASO 1)
2. ✅ Configura Google OAuth (PASO 2)
3. ✅ Instala y prueba localmente (PASO 3)
4. ✅ Deploy en Vercel (PASO 4)
5. 📧 Avísame cuando esté funcionando para implementar Fase 2

---

**¿Necesitas ayuda con algún paso?** Avísame y te guío.
