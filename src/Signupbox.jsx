import React, { useState } from "react";
import { db, auth } from "./firebase-config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const Signupbox = () => {
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    // Validate name and email
    if (!newName || !email) {
      setError("Name and email are required.");
      return;
    }

    // Create user account with email and password
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      // Add user data to Firestore
      await addDoc(usersCollectionRef, {
        name: newName,
        userId: user.uid, // Store the user ID for reference
        reserves: [],
        borrowed: [],
        role: "user",
      });

      // Reset input fields
      setNewName("");
      setEmail("");
      setPassword("");
      setError(null);
      alert("Account Successfully Created.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="App-admin">
      <div className="glass-card">
        <div className="input-box">
          <input
            type="text"
            placeholder="Name..."
            value={newName}
            onChange={(event) => {
              setNewName(event.target.value);
            }}
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <button onClick={createUser}>Create User</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
