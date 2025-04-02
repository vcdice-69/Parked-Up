import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../Control/useLogin"; // Import authentication logic

function NavigationBar({ user }) {
  const navigate = useNavigate();
  const { handleLogout } = useLogin();

  return (
    <nav>
      <h1>Carpark Finder</h1>
      <ul className="nav-links">
        <li><Link to="/">Map View</Link></li>
        <li><Link to="/list-view">List View</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        {!user && <li><Link to="/signup">Signup</Link></li>}
        {!user && <li><Link to="/login">Login</Link></li>}
      </ul>

      <div className="profile-section">
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
        ) : null}
      </div>
    </nav>
  );
}

export default NavigationBar;
