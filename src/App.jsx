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
import { Reservationlist } from "./adminview/Reservationlist";
import { Masteradmin } from "./Masteradmin";

function App() {
  const [userText, setUserText] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [userId, setUserId] = useState(""); // State to store user ID
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false); // State to store master admin status

  const handleLogin = (userId, role) => {
    setUserId(userId); // Set the user ID after successful login
    setIsUser(true); // Set the user status
    setIsAdmin(role === "admin" || role === "masteradmin");
    setIsMasterAdmin(role === "masteradmin");
  };

  const handleLogout = () => {
    setUserId(""); // Clear the user ID on logout
    setIsUser(false); // Clear the user status
    setIsAdmin(false);
    setIsMasterAdmin(false);
    setUserText("");
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          userText={userText === "" ? "Log In" : userText}
          userId={userId}
          isAdmin={isAdmin}
          isMasterAdmin={isMasterAdmin} // Pass isMasterAdmin to Navbar
        />
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
                ) : isMasterAdmin ? (
                  <Masteradmin handleLogout={handleLogout} />
                ) : isAdmin ? (
                  <Adminpage handleLogout={handleLogout} />
                ) : (
                  <Userpage handleLogout={handleLogout} />
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
            <Route path="reservations" element={<Reservationlist />} />
            <Route
              path="masteradmin"
              element={<Masteradmin handleLogout={handleLogout} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
