import { NavLink } from "react-router-dom";
import { IconHome, IconFile, IconKanban, IconFunnel, IconChart } from "./icons.jsx";

const solicitanteLinks = [{ to: "/", label: "Início", icon: IconHome }, { to: "/nova-solicitacao", label: "Nova solicitação", icon: IconFile }];

const juridicoLinks = [
  { to: "/juridico", label: "Início", icon: IconHome },
  { to: "/nova-solicitacao", label: "Nova solicitação", icon: IconFile },
  { to: "/painel", label: "Minhas demandas", icon: IconKanban },
  { to: "/triagem", label: "Triagem", icon: IconFunnel },
  { to: "/dashboard", label: "Dashboard", icon: IconChart },
];

/**
 * profile: "solicitante" | "juridico"
 * user: { nome, cargo, iniciais }
 */
export default function Sidebar({ profile, user }) {
  const links = profile === "juridico" ? juridicoLinks : solicitanteLinks;

  return (
    <div className="w-[232px] shrink-0 bg-sidebar border-r border-border flex flex-col p-3.5 box-border">
      <div className="flex items-center gap-2.5 px-1.5 pb-4">
        <img src="/logo-icon.png" alt="Grupo BC Energia" className="w-5 h-[15px] object-contain" />
        <div className="font-display font-bold text-sm text-white leading-tight">
          Grupo BC Energia
          <br />
          <span className="text-[10.5px] text-subtle font-medium">Portal Jurídico</span>
        </div>
      </div>

      <div className="text-[10.5px] font-bold text-faint tracking-wider px-3 pt-2 pb-1.5">GERAL</div>

      <nav className="flex flex-col gap-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}>
            <Icon className="w-[17px] h-[17px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-3.5 border-t border-border flex items-center gap-2.5 pl-1.5">
        <div className="w-8 h-8 rounded-full bg-brand-teal text-white text-xs font-bold flex items-center justify-center shrink-0">
          {user.iniciais}
        </div>
        <div className="leading-tight">
          <div className="text-[12.5px] font-semibold text-ink">{user.nome}</div>
          <div className="text-[11px] text-subtle">{user.cargo}</div>
        </div>
      </div>
    </div>
  );
}
