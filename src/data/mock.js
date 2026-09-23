export const priorityColor = {
  Crítica: "#e8536b",
  Alta: "#f0b429",
  Média: "#6fa8f5",
  Baixa: "#3ecbc0",
};

export const statusColor = {
  "Em andamento": "#6fa8f5",
  "Aguardando você": "#f0b429",
  "Aguardando terceiro": "#f0b429",
  Concluída: "#3ecbc0",
  Vencida: "#e8536b",
  "Em triagem": "#f4899a",
};

export const minhasSolicitacoes = [
  {
    numero: "#1038",
    titulo: "Aditivo contrato fornecedor XPTO",
    categoria: "Contratos",
    responsavel: "Beatriz Nunes",
    status: "Em andamento",
  },
  {
    numero: "#1027",
    titulo: "Dúvida sobre reembolso de despesas",
    categoria: "Consultivo",
    responsavel: "Carlos Meireles",
    status: "Aguardando você",
  },
  {
    numero: "#1005",
    titulo: "NDA com novo fornecedor",
    categoria: "Contratos",
    responsavel: "Beatriz Nunes",
    status: "Concluída",
  },
];

export const filaTriagem = [
  {
    numero: "#1042",
    titulo: "Revisão de contrato de locação",
    area: "Facilities",
    solicitante: "João Prado",
    categoria: "Contratos",
    prioridade: "Alta",
    prazo: "28/09",
  },
  {
    numero: "#1041",
    titulo: "Notificação extrajudicial recebida",
    area: "Comercial",
    solicitante: "Rita Sales",
    categoria: "Notificações",
    prioridade: "Crítica",
    prazo: "Hoje",
  },
  {
    numero: "#1040",
    titulo: "Dúvida sobre política de home office",
    area: "RH",
    solicitante: "Camila Dias",
    categoria: "Trabalhista",
    prioridade: "Baixa",
    prazo: "05/10",
  },
  {
    numero: "#1039",
    titulo: "Procuração para novo diretor",
    area: "Societário",
    solicitante: "Paulo Reis",
    categoria: "Procurações",
    prioridade: "Média",
    prazo: "01/10",
  },
];

export const kanbanColunas = [
  {
    titulo: "Novas",
    cards: [
      { numero: "#1038", categoria: "Contratos", titulo: "Aditivo contrato fornecedor XPTO", prioridade: "Alta", prazo: "até 30/09" },
      { numero: "#1035", categoria: "Consultivo", titulo: "Parecer sobre LGPD em campanha", prioridade: "Média", prazo: "até 03/10" },
    ],
  },
  {
    titulo: "Em andamento",
    cards: [
      { numero: "#1029", categoria: "Contencioso", titulo: "Defesa em ação trabalhista nº 0021", prioridade: "Crítica", prazo: "vence em 2d", urgente: true },
      { numero: "#1024", categoria: "Cobrança", titulo: "Cobrança extrajudicial cliente ABC", prioridade: "Baixa", prazo: "até 10/10" },
      { numero: "#1018", categoria: "Regulatório", titulo: "Adequação a nova norma setorial", prioridade: "Média", prazo: "até 15/10" },
    ],
  },
  {
    titulo: "Aguardando terceiro",
    cards: [
      {
        numero: "#1011",
        categoria: "Societário",
        titulo: "Alteração contratual — registro na Junta",
        prioridade: "Média",
        prazo: "pausado",
        pausado: "SLA pausado — aguardando Junta",
      },
    ],
  },
  {
    titulo: "Concluídas (7d)",
    cards: [
      { numero: "#1005", categoria: "Contratos", titulo: "NDA com novo fornecedor" },
      { numero: "#0998", categoria: "Trabalhista", titulo: "Revisão de política de férias" },
    ],
  },
];

export const categoriaBreakdown = [
  { label: "Contratos", value: 18, pct: 78 },
  { label: "Consultivo", value: 12, pct: 52 },
  { label: "Contencioso", value: 9, pct: 38 },
  { label: "Trabalhista", value: 7, pct: 30 },
  { label: "Outros", value: 4, pct: 18 },
];

export const cargaResponsavel = [
  { nome: "Beatriz Nunes", iniciais: "BN", cor: "#17968f", total: 9 },
  { nome: "Carlos Meireles", iniciais: "CM", cor: "#6fa8f5", total: 7 },
  { nome: "Débora Assis", iniciais: "DA", cor: "#f0b429", total: 11 },
  { nome: "Felipe Ortiz", iniciais: "FO", cor: "#e8536b", total: 5 },
];

export const vencimentos = [
  { numero: "#1029", titulo: "Defesa em ação trabalhista nº 0021", responsavel: "Beatriz Nunes", situacao: "Vencida" },
  { numero: "#1041", titulo: "Notificação extrajudicial recebida", responsavel: "— não atribuída —", situacao: "90% do prazo" },
];

export const categoriasDemanda = [
  "Contratos",
  "Consultivo",
  "Contencioso",
  "Trabalhista",
  "Regulatório",
  "Societário",
  "Cobrança",
  "Notificações",
  "Procurações",
  "Consumidor/PROCON",
  "Outros",
];
