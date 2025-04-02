import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import MapViewComponent from "./Boundary/Map/MapViewComponent";
import ListViewComponent from "./Boundary/ListViewComponent";
import Signup from "./Boundary/UI/SignUpUI";
import LoginUI from "./Boundary/UI/LoginUI";
import Favorites from "./Boundary/UI/FavouritesUI";
import ManageProfile from "./Boundary/UI/ManageProfileUI";
import { useLogin } from "./Control/useLogin";
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
