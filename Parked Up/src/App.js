import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import MapViewComponent from "./Boundary/Map/CarparkMapContainer";
import ListViewComponent from "./Boundary/List/ListViewComponent";
import Signup from "./Boundary/UI/SignupPage";
import LoginUI from "./Boundary/UI/LoginPage";
import Favorites from "./Boundary/UI/FavouritesPage";
import ManageProfile from "./Boundary/UI/ManageProfilePage";
import { useLogin } from "./Control/Hooks/useLogin";
import NavigationBar from "./Boundary/UI/NavigationBar"; // NEW COMPONENT

function App() {
  const { user } = useLogin();

  return (
    <Router>
      <div className="App">
        <NavigationBar user={user} /> {/* Renders the Navigation Bar */}
        
        <Routes>
          <Route path="/" element={<MapViewComponent user={user} />} />
          <Route path="/list-view" element={<ListViewComponent user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginUI />} />
          <Route path="/favorites" element={<Favorites user={user} />} />
          <Route path="/profile" element={<ManageProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
