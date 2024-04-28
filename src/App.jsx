import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Loginpage, currUser } from "./Loginpage";
import { Homepage } from "./Homepage";

import "./style.css";
import { Aboutpage } from "./Aboutpage";
import { Contactpage } from "./Contactpage";
import { Librarypage } from "./Librarypage";
import UserPage from "./UserPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="books" element={<Librarypage />} />
            <Route path="about" element={<Aboutpage />} />
            <Route path="contact" element={<Contactpage />} />
            <Route
              path="login"
              element={currUser === "" ? <Loginpage /> : <UserPage />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
