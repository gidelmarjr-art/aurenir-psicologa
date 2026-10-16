-- =====================================================================
--  Banco de dados do site da Aurenir Terto (Supabase / PostgreSQL)
--  Como usar: Supabase > SQL Editor > cole tudo e clique em "Run".
--  Pode rodar de novo sem medo: os comandos são idempotentes.
-- =====================================================================

-- ---------- 1) TABELAS ----------

-- Quem pode entrar no painel /admin (preenchida manualmente, veja o README)
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Materiais indicados (cards da seção "Materiais indicados")
create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  title      text not null check (char_length(title) between 2 and 160),
  image_url  text not null,
  buy_url    text not null check (buy_url ~* '^https?://'),
  active     boolean not null default true,   -- false = some do site, mas não é apagado
  position   integer not null default 0,      -- ordem de exibição (menor aparece primeiro)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Datas e horários de atendimento. O horário fica em UTC (timestamptz);
-- o site mostra sempre no fuso de Brasília.
create table if not exists public.available_slots (
  id         uuid primary key default gen_random_uuid(),
  starts_at  timestamptz not null unique,
  status     text not null default 'available' check (status in ('available', 'booked')),
  created_at timestamptz not null default now()
);

-- Estatística: cliques no botão "Comprar" (sem dados pessoais)
create table if not exists public.product_clicks (
  id         bigint generated always as identity primary key,
  product_id uuid references public.products (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Estatística: pedidos de sessão enviados pelo formulário.
-- DE PROPÓSITO não guarda nome nem contato do paciente (LGPD): só tema e período.
create table if not exists public.schedule_requests (
  id         bigint generated always as identity primary key,
  topic      text,
  period     text,
  slot_id    uuid references public.available_slots (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists products_position_idx on public.products (position);
create index if not exists slots_starts_at_idx on public.available_slots (starts_at);
create index if not exists clicks_created_idx on public.product_clicks (created_at);
create index if not exists requests_created_idx on public.schedule_requests (created_at);

-- ---------- 2) FUNÇÕES ----------

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- Tudo do dashboard em uma chamada só (só administradores conseguem executar)
create or replace function public.admin_dashboard(days integer default 14)
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare
  today date := (now() at time zone 'America/Sao_Paulo')::date;
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso negado' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'products_active',  (select count(*) from public.products where active),
    'products_total',   (select count(*) from public.products),
    'slots_available',  (select count(*) from public.available_slots where status = 'available' and starts_at > now()),
    'slots_booked',     (select count(*) from public.available_slots where status = 'booked' and starts_at > now()),
    'clicks_30d',       (select count(*) from public.product_clicks where created_at > now() - interval '30 days'),
    'requests_30d',     (select count(*) from public.schedule_requests where created_at > now() - interval '30 days'),
    'series', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'day', to_char(d, 'YYYY-MM-DD'),
               'clicks', coalesce(c.n, 0),
               'requests', coalesce(r.n, 0)) order by d), '[]'::jsonb)
      from generate_series(today - (days - 1), today, interval '1 day') as g(d)
      left join (select (created_at at time zone 'America/Sao_Paulo')::date as day, count(*) as n
                 from public.product_clicks group by 1) c on c.day = g.d::date
      left join (select (created_at at time zone 'America/Sao_Paulo')::date as day, count(*) as n
                 from public.schedule_requests group by 1) r on r.day = g.d::date
    ),
    'top_products', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select p.id, p.title, count(c.id) as clicks
        from public.products p
        left join public.product_clicks c
               on c.product_id = p.id and c.created_at > now() - interval '30 days'
        group by p.id
        order by count(c.id) desc, p.position
        limit 5
      ) t
    )
  ) into result;

  return result;
end;
$$;

-- ---------- 3) SEGURANÇA (RLS: regras por linha) ----------

alter table public.admins            enable row level security;
alter table public.products          enable row level security;
alter table public.available_slots   enable row level security;
alter table public.product_clicks    enable row level security;
alter table public.schedule_requests enable row level security;

-- admins: cada um só enxerga a própria linha
drop policy if exists "admins: ver a si mesmo" on public.admins;
create policy "admins: ver a si mesmo" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- products: o público vê só os ativos; o admin vê e altera tudo
drop policy if exists "products: público vê ativos" on public.products;
create policy "products: público vê ativos" on public.products
  for select to anon, authenticated using (active);
drop policy if exists "products: admin total" on public.products;
create policy "products: admin total" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- available_slots: o público vê só horários livres e futuros; o admin gerencia tudo
drop policy if exists "slots: público vê livres" on public.available_slots;
create policy "slots: público vê livres" on public.available_slots
  for select to anon, authenticated using (status = 'available' and starts_at > now());
drop policy if exists "slots: admin total" on public.available_slots;
create policy "slots: admin total" on public.available_slots
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- cliques e pedidos: o público só ESCREVE; só o admin lê
drop policy if exists "clicks: público registra" on public.product_clicks;
create policy "clicks: público registra" on public.product_clicks
  for insert to anon, authenticated with check (product_id is not null);
drop policy if exists "clicks: admin lê" on public.product_clicks;
create policy "clicks: admin lê" on public.product_clicks
  for select to authenticated using (public.is_admin());

drop policy if exists "requests: público registra" on public.schedule_requests;
create policy "requests: público registra" on public.schedule_requests
  for insert to anon, authenticated with check (true);
drop policy if exists "requests: admin lê" on public.schedule_requests;
create policy "requests: admin lê" on public.schedule_requests
  for select to authenticated using (public.is_admin());

-- Permissões de tabela (o RLS acima ainda decide quais linhas valem)
grant select on public.products, public.available_slots to anon;
grant insert on public.product_clicks, public.schedule_requests to anon;
grant select, insert, update, delete on public.products, public.available_slots to authenticated;
grant select, insert on public.product_clicks, public.schedule_requests to authenticated;
grant select on public.admins to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.admin_dashboard(integer) to authenticated;
revoke execute on function public.admin_dashboard(integer) from anon;

-- ---------- 4) ARMAZENAMENTO DAS CAPAS (Supabase Storage) ----------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "capas: admin envia" on storage.objects;
create policy "capas: admin envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "capas: admin altera" on storage.objects;
create policy "capas: admin altera" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "capas: admin apaga" on storage.objects;
create policy "capas: admin apaga" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ---------- 5) DADOS INICIAIS (os 3 materiais que já estão no site) ----------
-- As imagens apontam para os arquivos em public/materiais/ do próprio site.
insert into public.products (title, image_url, buy_url, position)
select * from (values
  ('Mentalidade de Vencedor', '/materiais/mentalidade-de-vencedor.png', 'https://chk.eduzz.com/39YBPNQ3WO', 1),
  ('E-book: Os Segredos da Aprendizagem Revelados pela PNL Aplicados à Educação', '/materiais/segredos-da-aprendizagem-pnl.png', 'https://sun.eduzz.com/1743870', 2),
  ('Oficina de Acolhida para Estudantes', '/materiais/oficina-de-acolhida.png', 'https://chk.eduzz.com/1755020', 3)
) as seed(title, image_url, buy_url, position)
where not exists (select 1 from public.products);
