import { Link } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <nav>
      <img src="logo.png" alt="logo" />

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
        <Link className="book-link" to="/books">
          Books
        </Link>
        <Link className="about-link" to="/about">
          About us
        </Link>
        <Link className="contact-link" to="/contact">
          Contact
        </Link>
        <Link className="login-link" to="/login">
          Log In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
