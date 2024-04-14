import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Loginpage } from "./Loginpage";
import { Homepage } from "./Homepage";
import "./style.css";
import { Bookpage } from "./Bookpage";
import { Aboutpage } from "./Aboutpage";
import { Contactpage } from "./Contactpage";
import { AdminView }  from "./AdminView";
 // Update the import path

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="books" element={<Bookpage />} />
            <Route path="about" element={<Aboutpage />} />
            <Route path="contact" element={<Contactpage />} />
            <Route path="login" element={<Loginpage />} />
            <Route path="admin" element={<AdminView />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
