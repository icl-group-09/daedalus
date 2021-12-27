import React from "react";
import "./App.css";
import Upload from "./components/pages/Upload"
import Welcome from "./components/pages/Welcome";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {


  const cssNavBar = {
    position: "absolute",
    width: "30%",
    left: "0px",
    top: "0px",
    color: "white"
  } as const;

  return (
    <Router>
      <div className = "App">

        <div style={cssNavBar}>
          <ul>
            <li>
              <Link to="/">Welcome</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
          </ul>
          </div>
     

        <div className = "content">
          <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/upload" element={<Upload/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;
