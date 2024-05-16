import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import "./style.css";

export const Accesspage = (props) => {
  return (
    <div className="accessOption">
      <div className="links-access">
        <Link to="log-in">Log In</Link>
        <Link to="sign-up">Sign Up</Link>
      </div>
      <Outlet />
    </div>
  );
};
