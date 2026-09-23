import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { KpiCard, StatusDot } from "../components/Kpi.jsx";
import { IconDoc, IconWarning, IconPause, IconCheck, IconFunnel, IconChart } from "../components/icons.jsx";
import { getKpisJuridico, getUsuarioAtualJuridicoDeTeste, getDemandasDoResponsavel } from "../lib/api.js";
import { prioridadeCor } from "../lib/enumMaps.js";
import { diasRestantes } from "../lib/sla.js";

export default function InicioJuridico() {
  const [kpis, setKpis] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [urgentes, setUrgentes] = useState([]);

  useEffect(() => {
    getUsuarioAtualJuridicoDeTeste().then((u) => {
      setUsuario(u);
      getKpisJuridico(u.id).then(setKpis);
      getDemandasDoResponsavel(u.id).then((lista) => {
        const ordenadas = lista
          .filter((d) => d.dataPrazoFinalSla && !["concluida", "cancelada"].includes(d.status))
          .sort((a, b) => new Date(a.dataPrazoFinalSla) - new Date(b.dataPrazoFinalSla))
          .slice(0, 3);
        setUrgentes(ordenadas);
      });
    });
  }, []);

  return (
    <Layout profile="juridico" user={{ nome: usuario?.nome ?? "—", cargo: usuario?.perfil === "gestor" ? "Gestor" : "Advogado(a)", iniciais: "" }} notifications={2}>
      <div className="mb-6">
        <h1 className="m-0 mb-1 text-[22px] text-white font-semibold">Bom dia, {usuario?.nome?.split(" ")[0] ?? ""}</h1>
        <p className="m-0 text-[13px] text-muted">Panorama das suas demandas e do que precisa de atenção hoje.</p>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-[18px]">
        <KpiCard icon={IconDoc} iconColor="#6fa8f5" value={kpis ? kpis.ativas : "–"} label="Demandas ativas" />
        <KpiCard icon={IconWarning} iconColor="#e8536b" value={kpis ? kpis.vencemHojeAmanha : "–"} label="Vencem hoje/amanhã" />
        <KpiCard icon={IconPause} iconColor="#f0b429" value={kpis ? kpis.aguardandoTerceiros : "–"} label="Aguardando terceiros" />
        <KpiCard icon={IconCheck} iconColor="#3ecbc0" value={kpis ? kpis.concluidas7d : "–"} label="Concluídas (7d)" />
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-[18px]">
        <Link to="/triagem" className="card p-[18px] flex items-center gap-3.5">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-status-critical/10 flex items-center justify-center shrink-0">
            <IconFunnel className="w-[18px] h-[18px]" stroke="#e8536b" />
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-white">Fila de triagem</div>
            <div className="text-xs text-muted">7 demandas novas aguardando</div>
          </div>
        </Link>
        <Link to="/dashboard" className="card p-[18px] flex items-center gap-3.5">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-brand-teal/10 flex items-center justify-center shrink-0">
            <IconChart className="w-[18px] h-[18px]" stroke="#3ecbc0" />
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-white">Dashboard do departamento</div>
            <div className="text-xs text-muted">84% das demandas dentro do SLA</div>
          </div>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-[13.5px] font-bold text-white">Suas demandas mais urgentes</div>
          <Link to="/painel" className="text-xs text-brand-tealLight font-semibold">
            Ver todas
          </Link>
        </div>
        {urgentes.length === 0 && <div className="px-5 py-6 text-sm text-subtle">Nenhuma demanda com prazo definido.</div>}
        {urgentes.map((u, i) => {
          const cor = prioridadeCor[u.prioridade] ?? "#6fa8f5";
          const dias = diasRestantes(u.dataPrazoFinalSla);
          const prazoLabel = dias < 0 ? `Vencido há ${Math.abs(dias)}d` : dias === 0 ? "Vence hoje" : `Vence em ${dias}d`;
          return (
            <div key={u.id} className={`flex items-center gap-3.5 px-5 py-3.5 ${i < urgentes.length - 1 ? "border-b border-white/5" : ""}`}>
              <div
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ backgroundColor: `${cor}24`, color: cor }}
              >
                {u.numero}
              </div>
              <div className="flex-grow">
                <div className="text-[13px] font-semibold text-white">{u.titulo}</div>
                <div className="text-[11.5px] text-subtle">{u.categoria}</div>
              </div>
              <StatusDot color={cor}>{prazoLabel}</StatusDot>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
