import { useState } from "react";
import Layout from "../components/Layout.jsx";
import { categoriasDemanda } from "../data/mock.js";

export default function NovaSolicitacao() {
  const [temPrazoLegal, setTemPrazoLegal] = useState(false);

  return (
    <Layout profile="solicitante" user={{ nome: "Ana Ribeiro", cargo: "Financeiro", iniciais: "AR" }} topbarPlaceholder="Buscar demandas, categorias...">
      <div className="max-w-[720px]">
        <h1 className="m-0 mb-1.5 text-[22px] text-white font-semibold">Abrir nova demanda</h1>
        <p className="m-0 mb-6 text-[13px] text-muted leading-relaxed">
          Preencha os campos abaixo. Você receberá um número de protocolo e poderá acompanhar o andamento pelo Início.
        </p>

        <form className="flex flex-col gap-[18px]" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-[18px]">
            <Field label="Área solicitante">
              <select className="field">
                <option>Financeiro</option>
              </select>
            </Field>
            <Field label="Empresa do grupo">
              <select className="field">
                <option>Selecione…</option>
              </select>
            </Field>
          </div>

          <Field label="Tipo de demanda">
            <select className="field">
              {categoriasDemanda.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Descrição da solicitação">
            <textarea rows={4} placeholder="Descreva o que precisa e o contexto..." className="field resize-y" />
          </Field>

          <div className="grid grid-cols-2 gap-[18px]">
            <Field label="Prazo desejado">
              <input type="date" className="field" />
            </Field>
            <Field label="Grau de urgência">
              <select className="field">
                <option>Média</option>
                <option>Alta</option>
                <option>Crítica</option>
                <option>Baixa</option>
              </select>
            </Field>
          </div>

          <div className="card p-4">
            <div className="text-[12.5px] font-semibold mb-2.5 text-[#aab2bc]">
              Existe prazo legal, regulatório, contratual ou judicial?
            </div>
            <div className="flex gap-5 text-[13px]">
              <label className="flex items-center gap-1.5">
                <input type="radio" name="prazolegal" checked={temPrazoLegal} onChange={() => setTemPrazoLegal(true)} />
                Sim
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" name="prazolegal" checked={!temPrazoLegal} onChange={() => setTemPrazoLegal(false)} />
                Não
              </label>
            </div>
          </div>

          <Field label="Documentos / anexos">
            <div className="border border-dashed border-white/15 rounded-[10px] p-6 text-center text-[#5f6a78] text-xs bg-[#10151c]">
              Arraste arquivos aqui ou <span className="text-brand-tealLight font-semibold">selecione no computador</span>
            </div>
          </Field>

          <div className="flex justify-end gap-3 pt-2.5 border-t border-border mt-1.5">
            <button type="button" className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Enviar solicitação
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
