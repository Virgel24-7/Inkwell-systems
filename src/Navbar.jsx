import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const Navbar = (props) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to store admin status

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(usersCollectionRef, where("userId", "==", props.userId))
        );
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setIsAdmin(userData.role === "admin");
        });
      } catch (error) {
        console.log("Error fetching user role:", error);
      }
    };

    if (props.userId) {
      fetchUserRole();
    }
  }, [props.userId]);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <nav>
      <img src="src/assets/logo.png" alt="logo" />

      <input
        type="checkbox"
        id="sidebar-active"
        checked={sidebarActive}
        onChange={toggleSidebar}
      />
      <label htmlFor="sidebar-active" className="open-sidebar-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32"
          viewBox="0 -960 960 960"
          width="32"
        >
          <path
            fill="#FFFFFF"
            d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
          />
        </svg>
      </label>

      <div
        className={sidebarActive ? "links-container active" : "links-container"}
      >
        <label htmlFor="sidebar-active" className="close-sidebar-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 -960 960 960"
            width="32"
          >
            <path
              fill="#FFFFFF"
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>
        </label>

        <Link className="home-link" to="/">
          Home
        </Link>
        <Link className="book-link" to="/books">
          Books
        </Link>
        <Link className="about-link" to="/about">
          About us
        </Link>
        <Link className="contact-link" to="/contact">
          Contact
        </Link>
        <Link className="login-link" to="/login">
          {props.userText}
        </Link>
        {isAdmin && ( // Render admin button if user is admin
          <Link className="admin-link" to="/admin">
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
