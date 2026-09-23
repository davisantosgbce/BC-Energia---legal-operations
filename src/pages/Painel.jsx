import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { StatusDot } from "../components/Kpi.jsx";
import { getDemandasDoResponsavel, getUsuariosJuridico } from "../lib/api.js";
import { prioridadeCor } from "../lib/enumMaps.js";
import { diasRestantes } from "../lib/sla.js";

const COLUNAS = [
  { titulo: "Novas", statuses: ["nova", "em_triagem", "atribuida"] },
  { titulo: "Em andamento", statuses: ["em_andamento", "em_revisao"] },
  { titulo: "Aguardando terceiro", statuses: ["aguardando_solicitante", "aguardando_terceiro"] },
  { titulo: "Concluídas", statuses: ["concluida"] },
];

function formatarPrazo(dataPrazoFinalSla) {
  if (!dataPrazoFinalSla) return "—";
  const dias = diasRestantes(dataPrazoFinalSla);
  if (dias < 0) return `Vencido há ${Math.abs(dias)}d`;
  if (dias === 0) return "Vence hoje";
  return `Vence em ${dias}d`;
}

export default function Painel() {
  const [usuarios, setUsuarios] = useState([]);
  const [responsavelId, setResponsavelId] = useState("");
  const [demandas, setDemandas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getUsuariosJuridico()
      .then((lista) => {
        setUsuarios(lista);
        if (lista.length > 0) setResponsavelId(lista[0].id);
      })
      .catch((e) => setErro(e.message));
  }, []);

  useEffect(() => {
    if (!responsavelId) return;
    setCarregando(true);
    getDemandasDoResponsavel(responsavelId)
      .then(setDemandas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [responsavelId]);

  const usuarioAtual = usuarios.find((u) => u.id === responsavelId);

  return (
    <Layout
      profile="juridico"
      user={{ nome: usuarioAtual?.nome ?? "—", cargo: usuarioAtual?.perfil === "gestor" ? "Gestor" : "Advogado(a)", iniciais: "" }}
      topbarPlaceholder="Buscar nas minhas demandas..."
    >
      <div className="flex items-baseline justify-between mb-[18px]">
        <h1 className="m-0 text-[21px] text-white font-semibold">Minhas demandas</h1>
        <select className="field !w-auto" value={responsavelId} onChange={(e) => setResponsavelId(e.target.value)}>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
      </div>

      {erro && (
        <div className="mb-4 text-[13px] text-status-critical bg-status-critical/10 border border-status-critical/30 rounded-lg px-4 py-3">
          Não foi possível carregar o painel: {erro}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3.5" style={{ minHeight: 750 }}>
        {COLUNAS.map((col) => {
          const cards = demandas.filter((d) => col.statuses.includes(d.status));
          return (
            <div key={col.titulo} className="bg-[#10151c] border border-white/5 rounded-xl2 p-3 flex flex-col gap-2.5">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle px-1">
                {col.titulo} · {cards.length}
              </div>
              {carregando && <div className="text-xs text-subtle px-1">Carregando...</div>}
              {!carregando && cards.length === 0 && <div className="text-xs text-subtle px-1">Nenhuma demanda.</div>}
              {cards.map((c) => {
                const dias = diasRestantes(c.dataPrazoFinalSla);
                const urgente = dias !== null && dias <= 2;
                return (
                  <div key={c.id} className="bg-[#181f29] rounded-[11px] p-3.5 border border-white/5">
                    <div className="text-[10.5px] text-subtle mb-1.5">
                      {c.numero} · {c.categoria}
                    </div>
                    <div className="font-semibold text-[12.5px] mb-2.5 text-white">{c.titulo}</div>
                    <div className="flex justify-between items-center text-[11px]">
                      <StatusDot color={prioridadeCor[c.prioridade] ?? "#6fa8f5"}>{c.prioridade}</StatusDot>
                      <span className={urgente ? "text-status-critical font-semibold" : "text-subtle"}>{formatarPrazo(c.dataPrazoFinalSla)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
