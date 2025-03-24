import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import MapViewComponent from "./Components/MapViewComponent";
import Signup from "./Components/SignUpUI";
import Login from "./Components/LoginUI";
import Favorites from "./Components/FavouritesUI";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <h1>Carpark Finder</h1>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<MapViewComponent />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
