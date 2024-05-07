
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

function App() {
  const [userText, setUserText] = useState("");
  const [isUser, setIsUser] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar userText={userText === "" ? "Log In" : userText} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="books" element={<Librarypage />} />
            <Route path="about" element={<Aboutpage />} />
            <Route path="contact" element={<Contactpage />} />
            <Route
              path="login"
              element={!isUser ? <Accesspage /> : <Userpage />}
            >
              <Route
                index
                element={
                  <Loginbox
                    updateUserText={(uText) => setUserText(uText)}
                    logUser={() => setIsUser(true)}
                  />
                }
              />
              <Route
                path="log-in"
                element={
                  <Loginbox
                    updateUserText={(uText) => setUserText(uText)}
                    logUser={() => setIsUser(true)}
                  />
                }
              />
              <Route path="sign-up" element={<Signupbox />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
