import React from "react";
import { NavLink } from "react-router-dom";

const FooterNav = () => (
  <nav style={{
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    background: "#fff",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 0",
    zIndex: 1000
  }}>
    <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? "#1976d2" : "#444", textDecoration: "none" })}>
      Dashboard
    </NavLink>
    <NavLink to="/threshold" style={({ isActive }) => ({ color: isActive ? "#1976d2" : "#444", textDecoration: "none" })}>
      Threshold & Timer
    </NavLink>
    <NavLink to="/setstage" style={({ isActive }) => ({ color: isActive ? "#1976d2" : "#444", textDecoration: "none" })}>
      Set Stage
    </NavLink>
    <NavLink to="/contactus" style={({ isActive }) => ({ color: isActive ? "#1976d2" : "#444", textDecoration: "none" })}>
      Contact Us
    </NavLink>
  </nav>
);

export default FooterNav;
