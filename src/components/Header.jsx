function Header({ gprsStatus, powerOn }) {
  const isConnected = gprsStatus ? /connect/i.test(gprsStatus) : false;
  const isPowered = powerOn === 1 || powerOn === true;

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-icon">
          <i className="ti ti-leaf" aria-hidden="true" />
        </div>
        <div>
          <h2>Sericulture Dashboard</h2>
          <p>YADH-B4ACF589</p>
        </div>
      </div>

      <div className="header-right">
        <div className={`status-pill ${isConnected ? "status-pill--on" : "status-pill--off"}`}>
          <i className={`ti ${isConnected ? "ti-wifi" : "ti-wifi-off"}`} aria-hidden="true" />
          {/* <span className="status-pill__label">GPRS</span> */}
          <span className="status-pill__divider" />
          <span className={`status-pill__dot ${isConnected ? "status-pill__dot--on" : "status-pill__dot--off"}`} />
          <span className="status-pill__value">{gprsStatus || "Loading…"}</span>
        </div>

        <div className={`status-pill ${isPowered ? "status-pill--on" : "status-pill--off"}`}>
          <i className={`ti ${isPowered ? "ti-plug" : "ti-plug-off"}`} aria-hidden="true" />
          {/* <span className="status-pill__label">Power</span> */}
          <span className="status-pill__divider" />
          <span className={`status-pill__dot ${isPowered ? "status-pill__dot--on" : "status-pill__dot--off"}`} />
          <span className="status-pill__value">{isPowered ? "On" : "Off"}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;