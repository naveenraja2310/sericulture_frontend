function Header({ onLogout }) {
  const deviceId = localStorage.getItem("deviceId") || "YADH-B4ACF589";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    const confirmed = window.confirm("Do you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("deviceId");
    localStorage.removeItem("isAdmin");
    onLogout();
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-icon">
          <img src="/icons/icon-192.png" alt="SeriSmart Logo" className="header-logo" />
        </div>
        <div>
          <h2>Sericulture Dashboard</h2>
          <p>{deviceId} {isAdmin ? "(Admin)" : ""}</p>
        </div>
      </div>

      <div className="header-right">
        <button className="header-user-btn" onClick={handleLogout} aria-label="Logout">
          <i className="ti ti-user" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default Header;