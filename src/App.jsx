import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./Navbar";
import { Homepage } from "./Homepage";
import { Signupbox } from "./Signupbox";
import "./style.css";
import { Aboutpage } from "./Aboutpage";
import { Librarypage } from "./Librarypage";
import { Userpage } from "./UserPage";
import { Accesspage } from "./Accesspage";
import { Loginbox } from "./Loginbox";
import { Masteradmin } from "./adminview/Masteradmin";
import { Checkoutspage } from "./adminview/Checkoutspage";

export let currentUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};
export const setCurrentUser = (user) => {
  currentUser = user;
};

function App() {
  const [userText, setUserText] = useState("");
  const [user, setUser] = useState(currentUser);

  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("user", JSON.stringify(user));
    }

    setCurrentUser(user ? user : null);
    setUserText(currentUser ? user.name : "");
    setRole(currentUser ? user.role : "");
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Navbar
          userText={userText === "" ? "Log in" : userText}
          setUser={setUser}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage user={user} />} />
            <Route path="books" element={<Librarypage />} />
            <Route path="about" element={<Aboutpage />} />
            <Route
              path={userText === "" ? "login" : `/${userText.toLowerCase()}`}
              element={role !== "user" ? <Accesspage /> : <Userpage />}
            >
              <Route index element={<Loginbox setUser={setUser} />} />
              <Route path="log-in" element={<Loginbox setUser={setUser} />} />
              <Route path="sign-up" element={<Signupbox />} />
            </Route>
            <Route path="checkouts" element={<Checkoutspage />} />
            <Route path="masteradmin" element={<Masteradmin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
