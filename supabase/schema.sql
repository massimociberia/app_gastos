-- ============================================================
-- Fase 1 — Tabla `transacciones` + Row Level Security
-- Correr en Supabase Dashboard > SQL Editor > New query > Run
-- Es idempotente: se puede correr más de una vez sin romper nada.
-- ============================================================

create table if not exists public.transacciones (
  id          uuid primary key default gen_random_uuid(),
  fecha       date not null default current_date,
  descripcion text not null,
  monto       numeric(14, 2) not null,
  tipo        text not null check (tipo in ('ingreso', 'egreso')),
  categoria   text,
  cuenta      text,
  origen      text not null default 'manual' check (origen in ('manual', 'pdf')),
  usuario_id  uuid not null default auth.uid()
                references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

comment on table public.transacciones is
  'Ingresos y egresos de cada usuario. Cada fila pertenece a un solo usuario.';

-- Índice para el listado típico: mis transacciones, más recientes primero.
create index if not exists transacciones_usuario_fecha_idx
  on public.transacciones (usuario_id, fecha desc);

-- ------------------------------------------------------------
-- Row Level Security: cada usuario ve y toca sólo sus filas
-- ------------------------------------------------------------
alter table public.transacciones enable row level security;

-- Aplica RLS también al dueño de la tabla (defensa en profundidad).
alter table public.transacciones force row level security;

drop policy if exists "transacciones_select_propias" on public.transacciones;
create policy "transacciones_select_propias"
  on public.transacciones
  for select
  to authenticated
  using ((select auth.uid()) = usuario_id);

drop policy if exists "transacciones_insert_propias" on public.transacciones;
create policy "transacciones_insert_propias"
  on public.transacciones
  for insert
  to authenticated
  with check ((select auth.uid()) = usuario_id);

drop policy if exists "transacciones_update_propias" on public.transacciones;
create policy "transacciones_update_propias"
  on public.transacciones
  for update
  to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

drop policy if exists "transacciones_delete_propias" on public.transacciones;
create policy "transacciones_delete_propias"
  on public.transacciones
  for delete
  to authenticated
  using ((select auth.uid()) = usuario_id);
