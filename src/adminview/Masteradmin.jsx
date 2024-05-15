import React, { useState, useEffect } from "react";
import { db } from "../../firebase-config"; 
import { useNavigate } from "react-router-dom";

export const Masteradmin = (props) => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersByRole = async (role) => {
      try {
        const usersSnapshot = await db.collection("users").where("role", "==", role).get();
        const userData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return userData;
      } catch (error) {
        console.error(`Error fetching ${role}:`, error);
        return [];
      }
    };

    const fetchUsers = async () => {
      const adminData = await fetchUsersByRole("admin");
      const userData = await fetchUsersByRole("user");
      setAdmins(adminData);
      setUsers(userData);
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await db.collection("users").doc(id).delete();
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/");
    alert("Signed out successfully");
  };

  return (
    <div style={{ color: "white" }}>
      <h1>Master Admin Page</h1>
      <div>Welcome, Master Admin! Here you can manage everything.</div>
      <button onClick={handleLogout}>LOG OUT</button>

      <h2>Admins:</h2>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>{admin.name}</li>
        ))}
      </ul>

      <h2>Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Masteradmin;
