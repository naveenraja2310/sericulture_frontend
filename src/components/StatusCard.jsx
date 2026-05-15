const CARD_CONFIG = {
  Temperature: {
    icon: "ti-temperature",
    accentIcon: "ti-temperature",
    sub: "Ambient reading",
  },
  Humidity: {
    icon: "ti-droplet",
    accentIcon: "ti-droplet",
    sub: "Relative humidity",
  },
  Mode: {
    icon: "ti-adjustments-horizontal",
    accentIcon: "ti-adjustments-horizontal",
    sub: "Control mode",
  },
  GPRS: {
    icon: "ti-wifi",
    accentIcon: "ti-wifi",
    sub: "Network status",
  },
  Uptime: {
    icon: "ti-clock",
    accentIcon: "ti-clock",
    sub: "Since last reset",
  },
};

function StatusCard({ title, value, unit }) {
  const config = CARD_CONFIG[title] || { icon: "ti-activity", sub: "" };
  const isGprs = title === "GPRS";
  const isConnected = isGprs && /connect/i.test(String(value));

  return (
    <div className="card">
      <div className="card-label">
        <i className={`ti ${config.icon}`} aria-hidden="true" />
        {title}
      </div>

      {isGprs ? (
        <div>
          <span className={`gprs-badge ${isConnected ? "connected" : "disconnected"}`}>
            <i className={`ti ${isConnected ? "ti-wifi" : "ti-wifi-off"}`} style={{ fontSize: 14 }} aria-hidden="true" />
            {value}
          </span>
          <div className="status-card-sub" style={{ marginTop: 10 }}>{config.sub}</div>
        </div>
      ) : (
        <div className="status-card-value">
          {value}
          {unit && <span>{unit}</span>}
        </div>
      )}

      <div className="status-card-sub">{config.sub}</div>

      <div className="status-card-accent" aria-hidden="true">
        <i className={`ti ${config.accentIcon}`} />
      </div>
    </div>
  );
}

export default StatusCard;