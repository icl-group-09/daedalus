import React from "react";
import "./App.css";
import { useState, createContext } from "react";
import PcdMenu from "./components/menu/PcdMenu";
import Slider from "react-input-slider";
import Upload from "./components/pages/Upload"
import Welcome from "./components/pages/Welcome";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

export const EnableGPUContext = createContext(true);

function App() {
  // These are here just for the demo. Will be removed
  const [pcd, setPcd] = useState("online");
  const [pointSize, setPointSize] = useState(0.003);

  (window as any).setPcd = (pcdName: string) => {
    setPcd(pcdName);
  };

  return (
    <Router>
      <div className = "App">
        <div>
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
        <PcdMenu pcd={pcd} setPcd={setPcd} />
        <Slider
          axis="x"
          xmax={0.1}
          xstep={0.0005}
          xmin={0.001}
          x={pointSize}
          onChange={({ x }) => setPointSize(x)}
        />
      </div>
    </Router>
  );
}


export default App;
