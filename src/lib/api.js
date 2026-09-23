import { supabase } from "./supabaseClient.js";
import { prioridadeDbParaLabel, prioridadeLabelParaDb, statusDbParaLabel } from "./enumMaps.js";

// ---- Usuário de teste (substituir quando o login for implementado) ----
// Estes e-mails foram semeados na tabela `usuarios` para permitir testar o
// fluxo completo (abrir demanda, ver na triagem, ver no dashboard) antes de
// termos autenticação de verdade.
export const USUARIO_TESTE_SOLICITANTE_EMAIL = "ana.ribeiro@grupobcenergia.com.br";

export async function getUsuarioAtualDeTeste() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, perfil, area")
    .eq("email", USUARIO_TESTE_SOLICITANTE_EMAIL)
    .single();
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

  return {
    abertas: abertas ?? 0,
    recebidas30d: recebidas30d ?? 0,
    concluidas30d: concluidas30d ?? 0,
    categoriaBreakdown,
  };
}
