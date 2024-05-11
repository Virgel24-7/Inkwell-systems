import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Homepage } from "./Homepage";
import { Signupbox } from "./Signupbox";

import "./style.css";
import { Aboutpage } from "./Aboutpage";
import { Contactpage } from "./Contactpage";
import { Librarypage } from "./Librarypage";
import { Userpage } from "./UserPage";
import { Accesspage } from "./Accesspage";
import { Loginbox } from "./Loginbox";
import { Adminpage } from "./adminview/Adminpage";
import { Adminlist } from "./adminview/Adminlist";

function App() {
  const [userText, setUserText] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [userId, setUserId] = useState(""); // State to store user ID
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (userId, role) => {
    setUserId(userId); // Set the user ID after successful login
    setIsUser(true); // Set the user status
    setIsAdmin(role === "admin");
  };

  const handleLogout = () => {
    setUserId(""); // Set the user ID after successful login
    setIsUser(false); // Set the user status
    setIsAdmin(false);
    setUserText("");
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          userText={userText === "" ? "Log In" : userText}
          userId={userId}
          isAdmin={isAdmin}
        />
        {/* Pass userId to Navbar */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="books" element={<Librarypage />} />
            <Route path="about" element={<Aboutpage />} />
            <Route path="contact" element={<Contactpage />} />
            <Route
              path="login"
              element={
                !isUser ? (
                  <Accesspage />
                ) : !isAdmin ? (
                  <Userpage handleLogout={handleLogout} />
                ) : (
                  <Adminpage handleLogout={handleLogout} />
                )
              }
            >
              <Route
                index
                element={
                  <Loginbox
                    updateUserText={(uText) => setUserText(uText)}
                    logUser={() => setIsUser(true)}
                    handleLogin={handleLogin} // Pass the callback function to Loginbox
                  />
                }
              />
              <Route
                path="log-in"
                element={
                  <Loginbox
                    updateUserText={(uText) => setUserText(uText)}
                    logUser={() => setIsUser(true)}
                    handleLogin={handleLogin} // Pass the callback function to Loginbox
                  />
                }
              />
              <Route path="sign-up" element={<Signupbox />} />
            </Route>
            <Route path="admin" element={<Adminlist />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
