// O banco guarda status/prioridade em snake_case sem acento (enums do Postgres).
// Estes mapas traduzem para o que aparece na tela, e vice-versa.

export const prioridadeDbParaLabel = {
  critica: "Crítica",
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

export const prioridadeLabelParaDb = {
  Crítica: "critica",
  Alta: "alta",
  Média: "media",
  Baixa: "baixa",
};

export const statusDbParaLabel = {
  nova: "Nova",
  em_triagem: "Em triagem",
  atribuida: "Atribuída",
  em_andamento: "Em andamento",
  aguardando_solicitante: "Aguardando solicitante",
  aguardando_terceiro: "Aguardando terceiro",
  em_revisao: "Em revisão",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export const prioridadeCor = {
  Crítica: "#e8536b",
  Alta: "#f0b429",
  Média: "#6fa8f5",
  Baixa: "#3ecbc0",
};
