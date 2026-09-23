import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { KpiCard, StatusDot } from "../components/Kpi.jsx";
import { IconDoc, IconWarning, IconPause, IconCheck, IconFunnel, IconChart } from "../components/icons.jsx";

const urgentes = [
  { numero: "#29", titulo: "Defesa em ação trabalhista nº 0021", categoria: "Contencioso", cor: "#e8536b", prazo: "Vence em 2d" },
  { numero: "#38", titulo: "Aditivo contrato fornecedor XPTO", categoria: "Contratos", cor: "#f0b429", prazo: "Até 30/09" },
];

export default function InicioJuridico() {
  return (
    <Layout profile="juridico" user={{ nome: "Beatriz Nunes", cargo: "Advogada", iniciais: "BN" }} notifications={2}>
      <div className="mb-6">
        <h1 className="m-0 mb-1 text-[22px] text-white font-semibold">Bom dia, Beatriz</h1>
        <p className="m-0 text-[13px] text-muted">Panorama das suas demandas e do que precisa de atenção hoje.</p>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-[18px]">
        <KpiCard icon={IconDoc} iconColor="#6fa8f5" value={6} label="Demandas ativas" />
        <KpiCard icon={IconWarning} iconColor="#e8536b" value={2} label="Vencem hoje/amanhã" />
        <KpiCard icon={IconPause} iconColor="#f0b429" value={1} label="Aguardando terceiros" />
        <KpiCard icon={IconCheck} iconColor="#3ecbc0" value={4} label="Concluídas (7d)" />
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
        {urgentes.map((u, i) => (
          <div key={u.numero} className={`flex items-center gap-3.5 px-5 py-3.5 ${i < urgentes.length - 1 ? "border-b border-white/5" : ""}`}>
            <div
              className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ backgroundColor: `${u.cor}24`, color: u.cor }}
            >
              {u.numero}
            </div>
            <div className="flex-grow">
              <div className="text-[13px] font-semibold text-white">{u.titulo}</div>
              <div className="text-[11.5px] text-subtle">{u.categoria}</div>
            </div>
            <StatusDot color={u.cor}>{u.prazo}</StatusDot>
          </div>
        ))}
      </div>
    </Layout>
  );
}
