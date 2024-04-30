import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Loginpage, currUser } from "./Loginpage";
import { Homepage } from "./Homepage";

import "./style.css";
import { Aboutpage } from "./Aboutpage";
import { Contactpage } from "./Contactpage";
import { Librarypage } from "./Librarypage";
import Userpage from "./Userpage";

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
              element={
                !isUser ? (
                  <Loginpage
                    updateUserText={(uText) => setUserText(uText)}
                    logUser={() => setIsUser(true)}
                  />
                ) : (
                  <Userpage />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
