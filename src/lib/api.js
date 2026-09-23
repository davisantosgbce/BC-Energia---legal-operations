import { supabase } from "./supabaseClient.js";
import { prioridadeDbParaLabel, prioridadeLabelParaDb, statusDbParaLabel } from "./enumMaps.js";
import { calcularPrazoFinalSla } from "./sla.js";

// ---- Usuário de teste (substituir quando o login for implementado) ----
// Estes e-mails foram semeados na tabela `usuarios` para permitir testar o
// fluxo completo (abrir demanda, ver na triagem, ver no dashboard) antes de
// termos autenticação de verdade.
export const USUARIO_TESTE_SOLICITANTE_EMAIL = "usuario.teste@grupobcenergia.com.br";
export const USUARIO_TESTE_JURIDICO_EMAIL = "diego.montoanelli@grupobcenergia.com.br";

export async function getUsuarioAtualDeTeste() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, perfil, area")
    .eq("email", USUARIO_TESTE_SOLICITANTE_EMAIL)
    .single();
  if (error) throw error;
  return data;
}

// Usuário jurídico "logado" por enquanto (antes do Supabase Auth existir).
export async function getUsuarioAtualJuridicoDeTeste() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, perfil, area")
    .eq("email", USUARIO_TESTE_JURIDICO_EMAIL)
    .single();
  if (error) throw error;
  return data;
}

// ---- Usuários do Jurídico (advogados + gestor) para o dropdown de responsável ----
export async function getUsuariosJuridico() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, perfil, area")
    .in("perfil", ["juridico", "gestor"])
    .eq("area", "Jurídico")
    .eq("ativo", true)
    .order("nome");
  if (error) throw error;
  return data;
}

// ---- Categorias ----
export async function getCategorias() {
  const { data, error } = await supabase.from("categorias").select("id, nome").order("nome");
  if (error) throw error;
  return data;
}

// ---- Empresas do grupo ----
export async function getEmpresas() {
  const { data, error } = await supabase.from("empresas_grupo").select("id, nome").order("nome");
  if (error) throw error;
  return data;
}

// ---- Criar nova demanda (Portal de solicitação) ----
export async function criarDemanda({
  titulo,
  descricao,
  categoriaId,
  empresaId,
  areaSolicitante,
  solicitanteId,
  prazoInformado,
  temPrazoLegal,
  tipoPrazoLegal,
  urgencia, // label: "Crítica" | "Alta" | "Média" | "Baixa"
}) {
  const { data, error } = await supabase
    .from("demandas")
    .insert({
      titulo,
      descricao,
      categoria_id: categoriaId,
      empresa_id: empresaId,
      area_solicitante: areaSolicitante,
      solicitante_id: solicitanteId,
      prazo_informado: prazoInformado || null,
      tem_prazo_legal: temPrazoLegal,
      tipo_prazo_legal: tipoPrazoLegal || null,
      prioridade: prioridadeLabelParaDb[urgencia] || "media",
      status: "nova",
    })
    .select("id, numero")
    .single();
  if (error) throw error;

  // Registra o evento inicial no histórico de status, para auditoria.
  await supabase.from("status_historico").insert({
    demanda_id: data.id,
    status_anterior: null,
    status_novo: "nova",
    usuario_id: solicitanteId,
    motivo: "Demanda criada pelo solicitante",
  });

  return data;
}

// ---- Fila de triagem: demandas novas ou em triagem ----
export async function getDemandasParaTriagem() {
  const { data, error } = await supabase
    .from("demandas")
    .select(
      `id, numero, titulo, area_solicitante, prioridade, status, prazo_informado, data_abertura,
       categorias ( nome ),
       solicitante:usuarios!demandas_solicitante_id_fkey ( nome )`
    )
    .in("status", ["nova", "em_triagem"])
    .order("data_abertura", { ascending: false });
  if (error) throw error;

  return data.map((d) => ({
    id: d.id,
    numero: `#${String(d.numero).padStart(4, "0")}`,
    titulo: d.titulo,
    area: d.area_solicitante,
    solicitante: d.solicitante?.nome ?? "—",
    categoria: d.categorias?.nome ?? "—",
    prioridade: prioridadeDbParaLabel[d.prioridade] ?? d.prioridade,
    status: statusDbParaLabel[d.status] ?? d.status,
    prazo: d.prazo_informado,
  }));
}

