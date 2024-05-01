import React, { useState } from "react";
import { auth } from './firebase-config';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Loginpage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const navigate = useNavigate(); // Hook for navigation

  const signIn = (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state while signing in
    const currentUser = auth.currentUser;

    if (currentUser) {
      // If a user is already signed in, sign them out first
      signOut(auth)
        .then(() => {
          // After signing out, proceed with signing in the new user
          signInUser();
        })
        .catch((error) => {
          console.log("Error signing out:", error);
          setIsLoading(false); // Reset loading state
        });
    } else {
      // If no user is signed in, directly proceed with signing in the new user
      signInUser();
    }
  };

  const signInUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        // Navigate to the homepage after successful login
        navigate("/");
      }) 
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state regardless of success or failure
      });
  };

  console.log()

  return (
    <div className="loginpage">
      <div className="wrapper">
        <form onSubmit={signIn}>
          <h1>Log in</h1>
          <div className="input-box">
            <input 
              type="email" 
              placeholder="Email" 
              value ={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder="Password" 
              value ={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#"> Forgot Password?</a>
          </div>
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
