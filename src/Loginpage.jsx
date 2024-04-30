import { set } from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export let currUser = "";

export const Loginpage = (props) => {
  const [uName, setUName] = useState("");
  const [pWord, setPWord] = useState("");

  let navigate = useNavigate();
  const validate = () => {
    currUser = uName;
    console.log(currUser);
    navigate("/");

    props.updateUserText(currUser.toUpperCase());
    props.logUser();
  };

  return (
    <div className="loginpage">
      <div className="wrapper">
        <form action="">
          <h1>Log in</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              onChange={() => setUName(event.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              onChange={() => setPWord(event.target.value)}
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#"> Forgot Password?</a>
          </div>
          <button type="submit" className="btn" onClick={validate}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
