import { stack as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import settings from "./Settings.svg";
import logout from "./Logout.svg";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Menu right width={"20%"} disableAutoFocus>
      <a className="menu-item" href="/">
        Calendar
      </a>
      <a className="menu-item" href="/historical-events">
        Historical Events
      </a>
      <a className="menu-item" href="/saved-lists">
        Saved Lists
      </a>
      <a className="menu-item contact-us" href="/contact-us">
        Contact Us
      </a>

      <a className="settings" href="/settings">
        <img className="settings-logo" src={settings} alt="" />
      </a>

      <button
        className="logout"
        onClick={() => {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("id");
          navigate("/login");
        }}
      >
        <img src={logout} alt="" />
      </button>
    </Menu>
  );
};

export default Sidebar;
