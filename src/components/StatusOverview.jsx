function StatusOverview({ powerOn, gprsStatus, onRefresh }) {
  const isConnected = gprsStatus ? /connect/i.test(gprsStatus) : false;
  const isPowered = powerOn === 1 || powerOn === true;

  return (
    <div className="status-overview">

      <div className="so-side">
        <div className="status-item">
          <div className={`status-icon-wrap ${isPowered ? "on" : "off"}`}>
            <i className={`ti ${isPowered ? "ti-plug" : "ti-plug-off"}`} aria-hidden="true" />
          </div>
          <div className="status-text">
            <span className="status-text__label">Power</span>
            <span className={`status-text__value ${isPowered ? "on" : "off"}`}>
              {isPowered ? "On" : "Off"}
            </span>
          </div>
        </div>
      </div>

      <div className="so-center">
        <div className="so-divider" />
        <button className="refresh-btn" onClick={onRefresh} aria-label="Refresh data">
          <i className="ti ti-refresh" aria-hidden="true" />
        </button>
        <div className="so-divider" />
      </div>

      <div className="so-side so-side--right">
        <div className="status-item">
          <div className="status-text status-text--right">
            <span className="status-text__label">GPRS</span>
            <span className={`status-text__value ${isConnected ? "on" : "off"}`}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className={`status-icon-wrap ${isConnected ? "on" : "off"}`}>
            <i className={`ti ${isConnected ? "ti-wifi" : "ti-wifi-off"}`} aria-hidden="true" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default StatusOverview;