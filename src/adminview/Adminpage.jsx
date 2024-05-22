import React from "react";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import { setCurrentUser } from "../UserPage";
import { logOut } from "../Loginbox";
import { useNavigate } from "react-router-dom";

export const Adminpage = (props) => {
  let navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setCurrentUser(null);
        logOut();
        props.handleLogout();
        navigate("/");
        alert("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
   
    <div style={{ color: "white" }}>
      {" "}
      Admin Page
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo velit ad
        nihil iure dicta officiis sint voluptas quia nam.
      </div>
      <button onClick={handleLogout}> LOG OUT </button>
    </div>
  );
};
