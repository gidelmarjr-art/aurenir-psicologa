# 🧠 Aurenir Terto — Psicoterapia Online & Materiais

Plataforma web completa desenvolvida para a psicóloga **Aurenir Terto**, combinando uma experiência institucional acolhedora e segura com um sistema de agendamento e painel administrativo para gestão de horários e conteúdos.

---

## 📸 Demonstração do Projeto

<div align="center">
  <img src="public/aurenirterto.png" alt="Aurenir Terto Psicoterapia Preview" width="100%" />
</div>

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas e robustas do ecossistema Full-Stack:

- **Front-End:** React, Vite, JavaScript
- **Estilização:** CSS Modular (com variáveis customizadas, design acolhedor e animações interativas)
- **Back-End & Banco de Dados:** Supabase (Database PostgreSQL, Auth & Storage)
- **Hospedagem & Deploy:** Vercel

---

## ⚙️ Principais Funcionalidades

- **Atendimento Humanizado & Seguro:** Apresentação da metodologia, temas de atuação, comunidade e direcionamento para sessões online com foco na privacidade (LGPD).
- **Agendamento Inteligente:** Interface para pacientes solicitarem horários com redirecionamento para o WhatsApp, registrando apenas estatísticas anônimas no banco.
- **Painel Administrativo (`/admin`):**
  - **Dashboard Analítico:** Métricas de acesso, cliques, sessões solicitadas e gráficos de desempenho dos últimos 14 dias.
  - **Gestão de Produtos/Materiais:** Cadastro, alteração de ordem, upload de capas e gerenciamento de visibilidade.
  - **Gestão de Agendamentos:** Gerenciamento dinâmico de datas e horários disponíveis/reservados no calendário.
- **Catálogo de Materiais (`/materiais`):** Página dedicada para disponibilização e venda de conteúdos digitais.

---

## 📂 Estrutura do Projeto

```text
supabase/schema.sql          → Tabelas, políticas de segurança (RLS) e dados iniciais
vercel.json                  → Regras de roteamento para o painel /admin na Vercel
src/
├── data/siteData.js         → Informações e textos estáticos do site (CRP, contato, etc.)
├── lib/                     → Configuração do Supabase e utilitários de fuso horário
├── services/                → Camada de integração com o Supabase (produtos, slots, dashboard)
├── hooks/                   → Hooks customizados para consumo de dados públicos
├── styles/global.css        → Tokens de design, cores e reset global
├── admin/                   → Componentes e páginas do Painel Administrativo
└── components/              → Componentes da aplicação pública (Hero, Sobre, Modal, etc.)
```
