import { IconSearch, IconBell } from "./icons.jsx";

export default function Topbar({ placeholder = "Buscar demandas, solicitantes...", notifications = 0 }) {
  return (
    <div className="h-16 shrink-0 flex items-center gap-4 px-8 border-b border-border">
      <div className="flex-grow max-w-[420px] flex items-center bg-field border border-borderStrong rounded-lg px-3.5 py-2.5 gap-2">
        <IconSearch />
        <input
          type="search"
          placeholder={placeholder}
          className="border-none bg-transparent outline-none flex-grow text-sm text-ink placeholder:text-faint"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <IconBell />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-status-critical text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
