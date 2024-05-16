import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; 
import { db } from "./firebase-config"; // Import the Firestore instance
import './style.css'; // Import your CSS file

export const Masteradmin = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((user) => user.role !== "masteradmin"); // Filter out masteradmin users
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const removeUser = async (userId) => {
    if (window.confirm("Are you sure about deleting this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">All Users</h1>
      <ul className="user-list">
        {users.map((user, index) => (
          <li key={index} className="user-item">
            <span>{`Name: ${user.name}`}</span>
            <span>{`Role: ${user.role}`}</span>
            <button className="remove-button" onClick={() => removeUser(user.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
