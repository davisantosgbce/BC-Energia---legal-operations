// Ícones de linha (stroke), consistentes com o sistema visual aprovado.
// Nunca usar emoji nesta base de código — sempre estes ícones ou novos no mesmo estilo.

const base = {
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconHome({ className = "w-[17px] h-[17px]", stroke = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <path d="M3 9.5 10 3l7 6.5" />
      <path d="M5 8.5V17h10V8.5" />
    </svg>
  );
}

export function IconFile({ className = "w-[17px] h-[17px]", stroke = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <path d="M6 2.5h5.5L15 6v11.5H6z" />
      <path d="M11 2.5V6h4" />
      <path d="M8.2 10.5h4M8.2 13h4" />
    </svg>
  );
}

export function IconKanban({ className = "w-[17px] h-[17px]", stroke = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <rect x="3" y="3.5" width="4" height="13" rx="1.2" />
      <rect x="8" y="3.5" width="4" height="8" rx="1.2" />
      <rect x="13" y="3.5" width="4" height="10.5" rx="1.2" />
    </svg>
  );
}

export function IconFunnel({ className = "w-[17px] h-[17px]", stroke = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <path d="M3 4h14l-5.2 6.4v4.3L8.2 16v-5.6z" />
    </svg>
  );
}

export function IconChart({ className = "w-[17px] h-[17px]", stroke = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <path d="M3.5 16.5V11M9 16.5V6M14.5 16.5V9.5" />
      <path d="M3 16.5h14" />
    </svg>
  );
}

export function IconSearch({ className = "w-[17px] h-[17px]", stroke = "#5f6a78" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <circle cx="9" cy="9" r="6" />
      <path d="m17 17-4-4" />
    </svg>
  );
}

export function IconBell({ className = "w-[17px] h-[17px]", stroke = "#8b95a3" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <path d="M10 3a5 5 0 0 0-5 5v3.2L3.5 14h13L15 11.2V8a5 5 0 0 0-5-5Z" />
      <path d="M8.2 16.5a1.8 1.8 0 0 0 3.6 0" />
    </svg>
  );
}

export function IconPlus({ className = "w-3.5 h-3.5", stroke = "#06120e" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} strokeWidth={2.2} strokeLinecap="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function IconArrowLeft({ className = "w-3 h-3", stroke = "#5f6a78" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4 6 10l6 6" />
    </svg>
  );
}

export function IconWarning({ className = "w-[17px] h-[17px]", stroke = "#e8536b" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <path d="M10 3.5 17 16H3z" />
      <path d="M10 8.3v3.4M10 13.6v.1" />
    </svg>
  );
}

export function IconCheck({ className = "w-[17px] h-[17px]", stroke = "#3ecbc0" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <path d="M4 10.5 8 14.5 16 5.5" />
    </svg>
  );
}

export function IconClock({ className = "w-[17px] h-[17px]", stroke = "#f0b429" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 6.5V10l2.5 1.5" />
    </svg>
  );
}

export function IconDoc({ className = "w-[17px] h-[17px]", stroke = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} {...base}>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2.5" />
      <path d="M7 8h6M7 11h6M7 14h3.5" />
    </svg>
  );
}

export function IconPause({ className = "w-[11px] h-[11px]", stroke = "#f0b429" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" stroke={stroke} strokeWidth={1.8}>
      <circle cx="10" cy="10" r="7" />
      <path d="M8 7v6M12 7v6" />
    </svg>
  );
}
