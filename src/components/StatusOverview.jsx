function StatusOverview({ powerOn, gprsStatus, onRefresh }) {
  const isConnected = gprsStatus ? /connect/i.test(gprsStatus) : false;
  const isPowered = powerOn === 1 || powerOn === true;

  return (
    <div className="status-overview">
      <div className="status-overview-item status-overview-left">
        <div className={`status-badge ${isPowered ? "status-badge--on" : "status-badge--off"}`}>
          <i className={`ti ${isPowered ? "ti-plug" : "ti-plug-off"}`} aria-hidden="true" />
          <span>{isPowered ? "Power On" : "Power Off"}</span>
        </div>
      </div>

      <div className="status-overview-item status-overview-center">
        <button className="refresh-btn" onClick={onRefresh} aria-label="Refresh data">
          <i className="ti ti-refresh" aria-hidden="true" />
        </button>
      </div>

      <div className="status-overview-item status-overview-right">
        <div className={`status-badge ${isConnected ? "status-badge--on" : "status-badge--off"}`}>
          <i className={`ti ${isConnected ? "ti-wifi" : "ti-wifi-off"}`} aria-hidden="true" />
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>
    </div>
  );
}

export default StatusOverview;
