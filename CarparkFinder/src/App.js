import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import "./App.css";
import MapViewComponent from "./Components/MapViewComponent";
import ListView from "./Components/ListViewComponent";
import Signup from "./Components/SignUpUI";
import LoginUI from "./Components/LoginUI";
import Favorites from "./Components/FavouritesUI";
import ManageProfile from "./Components/ManageProfileUI";
import { useLogin } from "./Components/useLogin";

function ProfileIcon() {
  const navigate = useNavigate();
  const { user, handleLogout } = useLogin();

  return (
    <div>
      {user ? (
        <>
          <img
            src="/Assets/profile-icon.jpg"
            alt="Profile"
            className="profile-icon"
            onClick={() => navigate("/profile")}
          />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={() => navigate("/login")}>Login</button>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <h1>Carpark Finder</h1>
          <ul className="nav-links">
            <li><Link to="/">Map View</Link></li>
            <li><Link to="/list-view">List View</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
          <ProfileIcon />
        </nav>

        <Routes>
          <Route path="/" element={<MapViewComponent />} />
          <Route path="/list-view" element={<ListView />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginUI />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<ManageProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;