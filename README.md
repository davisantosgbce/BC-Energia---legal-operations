# Portal Jurídico — Grupo BC Energia

Protótipo navegável (React + Vite + Tailwind) da plataforma de gestão de demandas jurídicas. Dados mockados em `src/data/mock.js` — ainda sem backend.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Telas incluídas

| Rota | Tela |
|---|---|
| `/` | Início — Solicitante |
| `/nova-solicitacao` | Portal — Nova solicitação |
| `/juridico` | Início — Jurídico |
| `/triagem` | Fila de triagem (gestor) |
| `/demanda/:id` | Detalhe da demanda |
| `/painel` | Painel do responsável (Kanban) |
| `/dashboard` | Dashboard gerencial |

## Sistema visual

Tokens de cor, tipografia e componentes (`Card`, `KpiCard`, `StatusDot`, ícones) estão em `tailwind.config.js` e `src/components/`. Paleta da marca (Grupo BC Energia): navy `#242F40`, teal `#17968F` / `#3ecbc0`. Tipografia: Space Grotesk (títulos) + Work Sans (corpo). Ícones sempre em SVG de linha — nunca emoji.

## Colocando no Git

```bash
git init
git add .
git commit -m "Protótipo inicial do Portal Jurídico"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

## Próximos passos sugeridos

1. Conectar a um backend real (API REST) substituindo `src/data/mock.js`.
2. Implementar autenticação e os três perfis de acesso (Solicitante, Jurídico, Gestor/Administrador).
3. Regras de cálculo de SLA e prioridade no backend.
4. Deploy (Vercel, Netlify ou similar) a partir do repositório Git.
