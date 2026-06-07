function Header({ onLogout }) {
  const deviceId = localStorage.getItem("deviceId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const local = localStorage.getItem("lastNotification")

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
          <h2>Sericulture Dashboard {local}</h2>
          <p>{deviceId} {isAdmin ? "Admin" : ""}</p>
        </div>
      </div>

      <div className="header-right">
        <button
          className="test-notif-btn"
          onClick={async () => {
            try {
              if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
                await Notification.requestPermission();
              }
              if ('serviceWorker' in navigator) {
                const reg = await navigator.serviceWorker.ready;
                reg.showNotification('Test Notification', {
                  body: 'Manual notification test',
                  icon: '/icons/icon-192.png',
                });
              } else if (typeof Notification !== 'undefined') {
                new Notification('Test Notification', { body: 'Manual notification test', icon: '/icons/icon-192.png' });
              }
            } catch (e) {
              console.error('Test notification failed', e);
              alert('Failed to show test notification. See console for details.', e);
            }
          }}
          aria-label="Test Notification"
        >
          Test Notification
        </button>

        <button className="header-user-btn" onClick={handleLogout} aria-label="Logout">
          <i className="ti ti-user" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default Header;