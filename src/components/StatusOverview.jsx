function StatusOverview({ gprsStatus, onRefresh }) {
  const isConnected = gprsStatus ? /connect/i.test(gprsStatus) : false;

  return (
    <div className="status-overview">

      <div className="so-side">
        <div className="status-item">
          <div className={`status-icon-wrap ${isConnected ? "on" : "off"}`}>
            <i
              className={`ti ${isConnected ? "ti-wifi" : "ti-wifi-off"}`}
              aria-hidden="true"
            />
          </div>
          <div className="status-text">
            <span className="status-text__label">GPRS Status</span>
            <span className={`status-text__value ${isConnected ? "on" : "off"}`}>
              {gprsStatus || "Loading…"}
            </span>
          </div>
        </div>
      </div>

      <div className="so-center">
        <div className="so-divider" />
        <button
          className="refresh-btn"
          onClick={onRefresh}
          aria-label="Refresh data"
        >
          <i className="ti ti-refresh" aria-hidden="true" />
        </button>
        <div className="so-divider" />
      </div>

      <div className="so-side so-side--right">
         <div className="status-item">
       
        <div className="status-text">
          <span className="status-text__label">Network</span>
          <span className={`status-text__value ${isConnected ? "on" : "off"}`}>
            {isConnected ? "Online" : "Offline"}
          </span>
        </div>
         <div className={`status-icon-wrap ${isConnected ? "on" : "off"}`}>
          <div className="signal-bars">
            <span className={`bar ${isConnected ? "on" : "off"}`} />
            <span className={`bar ${isConnected ? "on" : "off"}`} />
            <span className={`bar ${isConnected ? "on" : "off"}`} />
          </div>
        </div>
        </div>
      </div>

    </div>
  );
}

export default StatusOverview;