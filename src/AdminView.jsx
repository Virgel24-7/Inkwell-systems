import React, { useState, useEffect } from "react";
import "./App.css";
import { db, auth } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

function AdminView() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    // Validate name and email
    if (!newName || !email) {
      setError("Name and email are required.");
      return;
    }

    // Create user account with email and password
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Add user data to Firestore
      await addDoc(usersCollectionRef, {
        name: newName,
        age: Number(newAge),
        userId: user.uid, // Store the user ID for reference
      });

      // Reset input fields
      setNewName("");
      setNewAge("");
      setEmail("");
      setPassword("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  return (
    <div className="App">
      <input
        placeholder="Name..."
        value={newName}
        onChange={(event) => {
          setNewName(event.target.value);
        }}
        style={{ color: "white", backgroundColor: "black" }} // Set text color to white and background color to black
      />
      <input
        type="number"
        placeholder="Age..."
        value={newAge}
        onChange={(event) => {
          setNewAge(event.target.value);
        }}
        style={{ color: "white", backgroundColor: "black" }} // Set text color to white and background color to black
      />
      <input
        type="email"
        placeholder="Email..."
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        style={{ color: "white", backgroundColor: "black" }} // Set text color to white and background color to black
      />
      <input
        type="password"
        placeholder="Password..."
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        style={{ color: "white", backgroundColor: "black" }} // Set text color to white and background color to black
      />
      <button onClick={createUser} style={{ color: "white" }}> Create User</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h1 style={{ color: "white" }}>Name: {user.name}</h1>
            <h1 style={{ color: "white" }}>Age: {user.age}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default AdminView;
