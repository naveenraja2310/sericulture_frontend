function Header({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-icon">
          <img src="/../public/icons/icon-192.png" alt="SeriSmart Logo" className="header-logo" />
        </div>
        <div>
          <h2>Sericulture Dashboard</h2>
          <p>YADH-B4ACF589</p>
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