import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { StatusDot } from "../components/Kpi.jsx";
import { IconArrowLeft, IconFile } from "../components/icons.jsx";
import {
  adicionarComentario,
  confirmarTriagem,
  getDemandaDetalhe,
  getUsuarioAtualJuridicoDeTeste,
  getUsuariosJuridico,
} from "../lib/api.js";
import { prioridadeCor } from "../lib/enumMaps.js";

function formatarDataHora(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function iniciais(nome) {
  if (!nome) return "—";
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function DetalheDemanda() {
  const { id } = useParams();
  const [demanda, setDemanda] = useState(null);
  const [usuariosJuridico, setUsuariosJuridico] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [prioridade, setPrioridade] = useState("");
  const [responsavelId, setResponsavelId] = useState("");
  const [comentario, setComentario] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    Promise.all([getDemandaDetalhe(id), getUsuariosJuridico(), getUsuarioAtualJuridicoDeTeste()])
      .then(([demandaData, usuarios, atual]) => {
        if (!ativo) return;
        setDemanda(demandaData);
        setUsuariosJuridico(usuarios);
        setUsuarioAtual(atual);
        setPrioridade(demandaData.prioridade);
        setResponsavelId(demandaData.responsavelId ?? "");
      })
      .catch((e) => ativo && setErro(e.message))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [id]);

  async function handleConfirmarTriagem() {
    if (!responsavelId) {
      setMensagem({ tipo: "erro", texto: "Selecione um responsável antes de confirmar." });
      return;
    }
    setSalvando(true);
    setMensagem(null);
    try {
      await confirmarTriagem({
        demandaId: id,
        prioridadeLabel: prioridade,
        responsavelId,
        usuarioId: usuarioAtual?.id,
      });
      const atualizada = await getDemandaDetalhe(id);
      setDemanda(atualizada);
      setPrioridade(atualizada.prioridade);
      setResponsavelId(atualizada.responsavelId ?? "");
      setMensagem({ tipo: "sucesso", texto: "Triagem confirmada e demanda atribuída." });
    } catch (e) {
      setMensagem({ tipo: "erro", texto: e.message });
    } finally {
      setSalvando(false);
    }
  }

  async function handleEnviarComentario() {
    if (!comentario.trim() || !usuarioAtual) return;
    setEnviandoComentario(true);
    try {
      const novo = await adicionarComentario({ demandaId: id, autorId: usuarioAtual.id, texto: comentario.trim() });
      setDemanda((atual) => ({ ...atual, comentarios: [...atual.comentarios, novo] }));
      setComentario("");
    } catch (e) {
      setMensagem({ tipo: "erro", texto: e.message });
    } finally {
      setEnviandoComentario(false);
    }
  }

  if (carregando) {
    return (
      <Layout profile="juridico" user={{ nome: "Diego Montoanelli", cargo: "Gestor", iniciais: "DM" }}>
        <div className="text-sm text-subtle">Carregando demanda...</div>
      </Layout>
    );
  }

  if (erro || !demanda) {
    return (
      <Layout profile="juridico" user={{ nome: "Diego Montoanelli", cargo: "Gestor", iniciais: "DM" }}>
        <div className="text-[13px] text-status-critical bg-status-critical/10 border border-status-critical/30 rounded-lg px-4 py-3">
          Não foi possível carregar a demanda: {erro ?? "não encontrada"}
        </div>
      </Layout>
    );
  }

  return (
    <Layout profile="juridico" user={{ nome: "Diego Montoanelli", cargo: "Gestor", iniciais: "DM" }} topbarPlaceholder="Buscar demandas...">
      <div className="flex gap-6">
        <div className="flex-grow max-w-[720px]">
          <Link to="/triagem" className="text-xs text-subtle inline-flex items-center gap-1.5">
            <IconArrowLeft />
            Voltar para triagem
          </Link>

          <div className="flex justify-between items-start mt-3 mb-1">
            <h1 className="m-0 text-[19px] text-white font-semibold">
              {demanda.numero} — {demanda.titulo}
            </h1>
            <div className="pt-0.5 shrink-0">
              <StatusDot color={prioridadeCor[demanda.prioridade] ?? "#6fa8f5"}>{demanda.status}</StatusDot>
            </div>
          </div>
          <div className="text-xs text-subtle mb-[22px]">
            Aberta em {formatarDataHora(demanda.dataAbertura)} por {demanda.solicitante?.nome ?? "—"} · {demanda.area}
          </div>

          <div className="card p-[18px] mb-3.5">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-2.5">Descrição da solicitação</div>
            <p className="m-0 text-[13px] leading-relaxed text-[#dfe3e8] whitespace-pre-wrap">{demanda.descricao || "Sem descrição informada."}</p>
          </div>

          <div className="card p-[18px] mb-3.5">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-3">Documentos anexados</div>
            <div className="flex flex-col gap-2.5 text-[12.5px]">
              {demanda.anexos.length === 0 && <div className="text-subtle">Nenhum anexo enviado.</div>}
              {demanda.anexos.map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 text-[#dfe3e8]">
                  <IconFile className="w-3.5 h-3.5" stroke="#3ecbc0" />
                  {a.nomeArquivo}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-[18px]">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-3.5">Comentários e histórico</div>
            <div className="flex flex-col gap-3 mb-4">
              {demanda.statusHistorico.map((h) => (
                <div key={h.id} className="text-[11.5px] text-subtle">
                  {h.statusAnterior ? `Status alterado de ${h.statusAnterior} para ${h.statusNovo}` : `Demanda criada (${h.statusNovo})`} por{" "}
                  {h.usuario} em {formatarDataHora(h.dataHora)}
                  {h.motivo ? ` — ${h.motivo}` : ""}.
                </div>
              ))}
              {demanda.comentarios.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-[26px] h-[26px] rounded-full bg-brand-teal text-[#06120e] text-[10.5px] font-bold flex items-center justify-center shrink-0">
                    {iniciais(c.autor)}
                  </div>
                  <div className="bg-field rounded-lg px-3.5 py-2.5 text-[12.5px] text-[#dfe3e8]">
                    <div className="text-subtle text-[10.5px] mb-1">
                      {c.autor} · {formatarDataHora(c.dataHora)}
                    </div>
                    {c.texto}
                  </div>
                </div>
              ))}
            </div>
            <label className="field-label" htmlFor="comentario">
              Adicionar comentário
            </label>
            <textarea
              id="comentario"
              rows={2}
              placeholder="Escreva um comentário ou @mencione alguém..."
              className="field resize-y"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary mt-2.5 !px-3.5 !py-1.5 !text-xs"
              disabled={enviandoComentario || !comentario.trim()}
              onClick={handleEnviarComentario}
            >
              {enviandoComentario ? "Enviando..." : "Comentar"}
            </button>
          </div>
        </div>

        <div className="w-[280px] shrink-0">
          <div className="card p-[18px] sticky top-0">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-3.5">Triagem</div>

            {mensagem && (
              <div
                className={`text-[11.5px] rounded-lg px-2.5 py-2 mb-3 ${
                  mensagem.tipo === "erro"
                    ? "text-status-critical bg-status-critical/10 border border-status-critical/30"
                    : "text-brand-tealLight bg-brand-teal/10 border border-brand-teal/30"
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            <label className="field-label" htmlFor="prioridade">
              Prioridade
            </label>
            <select id="prioridade" className="field mb-3.5" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
              <option>Crítica</option>
              <option>Alta</option>
              <option>Média</option>
              <option>Baixa</option>
            </select>

            <div className="field-label">SLA</div>
            <div className="text-xs bg-field rounded-lg px-2.5 py-2.5 mb-3.5 text-[#dfe3e8] leading-relaxed">
              {demanda.temPrazoLegal ? (
                <>
                  Prazo legal: <strong className="text-white">{demanda.tipoPrazoLegal || "informado"}</strong>
                  {demanda.dataPrazoLegal && (
                    <>
                      {" "}
                      até <strong className="text-white">{formatarData(demanda.dataPrazoLegal)}</strong>
                    </>
                  )}
                  <br />
                </>
              ) : null}
              Vencimento SLA:{" "}
              <strong className={demanda.dataPrazoFinalSla ? "text-status-critical" : "text-subtle"}>
                {demanda.dataPrazoFinalSla ? formatarData(demanda.dataPrazoFinalSla) : "a definir na triagem"}
              </strong>
            </div>

            <label className="field-label" htmlFor="responsavel">
              Responsável
            </label>
            <select id="responsavel" className="field mb-[18px]" value={responsavelId} onChange={(e) => setResponsavelId(e.target.value)}>
              <option value="">Selecionar advogado…</option>
              {usuariosJuridico.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                  {u.perfil === "gestor" ? " (gestor)" : ""}
                </option>
              ))}
            </select>

            <button type="button" className="btn-primary w-full justify-center mb-2" disabled={salvando} onClick={handleConfirmarTriagem}>
              {salvando ? "Salvando..." : "Confirmar triagem e atribuir"}
            </button>
            <button type="button" className="btn-secondary w-full justify-center">
              Solicitar complementação
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
