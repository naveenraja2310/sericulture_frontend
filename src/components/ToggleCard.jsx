const TOGGLE_ICONS = {
  Motor:  "ti-engine",
  Fan:    "ti-wind",
  Heater: "ti-flame",
};

function ToggleCard({ title, status, onToggle, disabled }) {
  const icon = TOGGLE_ICONS[title] || "ti-toggle-left";
  const isActive = Boolean(status);
  const displayStatus = disabled ? "Offline" : isActive ? "Running" : "Stopped";

  return (
    <div className="card">
      <div className="toggle-header">
        <div className="card-label" style={{ marginBottom: 0 }}>
          <i className={`ti ${icon}`} aria-hidden="true" />
          {title}
        </div>
        <button
          className={`toggle-btn ${isActive ? "on" : "off"}`}
          onClick={onToggle}
          disabled={disabled}
          aria-label={`Toggle ${title} ${isActive ? "off" : "on"}`}
        />
      </div>

      <div className="toggle-status">
        <span className={`toggle-indicator ${disabled ? "off" : isActive ? "on" : "off"}`} />
        <span className={`toggle-label ${disabled ? "off" : isActive ? "on" : "off"}`}>
          {displayStatus}
        </span>
      </div>
    </div>
  );
}

export default ToggleCard;