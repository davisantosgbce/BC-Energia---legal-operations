import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { StatusDot } from "../components/Kpi.jsx";
import { getDemandasParaTriagem } from "../lib/api.js";
import { prioridadeCor } from "../lib/enumMaps.js";

export default function Triagem() {
  const [demandas, setDemandas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getDemandasParaTriagem()
      .then(setDemandas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <Layout profile="juridico" user={{ nome: "Marcos Vidal", cargo: "Gestor", iniciais: "MV" }} notifications={2}>
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="m-0 text-[21px] text-white font-semibold">
          Fila de triagem <span className="text-[13px] font-normal text-subtle">{demandas.length} demandas novas</span>
        </h1>
        <select className="text-[12.5px] bg-field border border-borderStrong rounded-lg px-3 py-2.5 text-ink">
          <option>Todas categorias</option>
        </select>
      </div>

      {erro && (
        <div className="mb-4 text-[13px] text-status-critical bg-status-critical/10 border border-status-critical/30 rounded-lg px-4 py-3">
          Não foi possível carregar a fila: {erro}
        </div>
      )}

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

        {carregando && <div className="px-5 py-6 text-sm text-subtle">Carregando...</div>}

        {!carregando && demandas.length === 0 && (
          <div className="px-5 py-6 text-sm text-subtle">Nenhuma demanda na fila de triagem no momento.</div>
        )}

        {demandas.map((d, i) => (
          <div
            key={d.id}
            className={`grid grid-cols-[80px_1.4fr_110px_130px_110px_110px_110px] px-5 py-3.5 items-center text-[13px] ${
              i < demandas.length - 1 ? "border-b border-white/5" : ""
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
            <StatusDot color={prioridadeCor[d.prioridade] ?? "#6fa8f5"}>{d.prioridade}</StatusDot>
            <div className="text-[#aab2bc]">{d.prazo ?? "—"}</div>
            <div>
              <Link to={`/demanda/${d.id}`} className="btn-primary !px-3.5 !py-1.5 !text-xs">
                Triar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
