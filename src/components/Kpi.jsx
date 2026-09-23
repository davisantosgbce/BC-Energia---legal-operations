export function KpiCard({ icon: Icon, iconColor, value, label, valueColor = "#fff" }) {
  return (
    <div className="card p-[18px]">
      <div
        className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center mb-3.5"
        style={{ backgroundColor: `${iconColor}24` }}
      >
        <Icon className="w-[17px] h-[17px]" stroke={iconColor} />
      </div>
      <div className="text-2xl font-bold font-display tracking-tight" style={{ color: valueColor }}>
        {value}
      </div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}

export function StatusDot({ color, children }) {
  return (
    <div className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
      {children}
    </div>
  );
}
