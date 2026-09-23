import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { getCategorias, getEmpresas, criarDemanda, getUsuarioAtualDeTeste } from "../lib/api.js";

export default function NovaSolicitacao() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const [temPrazoLegal, setTemPrazoLegal] = useState(false);
  const [form, setForm] = useState({
    categoriaId: "",
    empresaId: "",
    areaSolicitante: "Financeiro",
    titulo: "",
    descricao: "",
    prazoInformado: "",
    urgencia: "Média",
    tipoPrazoLegal: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    Promise.all([getCategorias(), getEmpresas(), getUsuarioAtualDeTeste()])
      .then(([cats, emp, usuario]) => {
        setCategorias(cats);
        setEmpresas(emp);
        setUsuarioAtual(usuario);
        setForm((f) => ({ ...f, categoriaId: cats[0]?.id ?? "", empresaId: emp[0]?.id ?? "" }));
      })
      .catch((e) => setErro(e.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const demanda = await criarDemanda({
        titulo: form.titulo,
        descricao: form.descricao,
        categoriaId: form.categoriaId || null,
        empresaId: form.empresaId || null,
        areaSolicitante: form.areaSolicitante,
        solicitanteId: usuarioAtual.id,
        prazoInformado: form.prazoInformado,
        temPrazoLegal,
        tipoPrazoLegal: form.tipoPrazoLegal,
        urgencia: form.urgencia,
      });
      setSucesso(demanda);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <Layout profile="solicitante" user={{ nome: "Ana Ribeiro", cargo: "Financeiro", iniciais: "AR" }}>
        <div className="max-w-[520px] card p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="text-xl font-semibold text-white mb-2">Solicitação enviada!</h1>
          <p className="text-sm text-muted mb-6">
            Sua demanda foi registrada com o número{" "}
            <strong className="text-brand-tealLight">#{String(sucesso.numero).padStart(4, "0")}</strong>. Você pode
            acompanhar o andamento pelo Início.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/")} className="btn-primary">
              Ir para o Início
            </button>
            <button onClick={() => setSucesso(null)} className="btn-secondary">
              Abrir outra
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout profile="solicitante" user={{ nome: "Ana Ribeiro", cargo: "Financeiro", iniciais: "AR" }} topbarPlaceholder="Buscar demandas, categorias...">
      <div className="max-w-[720px]">
        <h1 className="m-0 mb-1.5 text-[22px] text-white font-semibold">Abrir nova demanda</h1>
        <p className="m-0 mb-6 text-[13px] text-muted leading-relaxed">
          Preencha os campos abaixo. Você receberá um número de protocolo e poderá acompanhar o andamento pelo Início.
        </p>

        {erro && (
          <div className="mb-4 text-[13px] text-status-critical bg-status-critical/10 border border-status-critical/30 rounded-lg px-4 py-3">
            Não foi possível enviar: {erro}
          </div>
        )}

        <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-[18px]">
            <Field label="Área solicitante">
              <input
                className="field"
                value={form.areaSolicitante}
                onChange={(e) => setForm((f) => ({ ...f, areaSolicitante: e.target.value }))}
              />
            </Field>
            <Field label="Empresa do grupo">
              <select
                className="field"
                value={form.empresaId}
                onChange={(e) => setForm((f) => ({ ...f, empresaId: e.target.value }))}
              >
                <option value="">Selecione…</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Tipo de demanda">
            <select
              className="field"
              value={form.categoriaId}
              onChange={(e) => setForm((f) => ({ ...f, categoriaId: e.target.value }))}
              required
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Descrição da solicitação">
            <textarea
              rows={4}
              placeholder="Descreva o que precisa e o contexto..."
              className="field resize-y"
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-[18px]">
            <Field label="Prazo desejado">
              <input
                type="date"
                className="field"
                value={form.prazoInformado}
                onChange={(e) => setForm((f) => ({ ...f, prazoInformado: e.target.value }))}
              />
            </Field>
            <Field label="Grau de urgência">
              <select
                className="field"
                value={form.urgencia}
                onChange={(e) => setForm((f) => ({ ...f, urgencia: e.target.value }))}
              >
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
                <option>Crítica</option>
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
            {temPrazoLegal && (
              <input
                className="field mt-3"
                placeholder="Qual? (ex.: prazo judicial de 5 dias corridos)"
                value={form.tipoPrazoLegal}
                onChange={(e) => setForm((f) => ({ ...f, tipoPrazoLegal: e.target.value }))}
              />
            )}
          </div>

          <Field label="Documentos / anexos">
            <div className="border border-dashed border-white/15 rounded-[10px] p-6 text-center text-[#5f6a78] text-xs bg-[#10151c]">
              Upload de anexos ainda não conectado ao Storage — próxima etapa.
            </div>
          </Field>

          <div className="flex justify-end gap-3 pt-2.5 border-t border-border mt-1.5">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={enviando || !usuarioAtual}>
              {enviando ? "Enviando..." : "Enviar solicitação"}
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