// ---- Dashboard gerencial: indicadores agregados ----
export async function getDashboardStats() {
  const { count: abertas } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .not("status", "in", "(concluida,cancelada)");

  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
  const isoTrintaDias = trintaDiasAtras.toISOString();

  const { count: recebidas30d } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .gte("data_abertura", isoTrintaDias);

  const { count: concluidas30d } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("status", "concluida")
    .gte("data_conclusao", isoTrintaDias);

  const { data: porCategoriaRaw } = await supabase
    .from("demandas")
    .select("categorias ( nome )")
    .not("status", "in", "(concluida,cancelada)");

  const contagemPorCategoria = {};
  (porCategoriaRaw ?? []).forEach((d) => {
    const nome = d.categorias?.nome ?? "Sem categoria";
    contagemPorCategoria[nome] = (contagemPorCategoria[nome] || 0) + 1;
  });
  const maiorCategoria = Math.max(1, ...Object.values(contagemPorCategoria));
  const categoriaBreakdown = Object.entries(contagemPorCategoria)
    .map(([label, value]) => ({ label, value, pct: Math.round((value / maiorCategoria) * 100) }))
    .sort((a, b) => b.value - a.value);

  const { data: abertasComSla } = await supabase
    .from("demandas")
    .select("data_prazo_final_sla")
    .not("status", "in", "(concluida,cancelada)")
    .not("data_prazo_final_sla", "is", null);

  const hojeISO = new Date().toISOString().slice(0, 10);
  let dentroDoSla = 0;
  let slaVencido = 0;
  (abertasComSla ?? []).forEach((d) => {
    if (d.data_prazo_final_sla < hojeISO) slaVencido += 1;
    else dentroDoSla += 1;
  });

  return {
    abertas: abertas ?? 0,
    recebidas30d: recebidas30d ?? 0,
    concluidas30d: concluidas30d ?? 0,
    categoriaBreakdown,
    dentroDoSla,
    slaVencido,
  };
}

// ---- Detalhe da demanda ----
const DEMANDA_DETALHE_SELECT = `id, numero, titulo, descricao, area_solicitante, prioridade, status,
   data_abertura, prazo_informado, tem_prazo_legal, tipo_prazo_legal, data_prazo_legal, data_prazo_final_sla,
   responsavel_id, categoria_id,
   categorias ( id, nome ),
   empresas_grupo ( nome ),
   solicitante:usuarios!demandas_solicitante_id_fkey ( id, nome, area ),
   responsavel:usuarios!demandas_responsavel_id_fkey ( id, nome )`;

