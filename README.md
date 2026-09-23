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
- **Detalhe da demanda**: busca a demanda real pelo `:id` da rota (descrição, categoria, empresa, solicitante, anexos, comentários e histórico de status vêm das tabelas `demandas`, `comentarios`, `anexos` e `status_historico`). O dropdown "Responsável" lista os usuários reais do Jurídico (`juridico` + `gestor`, área "Jurídico"), incluindo o gestor. "Confirmar triagem e atribuir" atualiza `prioridade`, `status` (`atribuida`) e `responsavel_id`, calcula `data_prazo_final_sla` (ver SLA abaixo) e registra os eventos em `status_historico`, `prioridade_historico` e `responsavel_historico`. A caixa de comentário insere de verdade em `comentarios`.
- **Painel Kanban**: busca as demandas atribuídas ao usuário do Jurídico selecionado (seletor simples, sem login ainda) e agrupa por status nas colunas Novas / Em andamento / Aguardando terceiro / Concluídas.
- **Início (Solicitante/Jurídico)**: os KPIs do topo (total, em andamento, aguardando, concluídas, ativas, vencem hoje/amanhã, aguardando terceiros) vêm de contagens reais. A lista "Solicitações recentes" (Início Solicitante) e o donut de status continuam mockados.
- **Dashboard**: "Demandas abertas", "Recebidas (30d)", "Concluídas (30d)", "Dentro do SLA", "SLA vencido" e o gráfico "por categoria" vêm de consultas reais. "Carga por responsável" e a tabela "Próximas do vencimento" continuam mockadas.
- **Cálculo de SLA**: ao confirmar a triagem, `data_prazo_final_sla` é calculada em dias úteis a partir de `sla_regras` (categoria + prioridade, com fallback para a regra sem categoria). Se a demanda tiver `tem_prazo_legal = true` e uma `data_prazo_legal` mais curta que o SLA padrão, o prazo legal prevalece. Lógica em `src/lib/sla.js`.

## O que ainda está mockado (próximos passos)

- "Solicitações recentes" e o donut de status (Início Solicitante), "Carga por responsável" e "Próximas do vencimento" (Dashboard) ainda usam `src/data/mock.js`.
- Não há login ainda — as telas usam usuários de teste fixos (`usuario.teste@grupobcenergia.com.br` como solicitante e `diego.montoanelli@grupobcenergia.com.br` como usuário do Jurídico "logado"). Isso deve ser substituído pelo Supabase Auth.
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
