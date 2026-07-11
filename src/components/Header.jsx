import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ onLogout }) {
  const deviceId = localStorage.getItem("deviceId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("Do you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("token");
    setMenuOpen(false);
    onLogout();
  };

  const handleContactUs = () => {
    setMenuOpen(false);
    navigate("/contact-us");
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-icon">
          <img src="/icons/icon-192.png" alt="SeriSmart Logo" className="header-logo" />
        </div>
        <div>
          <h2>Dashboard</h2>
          <p>{deviceId} {isAdmin ? "Admin" : ""}</p>
        </div>
      </div>

      <div className="header-right" ref={menuRef}>
        <button
          className="header-user-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <i className="ti ti-menu" aria-hidden="true" />
        </button>

        {menuOpen && (
          <div className="header-dropdown">
            <button type="button" className="header-dropdown__item" onClick={handleContactUs}>
              <i className="ti ti-phone" aria-hidden="true" />
              <span>Contact Us</span>
            </button>
            <button type="button" className="header-dropdown__item header-dropdown__item--danger" onClick={handleLogout}>
              <i className="ti ti-logout" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;