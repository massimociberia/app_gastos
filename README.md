# app_gastos

Este repositorio es para la aplicacion que voy a crear para controlar mis gastos.

PWA de control de gastos personales — **Next.js 16 (App Router) + TypeScript + Tailwind 4 + Supabase**.

## Estado

**Fase 1**

- [x] Proyecto Next.js con App Router, TypeScript y Tailwind
- [x] Conexión a Supabase (`@supabase/supabase-js` + `@supabase/ssr`)
- [x] Login por email con magic link
- [x] Tabla `transacciones` con RLS (SQL en `supabase/schema.sql`)
- [x] PWA instalable (manifest + íconos + service worker)

**Fase 2**

- [x] Formulario de carga manual (`origen='manual'`)
- [x] Lista del mes, por fecha descendente, con eliminar
- [x] Resumen del mes: ingresos, egresos y balance en pesos
- [x] Navegación entre meses

Pendiente para fases siguientes: dashboard con gráficos, importación de PDF.

## Puesta en marcha

### 1. Variables de entorno

Ya existe `.env.local` (no se commitea). Si lo perdés, copiá `.env.example` y completá
con los datos de Supabase Dashboard → Project Settings → API.

### 2. Crear la tabla en Supabase

Abrir Supabase Dashboard → **SQL Editor** → New query, pegar el contenido de
[`supabase/schema.sql`](supabase/schema.sql) y ejecutar.

### 3. Configurar las URLs de Auth

Supabase Dashboard → **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000`
- Redirect URLs: agregar `http://localhost:3000/**`

### 4. Correr

```bash
npm run dev
```

Abrir http://localhost:3000 → redirige a `/login`.

## Estructura relevante

| Ruta | Qué hace |
| --- | --- |
| `src/lib/supabase/client.ts` | Cliente de Supabase para el navegador |
| `src/lib/supabase/server.ts` | Cliente para Server Components / Route Handlers |
| `src/lib/supabase/middleware.ts` | Refresco de sesión + protección de rutas |
| `src/proxy.ts` | Engancha lo anterior a cada request (ex `middleware.ts`) |
| `src/app/login/` | Pantalla de login (magic link) |
| `src/app/auth/callback/route.ts` | Canje del `?code=` del magic link (PKCE) |
| `src/app/auth/confirm/route.ts` | Alternativa con `token_hash` (ver abajo) |
| `src/app/page.tsx` | Pantalla principal: resumen + alta + lista del mes |
| `src/app/actions/transacciones.ts` | Server actions de alta y borrado |
| `src/components/` | Selector de mes, resumen, formulario, lista |
| `src/lib/categorias.ts` | Lista de categorías (editá acá para agregar/sacar) |
| `src/lib/formato.ts` | Pesos, fechas y navegación de meses |
| `tests/formato.test.mjs` | Tests de esa lógica (`npm test`) |
| `src/app/manifest.ts` | Manifest de la PWA |
| `public/sw.js` | Service worker (fallback offline) |
| `supabase/schema.sql` | Tabla `transacciones` + políticas RLS |

## Nota sobre el magic link

Con el template de email por defecto de Supabase el link usa el flujo **PKCE**: hay que
abrirlo **en el mismo navegador** desde el que se pidió. Si querés que funcione también
al abrirlo en otro dispositivo, cambiá el template en
Authentication → Email Templates → Magic Link por:

```
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Entrar</a>
```

La ruta `/auth/confirm` ya está implementada para ese caso.
