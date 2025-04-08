/**
 * App Component
 *
 * This is the main entry point for the application. It sets up routing using React Router and renders 
 * the appropriate page based on the current route. The app includes a navigation bar, map view, list view,
 * and pages for user management such as signup, login, and profile settings.
 *
 * @component
 * @example
 * // Usage of the App component which includes routing and dynamic content based on login state
 * <App />
 */

import React from "react"; // Import React to build components
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router components for routing functionality
import "./App.css"; // Import custom styles for the app
import MapViewComponent from "./Boundary/Map/CarparkMapContainer"; // Import the map view component
import ListViewComponent from "./Boundary/List/ListViewComponent"; // Import the list view component for carparks
import Signup from "./Boundary/UI/SignupPage"; // Import the signup page component
import LoginUI from "./Boundary/UI/LoginPage"; // Import the login page component
import Favorites from "./Boundary/UI/FavouritesPage"; // Import the favorites page component
import ManageProfile from "./Boundary/UI/ManageProfilePage"; // Import the manage profile page component
import { useLogin } from "./Control/Hooks/useLogin"; // Import custom hook to manage login state
import NavigationBar from "./Boundary/UI/NavigationBar"; // Import navigation bar component for top-level navigation

function App() {
  // Retrieve the user data from the useLogin hook
  const { user } = useLogin();

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <NavigationBar user={user} /> {/* Pass the user to NavigationBar for dynamic rendering based on login status */}
        
        {/* Define routing for different views */}
        <Routes>
          <Route path="/" element={<MapViewComponent user={user} />} /> {/* Map view route */}
          <Route path="/list-view" element={<ListViewComponent user={user} />} /> {/* List view route */}
          <Route path="/signup" element={<Signup />} /> {/* Signup route */}
          <Route path="/login" element={<LoginUI />} /> {/* Login route */}
          <Route path="/favorites" element={<Favorites user={user} />} /> {/* Favorites route */}
          <Route path="/profile" element={<ManageProfile />} /> {/* Profile management route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export the App component as default
