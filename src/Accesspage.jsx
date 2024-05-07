import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export const Accesspage = (props) => {
  return (
    <div className="loginpage">
      <div className="wrapper">
        <Link to="log-in">Log In</Link>
        <Link to="sign-up">Sign Up</Link>
        <br />
        <br />
        <br />
        <Outlet />
      </div>
    </div>
  );
};