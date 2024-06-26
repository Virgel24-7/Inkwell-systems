import React, { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase-config";
import { setUserData } from "./UserPage";
import { setCurrentUser } from "./App";

export const Loginbox = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const navigate = useNavigate(); // Hook for navigation

  const signIn = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state while signing in

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currUserID = auth.currentUser.uid;
      logInAsUser(currUserID);
    } catch (error) {
      console.log(error);
      alert("User not found");
      setIsLoading(false); // Reset loading state
    }
  };

  const logInAsUser = async (userID) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const data = await getDocs(usersCollectionRef);
      const tempUsers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const user = tempUsers.find((user) => user.userId === userID);

      if (user) {
        window.localStorage.setItem("user", JSON.stringify(user));
        props.setUser(user);
        setCurrentUser(user);
        if (user.role === "user") {
          setUserData();
        } else {
          alert(`Logging in as ${user.role}`);
        }

        navigate("/");
      } else {
        alert("User not found");
        setIsLoading(false); // Reset loading state
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Reset loading state /shii
    }
  };
  <br></br>;
  return (
    <div className="login-page">
      <div className="login-container">
        <form action="" onSubmit={signIn} className="login-form">
          <h1>Log in</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
