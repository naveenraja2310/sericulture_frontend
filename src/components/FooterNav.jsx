import React from "react";
import { NavLink } from "react-router-dom";

const userLinks = [
  { to: "/",           end: true,  icon: "ti-layout-dashboard", label: "Dashboard"   },
  { to: "/threshold",  end: false, icon: "ti-adjustments",      label: "Thresholds"  },
  { to: "/setstage",   end: false, icon: "ti-settings",         label: "Set Stage"   },
  { to: "/contactus",  end: false, icon: "ti-headset",          label: "Contact"     },
];

const adminLinks = [
  { to: "/users",   end: false, icon: "ti-users",  label: "Users"   },
  { to: "/devices", end: false, icon: "ti-cpu",    label: "Devices" },
];

const FooterNav = ({ isAdmin }) => {
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="footer-nav">
      {links.map(({ to, end, icon, label }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `footer-nav-item${isActive ? " active" : ""}`}>
          <i className={`ti ${icon}`} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default FooterNav;