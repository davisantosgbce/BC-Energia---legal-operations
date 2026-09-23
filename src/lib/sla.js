// Cálculo de prazo de SLA em dias úteis (seg-sex, sem feriados por enquanto).

export function somarDiasUteis(dataBase, dias) {
  const data = new Date(dataBase);
  let restantes = dias;
  while (restantes > 0) {
    data.setDate(data.getDate() + 1);
    const diaSemana = data.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) restantes -= 1;
  }
  return data;
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

// Calcula a data final do SLA de uma demanda.
// `regra` vem de `sla_regras` (prazo_final_dias, unidade). Se a demanda tiver
// prazo legal informado e ele for mais curto que o SLA padrão, o prazo legal prevalece.
export function calcularPrazoFinalSla({ dataAbertura, regra, temPrazoLegal, dataPrazoLegal }) {
  const base = dataAbertura ? new Date(dataAbertura) : new Date();
  const prazoSlaPadrao = regra ? somarDiasUteis(base, regra.prazo_final_dias) : null;

  if (temPrazoLegal && dataPrazoLegal) {
    const prazoLegal = new Date(dataPrazoLegal);
    if (!prazoSlaPadrao || prazoLegal < prazoSlaPadrao) {
      return toISODate(prazoLegal);
    }
  }

  return prazoSlaPadrao ? toISODate(prazoSlaPadrao) : null;
}

export function diasRestantes(dataPrazoFinalSla) {
  if (!dataPrazoFinalSla) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const prazo = new Date(dataPrazoFinalSla);
  prazo.setHours(0, 0, 0, 0);
  return Math.round((prazo - hoje) / (1000 * 60 * 60 * 24));
}

export function statusSla(dataPrazoFinalSla) {
  const dias = diasRestantes(dataPrazoFinalSla);
  if (dias === null) return null;
  if (dias < 0) return "vencido";
  return "dentro";
}
