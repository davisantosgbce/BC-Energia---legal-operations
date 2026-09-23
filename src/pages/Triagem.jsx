import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { StatusDot } from "../components/Kpi.jsx";
import { filaTriagem, priorityColor } from "../data/mock.js";

export default function Triagem() {
  return (
    <Layout profile="juridico" user={{ nome: "Marcos Vidal", cargo: "Gestor", iniciais: "MV" }} notifications={2}>
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="m-0 text-[21px] text-white font-semibold">
          Fila de triagem <span className="text-[13px] font-normal text-subtle">{filaTriagem.length} demandas novas</span>
        </h1>
        <select className="text-[12.5px] bg-field border border-borderStrong rounded-lg px-3 py-2.5 text-ink">
          <option>Todas categorias</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[80px_1.4fr_110px_130px_110px_110px_110px] px-5 py-3 bg-[#171e28] border-b border-border text-[10.5px] font-bold text-subtle uppercase tracking-wider">
          <div>Nº</div>
          <div>Solicitação</div>
          <div>Área</div>
          <div>Categoria</div>
          <div>Urgência</div>
          <div>Prazo</div>
          <div>Ação</div>
        </div>

        {filaTriagem.map((d, i) => (
          <div
            key={d.numero}
            className={`grid grid-cols-[80px_1.4fr_110px_130px_110px_110px_110px] px-5 py-3.5 items-center text-[13px] ${
              i < filaTriagem.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="text-subtle">{d.numero}</div>
            <div>
              <div className="font-semibold text-white">{d.titulo}</div>
              <div className="text-subtle text-[11.5px]">
                {d.area} · {d.solicitante}
              </div>
            </div>
            <div className="text-[#aab2bc]">{d.area}</div>
            <div className="text-[#aab2bc]">{d.categoria}</div>
            <StatusDot color={priorityColor[d.prioridade]}>{d.prioridade}</StatusDot>
            <div className={d.prazo === "Hoje" ? "text-status-critical font-semibold" : "text-[#aab2bc]"}>{d.prazo}</div>
            <div>
              <Link to="/demanda/1041" className="btn-primary !px-3.5 !py-1.5 !text-xs">
                Triar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
