function Header({ gprsStatus }) {
  const isConnected = gprsStatus ? /connect/i.test(gprsStatus) : false;
  
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

      <div className="header-badge">
        <span className="pulse-dot" style={{ background: isConnected ? "var(--accent-success)" : "var(--accent-danger)" }} />
        {gprsStatus || "Loading..."}
      </div>
    </div>
  );
}

export default Header;