export async function getDemandaDetalhe(id) {
  const { data: demanda, error } = await supabase.from("demandas").select(DEMANDA_DETALHE_SELECT).eq("id", id).single();
  if (error) throw error;

  const { data: comentarios, error: erroComentarios } = await supabase
    .from("comentarios")
    .select("id, texto, data_hora, autor:usuarios!comentarios_autor_id_fkey ( id, nome )")
    .eq("demanda_id", id)
    .order("data_hora", { ascending: true });
  if (erroComentarios) throw erroComentarios;

  const { data: anexos, error: erroAnexos } = await supabase
    .from("anexos")
    .select("id, nome_arquivo, storage_path, tamanho_bytes, data_hora, enviado_por:usuarios!anexos_enviado_por_fkey ( nome )")
    .eq("demanda_id", id)
    .order("data_hora", { ascending: true });
  if (erroAnexos) throw erroAnexos;

  const { data: statusHistorico, error: erroStatusHist } = await supabase
    .from("status_historico")
    .select("id, status_anterior, status_novo, motivo, data_hora, usuario:usuarios!status_historico_usuario_id_fkey ( nome )")
    .eq("demanda_id", id)
    .order("data_hora", { ascending: true });
  if (erroStatusHist) throw erroStatusHist;

  return {
    id: demanda.id,
    numero: `#${String(demanda.numero).padStart(4, "0")}`,
    titulo: demanda.titulo,
    descricao: demanda.descricao,
    area: demanda.area_solicitante,
    categoriaId: demanda.categoria_id,
    categoria: demanda.categorias?.nome ?? "—",
    empresa: demanda.empresas_grupo?.nome ?? "—",
    solicitante: demanda.solicitante,
    responsavelId: demanda.responsavel_id,
    responsavel: demanda.responsavel,
    prioridade: prioridadeDbParaLabel[demanda.prioridade] ?? demanda.prioridade,
    status: statusDbParaLabel[demanda.status] ?? demanda.status,
    statusDb: demanda.status,
    dataAbertura: demanda.data_abertura,
    prazoInformado: demanda.prazo_informado,
    temPrazoLegal: demanda.tem_prazo_legal,
    tipoPrazoLegal: demanda.tipo_prazo_legal,
    dataPrazoLegal: demanda.data_prazo_legal,
    dataPrazoFinalSla: demanda.data_prazo_final_sla,
    comentarios: (comentarios ?? []).map((c) => ({
      id: c.id,
      texto: c.texto,
      dataHora: c.data_hora,
      autor: c.autor?.nome ?? "—",
    })),
    anexos: (anexos ?? []).map((a) => ({
      id: a.id,
      nomeArquivo: a.nome_arquivo,
      storagePath: a.storage_path,
      tamanhoBytes: a.tamanho_bytes,
      dataHora: a.data_hora,
      enviadoPor: a.enviado_por?.nome ?? "—",
    })),
    statusHistorico: (statusHistorico ?? []).map((h) => ({
      id: h.id,
      statusAnterior: h.status_anterior ? statusDbParaLabel[h.status_anterior] : null,
      statusNovo: statusDbParaLabel[h.status_novo] ?? h.status_novo,
      motivo: h.motivo,
      dataHora: h.data_hora,
      usuario: h.usuario?.nome ?? "—",
    })),
  };
}

// ---- Adicionar comentário real na demanda ----
export async function adicionarComentario({ demandaId, autorId, texto }) {
  const { data, error } = await supabase
    .from("comentarios")
    .insert({ demanda_id: demandaId, autor_id: autorId, texto })
    .select("id, texto, data_hora, autor:usuarios!comentarios_autor_id_fkey ( nome )")
    .single();
  if (error) throw error;
  return { id: data.id, texto: data.texto, dataHora: data.data_hora, autor: data.autor?.nome ?? "—" };
}

// ---- Confirmar triagem: prioridade, status, responsável + SLA + histórico ----
export async function confirmarTriagem({ demandaId, prioridadeLabel, responsavelId, usuarioId }) {
  const { data: demandaAtual, error: erroDemanda } = await supabase
    .from("demandas")
    .select("prioridade, status, responsavel_id, categoria_id, data_abertura, tem_prazo_legal, data_prazo_legal")
    .eq("id", demandaId)
    .single();
  if (erroDemanda) throw erroDemanda;

  const novaPrioridadeDb = prioridadeLabelParaDb[prioridadeLabel] || demandaAtual.prioridade;

  const { data: regrasSla, error: erroSla } = await supabase
    .from("sla_regras")
    .select("categoria_id, prazo_final_dias")
    .eq("prioridade", novaPrioridadeDb);
  if (erroSla) throw erroSla;

  const regra =
    (regrasSla ?? []).find((r) => r.categoria_id === demandaAtual.categoria_id) ??
    (regrasSla ?? []).find((r) => r.categoria_id === null) ??
    null;

  const dataPrazoFinalSla = calcularPrazoFinalSla({
    dataAbertura: demandaAtual.data_abertura,
    regra,
    temPrazoLegal: demandaAtual.tem_prazo_legal,
    dataPrazoLegal: demandaAtual.data_prazo_legal,
  });

  const { error: erroUpdate } = await supabase
    .from("demandas")
    .update({
      prioridade: novaPrioridadeDb,
      status: "atribuida",
      responsavel_id: responsavelId,
      data_prazo_final_sla: dataPrazoFinalSla,
    })
    .eq("id", demandaId);
  if (erroUpdate) throw erroUpdate;

  const eventos = [];

  if (demandaAtual.status !== "atribuida") {
    eventos.push(
      supabase.from("status_historico").insert({
        demanda_id: demandaId,
        status_anterior: demandaAtual.status,
        status_novo: "atribuida",
        usuario_id: usuarioId,
        motivo: "Triagem confirmada",
      })
    );
  }

  if (demandaAtual.prioridade !== novaPrioridadeDb) {
    eventos.push(
      supabase.from("prioridade_historico").insert({
        demanda_id: demandaId,
        prioridade_anterior: demandaAtual.prioridade,
        prioridade_nova: novaPrioridadeDb,
        usuario_id: usuarioId,
      })
    );
  }

  if (demandaAtual.responsavel_id !== responsavelId) {
    eventos.push(
      supabase.from("responsavel_historico").insert({
        demanda_id: demandaId,
        responsavel_anterior_id: demandaAtual.responsavel_id,
        responsavel_novo_id: responsavelId,
        usuario_id: usuarioId,
      })
    );
  }

  const resultados = await Promise.all(eventos);
  const erroHistorico = resultados.find((r) => r.error)?.error;
  if (erroHistorico) throw erroHistorico;

  return { dataPrazoFinalSla };
}

