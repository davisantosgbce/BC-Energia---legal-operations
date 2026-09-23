# Portal Jurídico — Grupo BC Energia

Protótipo navegável (React + Vite + Tailwind) da plataforma de gestão de demandas jurídicas, já conectado a um banco de dados real no Supabase.

## Rodando localmente

```bash
npm install
cp .env.example .env   # já vem com a URL e a chave pública do projeto Supabase
npm run dev
```

Acesse `http://localhost:5173`.

## O que já está conectado ao Supabase

- **Nova solicitação**: categorias e empresas vêm do banco; enviar o formulário cria uma linha real na tabela `demandas`.
- **Fila de triagem**: lista as demandas com status `nova`/`em_triagem` direto do banco.
- **Dashboard**: "Demandas abertas", "Recebidas (30d)", "Concluídas (30d)" e o gráfico "por categoria" vêm de consultas reais.

## O que ainda está mockado (próximos passos)

- Painel Kanban, Início (Solicitante/Jurídico) e Detalhe da demanda ainda usam `src/data/mock.js`.
- "Dentro do SLA" e "SLA vencido" no Dashboard: precisam da lógica de cálculo de prazo (seção 6 da especificação).
- Não há login ainda — o formulário usa um usuário de teste fixo (`ana.ribeiro@grupobcenergia.com.br`, semeado direto no banco). Isso deve ser substituído pelo Supabase Auth.
- **Row Level Security (RLS) está desabilitado** nas tabelas do Supabase — é intencional por enquanto (só dados de teste), mas precisa ser ativado com políticas por perfil assim que o login existir. Não coloque dados sensíveis reais nesse banco antes disso.

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
