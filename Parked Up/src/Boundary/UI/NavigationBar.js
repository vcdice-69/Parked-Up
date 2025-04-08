import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../Control/Hooks/useLogin"; // Import authentication logic

/**
 * NavigationBar Component
 *
 * This component renders a navigation bar with links to different pages of the app, including Map View,
 * List View, and Favorites. If the user is logged in, it displays a profile icon and a logout button.
 * If the user is not logged in, it shows links for Signup and Login.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.user - The currently logged-in user, or `null` if no user is logged in.
 * 
 * @returns {JSX.Element} The rendered NavigationBar component.
 */
function NavigationBar({ user }) {
  const navigate = useNavigate();
  const { handleLogout } = useLogin();

  return (
    <nav style={styles.nav}>
      <div style={styles.navContent}>
        <h1 style={styles.logo}>Parked Up</h1>
        <ul style={styles.navLinks}>
          <li style={styles.navItem}><Link to="/" style={styles.link}>Map View</Link></li>
          <li style={styles.navItem}><Link to="/list-view" style={styles.link}>List View</Link></li>
          {user && <li style={styles.navItem}><Link to="/favorites" style={styles.link}>Favorites</Link></li>}
          {!user && <li style={styles.navItem}><Link to="/signup" style={styles.link}>Signup</Link></li>}
          {!user && <li style={styles.navItem}><Link to="/login" style={styles.link}>Login</Link></li>}
        </ul>

        <div style={styles.profileSection}>
          {user ? (
            <>
              <img
                src="/Assets/profile-icon.jpg"
                alt="Profile"
                style={styles.profileIcon}
                onClick={() => navigate("/profile")}
              />
              <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

/**
 * The styles for the NavigationBar component.
 */
const styles = {
  nav: {
    width: "100%", // Full width of the screen
    backgroundColor: "#333",
    color: "white",
    padding: "10px 0", // Add padding for top and bottom
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    top: 0,
    left: 0,
    zIndex: 1000, // Ensure it stays above other content
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px", // Max width to keep the content centered
    margin: "0 auto", // Center the content horizontally
    padding: "0 20px", // Add horizontal padding
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    justifyContent: "center", // Center the links
    flex: 1,
  },
  navItem: {
    margin: "0 15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  linkHover: {
    color: "#FFD700",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end", // Align profile section to the right
  },
  profileIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    cursor: "pointer",
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    color: "white",
    border: "none",
    padding: "5px 15px",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
};

export default NavigationBar;
