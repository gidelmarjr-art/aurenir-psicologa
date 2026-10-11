# Landing page – Psicóloga

React + Vite. Cada componente fica na sua pasta, com o `.jsx` e o `.css` juntos.

## Rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera a pasta dist/ para publicar (Vercel, Netlify...)
```

## O que editar
Quase tudo fica em `src/data/siteData.js`: nome, CRP, WhatsApp, textos do "Quem somos",
conteúdo dos temas (estresse, ansiedade, depressão, traumas) e os produtos (título, capa em public/materiais/ e link de compra).
Procure por `TROCAR`.

## Estrutura
```
src/
├── App.jsx
├── main.jsx
├── data/siteData.js
├── styles/global.css
└── components/
    ├── header/            Header.jsx  Header.css
    ├── hero/              Hero.jsx  Hero.css
    ├── about/             About.jsx  About.css      (Quem somos)
    ├── topics/            Topics.jsx  Topics.css
    ├── sessions/          Sessions.jsx  Sessions.css
    ├── community/         Community.jsx  Community.css
    ├── footer/            Footer.jsx  Footer.css
    ├── modal/             Modal.jsx  Modal.css      (base das janelas)
    ├── schedule-modal/    ScheduleModal.jsx  ScheduleModal.css
    ├── info-modal/        InfoModal.jsx  InfoModal.css
    ├── products/          Products.jsx  Products.css   (Materiais indicados)
```
