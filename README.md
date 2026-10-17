# Site da psicóloga Aurenir Terto

React + Vite + Supabase. Cada componente fica na sua pasta, com o `.jsx` e o `.css` juntos.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera a pasta dist/ para publicar
```

Sem configurar o banco, o site funciona normalmente com os textos de `src/data/siteData.js`.
O painel `/admin` e o cadastro de datas/produtos só funcionam depois dos passos abaixo.

## 1. Configurar o banco (Supabase) — uma vez só

1. Crie um projeto em supabase.com.
2. **SQL Editor** → cole todo o arquivo `supabase/schema.sql` → **Run**.
   Cria as tabelas, as regras de segurança, a pasta de capas e já cadastra os 3 materiais atuais.
3. **Authentication → Providers → Email**: deixe o login por e-mail ativo e **desligue "Allow new users to sign up"**
   (ninguém de fora consegue criar conta).
4. **Authentication → Users → Add user**: crie o usuário da Aurenir (e-mail + senha forte).
5. **SQL Editor**: autorize esse usuário como administrador (troque o e-mail):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'EMAIL-DA-AURENIR@exemplo.com';
   ```
6. **Project Settings → API**: copie a *Project URL* e a chave *anon public*.
   Crie o arquivo `.env` (modelo em `.env.example`) e, na Vercel, cadastre as mesmas duas variáveis
   (Settings → Environment Variables) e faça um novo deploy.

## 2. Usar o painel

Acesse `seusite.com/admin` e entre com o e-mail e senha.

- **Geral**: números do site (produtos, cliques em Comprar, horários livres/reservados, pedidos de sessão) e gráfico de 14 dias.
- **Produtos**: cadastre nome, link de compra e capa (com prévia igual à do site), mostre/esconda, mude a ordem, edite ou apague.
- **Datas**: marque vários dias no calendário, escolha os horários (ou use Manhã/Tarde/Noite) e adicione.
  Quando confirmar uma paciente, marque o horário como **Reservado** para ele sair do site.

## Privacidade (LGPD)

O banco **não guarda nome nem contato** de pacientes. O formulário só abre o WhatsApp com a mensagem pronta;
no banco entra apenas uma estatística anônima (tema, período e horário escolhido).

## Estrutura

```
supabase/schema.sql          tabelas, regras de segurança, dados iniciais
vercel.json                  faz /admin funcionar na Vercel
src/
├── App.jsx  main.jsx
├── data/siteData.js         textos do site (nome, CRP, WhatsApp, temas...)
├── lib/                     supabase.js (conexão) e dates.js (datas no fuso de Brasília)
├── services/                products.js, slots.js, dashboard.js (acesso ao banco)
├── hooks/                   usePublicProducts.js, useAvailableSlots.js
├── styles/global.css        cores e base do site
├── admin/                   painel: Admin, login, dashboard, products, dates, calendar-picker, line-chart, stat-card, icons
└── components/              site: header, hero, about, topics, sessions, products, product-card,
                             community, footer, modal, schedule-modal, reveal,
                             materials-page (página /materiais com todos os produtos)
```
