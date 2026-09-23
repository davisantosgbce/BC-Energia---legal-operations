import Layout from "../components/Layout.jsx";
import { StatusDot } from "../components/Kpi.jsx";
import { IconPause } from "../components/icons.jsx";
import { kanbanColunas, priorityColor } from "../data/mock.js";

export default function Painel() {
  return (
    <Layout profile="juridico" user={{ nome: "Beatriz Nunes", cargo: "Advogada", iniciais: "BN" }} topbarPlaceholder="Buscar nas minhas demandas...">
      <div className="flex items-baseline justify-between mb-[18px]">
        <h1 className="m-0 text-[21px] text-white font-semibold">Minhas demandas</h1>
        <div className="flex gap-1 bg-field border border-borderStrong p-[3px] rounded-lg">
          <div className="px-3.5 py-1.5 rounded-md bg-brand-teal text-[#06120e] text-[11.5px] font-bold">Kanban</div>
          <div className="px-3.5 py-1.5 rounded-md text-muted text-[11.5px]">Lista</div>
          <div className="px-3.5 py-1.5 rounded-md text-muted text-[11.5px]">Calendário</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5" style={{ height: 750 }}>
        {kanbanColunas.map((col) => (
          <div key={col.titulo} className="bg-[#10151c] border border-white/5 rounded-xl2 p-3 flex flex-col gap-2.5">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle px-1">
              {col.titulo} · {col.cards.length}
            </div>
            {col.cards.map((c) => (
              <div key={c.numero} className={`bg-[#181f29] rounded-[11px] p-3.5 border border-white/5 ${c.pausado ? "opacity-85" : ""}`}>
                <div className="text-[10.5px] text-subtle mb-1.5">
                  {c.numero} · {c.categoria}
                </div>
                <div className="font-semibold text-[12.5px] mb-2.5 text-white">{c.titulo}</div>
                {c.pausado && (
                  <div className="text-[10.5px] text-status-high bg-status-high/10 px-2 py-1.5 rounded-md mb-2 flex items-center gap-1.5">
                    <IconPause />
                    {c.pausado}
                  </div>
                )}
                {c.prioridade && (
                  <div className="flex justify-between items-center text-[11px]">
                    <StatusDot color={priorityColor[c.prioridade]}>{c.prioridade}</StatusDot>
                    <span className={c.urgente ? "text-status-critical font-semibold" : "text-subtle"}>{c.prazo}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}
