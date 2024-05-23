import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config"; // Import the Firestore instance
import { deleteField } from "firebase/firestore/lite";

export const Masteradmin = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const allUsers = usersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Separate users into admins and non-admin users
      const adminsData = allUsers.filter((user) => user.role === "admin");
      const usersData = allUsers.filter(
        (user) => user.role !== "admin" && user.role !== "masteradmin"
      );

      setAdmins(adminsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const removeUser = async (userId) => {
    if (window.confirm("Are you sure about this?")) {
      try {
        //if admin(change role to user, add reserves , and borrowed empty array)
        const uTodeldoc = doc(db, "users", userId);
        const utoDelO = (await getDoc(uTodeldoc)).data();
        if (utoDelO.role === "admin") {
          const newField1 = { role: "user", reserves: [], borrowed: [] };
          updateDoc(uTodeldoc, newField1);
          alert("Admin successfully changed to user.");

          fetchUsers();
          return;
        }

        if (utoDelO.reserves.length > 0 || utoDelO.borrowed.length > 0) {
          alert("Cannot delete user. User is currently checking out book/s.");
          return;
        }

        if (utoDelO.returned) {
          if (utoDelO.returned.length > 0) {
            utoDelO.returned.forEach(async (ret) => {
              const retToDel = doc(db, "history", ret);
              await deleteDoc(retToDel);
            });
          }
        }

        await deleteDoc(doc(db, "users", userId));
        alert("User deleted successfully.");

        fetchUsers();
        return;
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Admin</h1>
      <ul className="user-list">
        {admins.map((admin, index) => (
          <li key={index} className="user-item">
            <span>{`Name: ${admin.name}`}</span>
            <span>{`Role: ${admin.role}`}</span>
            <button
              className="remove-button"
              onClick={() => removeUser(admin.id)}
            >
              Change to user
            </button>
          </li>
        ))}
      </ul>

      <h1 className="title">Users</h1>
      <ul className="user-list">
        {users.map((user, index) => (
          <li key={index} className="user-item">
            <span>{`Name: ${user.name}`}</span>
            <span>{`Role: ${user.role}`}</span>
            <button
              className="remove-button"
              onClick={() => removeUser(user.id)}
            >
              Remove
            </button>
            <button
              className="remove-button"
              onClick={() => changeToAdmin(user.id)}
            >
              Change to admin
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  async function changeToAdmin(userId) {
    //if user has reserves, borrows, or returns, return
    const uTochangedoc = doc(db, "users", userId);
    const utoco = (await getDoc(uTochangedoc)).data();

    if (
      utoco.reserves.length > 0 ||
      utoco.borrowed.length > 0 ||
      (utoco.returned && utoco.returned.length > 0)
    ) {
      alert("Cannot promote user. User has checkout history");
      return;
    }

    const newField2 = {
      role: "admin",
    };
    updateDoc(uTochangedoc, newField2);

    fetchUsers();
    alert("User promoted successfully");
  }
};
