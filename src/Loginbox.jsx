import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export let currUser = "";

export const Loginbox = (props) => {
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
    <div>
      <form action="">
        <h1>Log in</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUName(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPWord(e.target.value)}
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
  );
};
