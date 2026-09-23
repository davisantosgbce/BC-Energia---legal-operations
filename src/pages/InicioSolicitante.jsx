import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { KpiCard, StatusDot } from "../components/Kpi.jsx";
import { IconDoc, IconClock, IconWarning, IconCheck, IconPlus } from "../components/icons.jsx";
import { minhasSolicitacoes, statusColor } from "../data/mock.js";

const donutSegments = [
  { color: "#6fa8f5", value: 4, dash: 43.4, offset: 0 },
  { color: "#f0b429", value: 1, dash: 10.8, offset: -43.4 },
  { color: "#3ecbc0", value: 3, dash: 32.6, offset: -54.2 },
];

export default function InicioSolicitante() {
  return (
    <Layout profile="solicitante" user={{ nome: "Ana Ribeiro", cargo: "Financeiro", iniciais: "AR" }}>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="m-0 mb-1 text-[23px] text-white font-semibold">Olá, Ana 👋</h1>
          <p className="m-0 text-[13px] text-muted">Aqui está o andamento das suas solicitações ao Jurídico.</p>
        </div>
        <Link to="/nova-solicitacao" className="btn-primary">
          <IconPlus />
          Nova solicitação
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <KpiCard icon={IconDoc} iconColor="#6fa8f5" value={9} label="Total de solicitações" />
        <KpiCard icon={IconClock} iconColor="#f0b429" value={4} label="Em andamento" />
        <KpiCard icon={IconWarning} iconColor="#e8536b" value={1} label="Aguardando você" />
        <KpiCard icon={IconCheck} iconColor="#3ecbc0" value={3} label="Concluídas (30d)" />
      </div>

      <div className="grid grid-cols-[1.7fr_1fr] gap-3.5">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="text-[13.5px] font-bold text-white">Solicitações recentes</div>
            <Link to="#" className="text-xs text-brand-tealLight font-semibold">
              Ver todas
            </Link>
          </div>
          <div className="flex flex-col">
            {minhasSolicitacoes.map((s, i) => (
              <div
                key={s.numero}
                className={`flex items-center gap-3.5 px-5 py-3.5 ${i < minhasSolicitacoes.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div
                  className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: `${statusColor[s.status]}24`, color: statusColor[s.status] }}
                >
                  {s.numero.replace("#10", "").replace("#", "")}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-[13px] font-semibold text-white truncate">{s.titulo}</div>
                  <div className="text-[11.5px] text-subtle">
                    {s.categoria} · {s.responsavel}
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusDot color={statusColor[s.status]}>{s.status}</StatusDot>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-[13.5px] font-bold text-white mb-[18px]">Status das solicitações</div>
          <div className="flex items-center gap-5">
            <svg width="112" height="112" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.5" fill="transparent" stroke="#1c2530" strokeWidth="6" />
              {donutSegments.map((seg) => (
                <circle
                  key={seg.color}
                  cx="21"
                  cy="21"
                  r="15.5"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="6"
                  strokeDasharray={`${seg.dash} 97.4`}
                  strokeDashoffset={seg.offset}
                  strokeLinecap="round"
                  transform="rotate(-90 21 21)"
                />
              ))}
              <text x="21" y="19" textAnchor="middle" fontFamily="Space Grotesk" fontSize="8" fontWeight="700" fill="#fff">
                9
              </text>
              <text x="21" y="27" textAnchor="middle" fontFamily="Work Sans" fontSize="4.2" fill="#5f6a78">
                total
              </text>
            </svg>
            <div className="flex flex-col gap-2.5 text-xs">
              <LegendItem color="#6fa8f5" label="Em andamento · 4" />
              <LegendItem color="#f0b429" label="Aguardando · 1" />
              <LegendItem color="#3ecbc0" label="Concluída · 3" />
              <LegendItem color="#1c2530" label="Cancelada · 1" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-[#c3c9d1]">
      <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}
