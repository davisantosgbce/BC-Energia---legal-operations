import { Routes, Route } from "react-router-dom";
import InicioSolicitante from "./pages/InicioSolicitante.jsx";
import NovaSolicitacao from "./pages/NovaSolicitacao.jsx";
import InicioJuridico from "./pages/InicioJuridico.jsx";
import Triagem from "./pages/Triagem.jsx";
import DetalheDemanda from "./pages/DetalheDemanda.jsx";
import Painel from "./pages/Painel.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioSolicitante />} />
      <Route path="/nova-solicitacao" element={<NovaSolicitacao />} />
      <Route path="/juridico" element={<InicioJuridico />} />
      <Route path="/triagem" element={<Triagem />} />
      <Route path="/demanda/:id" element={<DetalheDemanda />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
