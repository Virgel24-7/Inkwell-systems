import { Link } from "react-router-dom";
import { useState } from "react";
import { currUserID } from "./Loginbox";
import { logout } from "./Logout";
import logo from "./assets/logo.png";

export const Navbar = (props) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <nav>
      <img src={logo} alt="logo" />

      <input
        type="checkbox"
        id="sidebar-active"
        checked={sidebarActive}
        onChange={toggleSidebar}
      />
      <label htmlFor="sidebar-active" className="open-sidebar-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32"
          viewBox="0 -960 960 960"
          width="32"
        >
          <path
            fill="#FFFFFF"
            d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
          />
        </svg>
      </label>

      <div
        className={sidebarActive ? "links-container active" : "links-container"}
      >
        <label htmlFor="sidebar-active" className="close-sidebar-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 -960 960 960"
            width="32"
          >
            <path
              fill="#FFFFFF"
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>
        </label>

        <Link className="home-link" to="/">
          Home
        </Link>
        {!props.isMasterAdmin && (
          <Link className="book-link" to="/books">
            Books
          </Link>
        )}
        {props.isAdmin && !props.isMasterAdmin && (
          <Link className="admin-link" to="/checkouts">
            Checkouts
          </Link>
        )}
        {props.isAdmin || (
          <Link className="about-link" to="/about">
            About us
          </Link>
        )}
        {props.isMasterAdmin && (
          <Link className="masteradmin-link" to="/masteradmin">
            Admins/Users
          </Link>
        )}
        {props.isAdmin || props.isMasterAdmin || (
          <Link
            className="login-link"
            to={
              props.userText === ""
                ? "login"
                : `/${props.userText.toLowerCase()}`
            }
          >
            {props.userText}
          </Link>
        )}
        {currUserID === "" || (
          <Link to="/">
            <span onClick={() => logout(props.handleLogout)}>Log out</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
