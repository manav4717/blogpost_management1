import {
    FaBlog,
    FaChartLine,
    FaHome,
    FaMoon,
    FaPlusSquare,
    FaSignOutAlt,
    FaSun,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useTheme } from "./context/ThemeContext";
import "./context/Theme.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("authData"));
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("click from dashboard");
    localStorage.removeItem("loginData");
    localStorage.removeItem("authData");
    // localStorage.clear()
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <FaBlog className="logo-icon" />
          <span className="logo-text">BlogPost</span>
        </div>

        <div className="navbar-links">
          <NavLink to="/dashboard" className="nav-item">
            <FaHome className="nav-icon" /> Home
          </NavLink>

          <NavLink to="/creat-post" className="nav-item">
            <FaPlusSquare className="nav-icon" /> Ctreate post
          </NavLink>

          <NavLink to="/analytics" className="nav-item">
            <FaChartLine className="nav-icon" /> Analytics
          </NavLink>
        </div>

        <div className="navbar-actions">
          <span className="user-name">Hi, {user.name}</span>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
