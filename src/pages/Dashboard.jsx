import Layout from "../components/Layout.jsx";
import { KpiCard, StatusDot } from "../components/Kpi.jsx";
import { IconDoc, IconClock, IconCheck, IconWarning } from "../components/icons.jsx";
import { categoriaBreakdown, cargaResponsavel, vencimentos } from "../data/mock.js";

function IconSlaClock(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="#3ecbc0" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 3.5a6.5 6.5 0 1 0 6.5 6.5" />
      <path d="M10 3.5v6.5h6.5" />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <Layout profile="juridico" user={{ nome: "Marcos Vidal", cargo: "Gestor", iniciais: "MV" }} topbarPlaceholder="Buscar demandas, solicitantes...">
      <div className="flex items-baseline justify-between mb-[22px]">
        <h1 className="m-0 text-[21px] text-white font-semibold">Dashboard gerencial</h1>
        <div className="flex gap-2">
          {["Últimos 30 dias", "Todas categorias", "Todos responsáveis"].map((label) => (
            <select key={label} className="text-xs bg-field border border-borderStrong rounded-lg px-3 py-2.5 text-ink">
              <option>{label}</option>
            </select>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3.5 mb-[18px]">
        <KpiCard icon={IconDoc} iconColor="#6fa8f5" value={42} label="Demandas abertas" />
        <KpiCard icon={IconClock} iconColor="#3ecbc0" value={67} label="Recebidas (30d)" />
        <KpiCard icon={IconCheck} iconColor="#3ecbc0" value={58} label="Concluídas (30d)" />
        <KpiCard icon={IconSlaClock} iconColor="#3ecbc0" value="84%" valueColor="#3ecbc0" label="Dentro do SLA" />
        <KpiCard icon={IconWarning} iconColor="#e8536b" value={6} valueColor="#e8536b" label="SLA vencido" />
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-3.5 mb-3.5">
        <div className="card p-5">
          <div className="text-[13px] font-bold text-white mb-4">Demandas por categoria</div>
          <div className="flex flex-col gap-2.5">
            {categoriaBreakdown.map((c) => (
              <div key={c.label} className="flex items-center gap-2.5 text-[11.5px]">
                <div className="w-[84px] text-muted">{c.label}</div>
                <div className="flex-grow bg-[#1c232c] rounded-md h-2.5">
                  <div className="h-full bg-brand-teal rounded-md" style={{ width: `${c.pct}%` }} />
                </div>
                <div className="w-5 text-right text-[#c3c9d1]">{c.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-[13px] font-bold text-white mb-4">Carga por responsável</div>
          <div className="flex flex-col gap-3.5 text-xs">
            {cargaResponsavel.map((r) => (
              <div key={r.nome} className="flex justify-between text-[#c3c9d1]">
                <span className="flex items-center gap-2">
                  <span
                    className="w-[22px] h-[22px] rounded-full text-[9.5px] font-bold flex items-center justify-center text-[#06120e]"
                    style={{ backgroundColor: r.cor }}
                  >
                    {r.iniciais}
                  </span>
                  {r.nome}
                </span>
                <strong className="text-white">{r.total}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-[13px] font-bold text-white mb-3">Próximas do vencimento e vencidas</div>
        <div className="grid grid-cols-[80px_1.6fr_1fr_130px] py-2 text-[10.5px] font-bold uppercase tracking-wider text-subtle border-b border-border">
          <div>Nº</div>
          <div>Demanda</div>
          <div>Responsável</div>
          <div>Situação</div>
        </div>
        {vencimentos.map((v, i) => (
          <div
            key={v.numero}
            className={`grid grid-cols-[80px_1.6fr_1fr_130px] py-2.5 text-[12.5px] items-center text-[#dfe3e8] ${
              i < vencimentos.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="text-subtle">{v.numero}</div>
            <div>{v.titulo}</div>
            <div>{v.responsavel}</div>
            <StatusDot color={v.situacao === "Vencida" ? "#e8536b" : "#f0b429"}>{v.situacao}</StatusDot>
          </div>
        ))}
      </div>
    </Layout>
  );
}
