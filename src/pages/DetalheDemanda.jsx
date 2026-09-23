import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { StatusDot } from "../components/Kpi.jsx";
import { IconArrowLeft, IconFile } from "../components/icons.jsx";

export default function DetalheDemanda() {
  return (
    <Layout profile="juridico" user={{ nome: "Marcos Vidal", cargo: "Gestor", iniciais: "MV" }} topbarPlaceholder="Buscar demandas...">
      <div className="flex gap-6">
        <div className="flex-grow max-w-[720px]">
          <Link to="/triagem" className="text-xs text-subtle inline-flex items-center gap-1.5">
            <IconArrowLeft />
            Voltar para triagem
          </Link>

          <div className="flex justify-between items-start mt-3 mb-1">
            <h1 className="m-0 text-[19px] text-white font-semibold">#1041 — Notificação extrajudicial recebida</h1>
            <div className="pt-0.5 shrink-0">
              <StatusDot color="#e8536b">Em triagem</StatusDot>
            </div>
          </div>
          <div className="text-xs text-subtle mb-[22px]">Aberta em 22/09/2026 às 09:14 por Rita Sales · Comercial</div>

          <div className="card p-[18px] mb-3.5">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-2.5">Descrição da solicitação</div>
            <p className="m-0 text-[13px] leading-relaxed text-[#dfe3e8]">
              Recebemos notificação extrajudicial de cliente questionando cobrança referente ao contrato nº 4521. Prazo para
              resposta: 5 dias corridos a partir do recebimento. Anexo cópia da notificação e do contrato original.
            </p>
          </div>

          <div className="card p-[18px] mb-3.5">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-3">Documentos anexados</div>
            <div className="flex flex-col gap-2.5 text-[12.5px]">
              <div className="flex items-center gap-2.5 text-[#dfe3e8]">
                <IconFile className="w-3.5 h-3.5" stroke="#3ecbc0" />
                notificacao_extrajudicial.pdf
              </div>
              <div className="flex items-center gap-2.5 text-[#dfe3e8]">
                <IconFile className="w-3.5 h-3.5" stroke="#3ecbc0" />
                contrato_4521_original.pdf
              </div>
            </div>
          </div>

          <div className="card p-[18px]">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-3.5">Comentários e histórico</div>
            <div className="flex flex-col gap-3 mb-4">
              <div className="text-[11.5px] text-subtle">Demanda criada por Rita Sales em 22/09/2026 às 09:14.</div>
              <div className="text-[11.5px] text-subtle">Status alterado de Nova para Em triagem (automático).</div>
              <div className="flex gap-2.5">
                <div className="w-[26px] h-[26px] rounded-full bg-brand-teal text-[#06120e] text-[10.5px] font-bold flex items-center justify-center shrink-0">
                  RS
                </div>
                <div className="bg-field rounded-lg px-3.5 py-2.5 text-[12.5px] text-[#dfe3e8]">
                  Segue anexo o contrato original mencionado.
                </div>
              </div>
            </div>
            <label className="field-label" htmlFor="comentario">
              Adicionar comentário
            </label>
            <textarea id="comentario" rows={2} placeholder="Escreva um comentário ou @mencione alguém..." className="field resize-y" />
          </div>
        </div>

        <div className="w-[280px] shrink-0">
          <div className="card p-[18px] sticky top-0">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-subtle mb-3.5">Triagem</div>

            <label className="field-label" htmlFor="prioridade">
              Prioridade
            </label>
            <select id="prioridade" className="field mb-3.5">
              <option>Crítica</option>
              <option>Alta</option>
              <option>Média</option>
              <option>Baixa</option>
            </select>

            <div className="field-label">SLA</div>
            <div className="text-xs bg-field rounded-lg px-2.5 py-2.5 mb-3.5 text-[#dfe3e8] leading-relaxed">
              Prazo legal: <strong className="text-white">5 dias corridos</strong>
              <br />
              Vencimento: <strong className="text-status-critical">27/09/2026</strong>
            </div>

            <label className="field-label" htmlFor="responsavel">
              Responsável
            </label>
            <select id="responsavel" className="field mb-[18px]">
              <option>Selecionar advogado…</option>
              <option>Beatriz Nunes</option>
            </select>

            <button type="button" className="btn-primary w-full justify-center mb-2">
              Confirmar triagem e atribuir
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