// ---- Painel Kanban: demandas atribuídas a um responsável, agrupadas por status ----
export async function getDemandasDoResponsavel(responsavelId) {
  const { data, error } = await supabase
    .from("demandas")
    .select(
      `id, numero, titulo, prioridade, status, data_prazo_final_sla,
       categorias ( nome )`
    )
    .eq("responsavel_id", responsavelId)
    .not("status", "in", "(cancelada)")
    .order("data_abertura", { ascending: false });
  if (error) throw error;

  return data.map((d) => ({
    id: d.id,
    numero: `#${String(d.numero).padStart(4, "0")}`,
    titulo: d.titulo,
    categoria: d.categorias?.nome ?? "—",
    prioridade: prioridadeDbParaLabel[d.prioridade] ?? d.prioridade,
    status: d.status,
    dataPrazoFinalSla: d.data_prazo_final_sla,
  }));
}

// ---- KPIs de Início — Solicitante ----
export async function getKpisSolicitante(solicitanteId) {
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
  const isoTrintaDias = trintaDiasAtras.toISOString();

  const { count: total } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("solicitante_id", solicitanteId);

  const { count: emAndamento } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("solicitante_id", solicitanteId)
    .in("status", ["em_triagem", "atribuida", "em_andamento", "aguardando_terceiro", "em_revisao"]);

  const { count: aguardandoVoce } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("solicitante_id", solicitanteId)
    .eq("status", "aguardando_solicitante");

  const { count: concluidas30d } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("solicitante_id", solicitanteId)
    .eq("status", "concluida")
    .gte("data_conclusao", isoTrintaDias);

  return {
    total: total ?? 0,
    emAndamento: emAndamento ?? 0,
    aguardandoVoce: aguardandoVoce ?? 0,
    concluidas30d: concluidas30d ?? 0,
  };
}

// ---- KPIs de Início — Jurídico ----
export async function getKpisJuridico(responsavelId) {
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
  const isoSeteDias = seteDiasAtras.toISOString();

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const isoAmanha = amanha.toISOString().slice(0, 10);

  const { count: ativas } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("responsavel_id", responsavelId)
    .not("status", "in", "(concluida,cancelada)");

  const { count: vencemHojeAmanha } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("responsavel_id", responsavelId)
    .not("status", "in", "(concluida,cancelada)")
    .lte("data_prazo_final_sla", isoAmanha);

  const { count: aguardandoTerceiros } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("responsavel_id", responsavelId)
    .eq("status", "aguardando_terceiro");

  const { count: concluidas7d } = await supabase
    .from("demandas")
    .select("id", { count: "exact", head: true })
    .eq("responsavel_id", responsavelId)
    .eq("status", "concluida")
    .gte("data_conclusao", isoSeteDias);

  return {
    ativas: ativas ?? 0,
    vencemHojeAmanha: vencemHojeAmanha ?? 0,
    aguardandoTerceiros: aguardandoTerceiros ?? 0,
    concluidas7d: concluidas7d ?? 0,
  };
}
