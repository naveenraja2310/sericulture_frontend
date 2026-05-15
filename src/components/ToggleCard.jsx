const TOGGLE_ICONS = {
  Motor:  "ti-engine",
  Fan:    "ti-wind",
  Heater: "ti-flame",
};

function ToggleCard({ title, status, onToggle, disabled }) {
  const icon = TOGGLE_ICONS[title] || "ti-toggle-left";

  return (
    <div className="card">
      <div className="toggle-header">
        <div className="card-label" style={{ marginBottom: 0 }}>
          <i className={`ti ${icon}`} aria-hidden="true" />
          {title}
        </div>
        <button
          className={`toggle-btn ${status ? "on" : "off"}`}
          onClick={onToggle}
          disabled={disabled}
          aria-label={`Toggle ${title} ${status ? "off" : "on"}`}
        />
      </div>

      <div className="toggle-status">
        <span className={`toggle-indicator ${status ? "on" : "off"}`} />
        <span className={`toggle-label ${status ? "on" : "off"}`}>
          {status ? "Running" : "Stopped"}
        </span>
      </div>
    </div>
  );
}

export default ToggleCard;