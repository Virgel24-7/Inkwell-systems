import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="navigation">
      <div className="navbar">
        <div className="logo">
          <img src="src/assets/logo.png" />

          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="books">Books</Link>
              </li>
              <li>
                <Link to="about">About us</Link>
              </li>
              <li>
                <Link to="contact">Contact</Link>
              </li>
              <li>
                <Link to="login">Log In</Link>
              </li>
              <li>
                <Link to="admin">Admin</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
