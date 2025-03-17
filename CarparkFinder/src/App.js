import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import GoogleMapComponent from "./GoogleMapComponent";
import Signup from "./SignUpUI";
import Login from "./LoginUI";
import Favorites from "./FavouritesUI";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <h1>Carpark Finder</h1>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<GoogleMapComponent />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
