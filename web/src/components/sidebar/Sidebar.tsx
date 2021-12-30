import React from "react";
import PcdMenu from "../menu/PcdMenu";
import Slider from "react-input-slider";
import { RenderType } from "../gpu/RenderType";
import { useState } from "react";

import "./Sidebar.css"

type SideBarProps = {
    setPointCloudType: React.Dispatch<React.SetStateAction<RenderType>>;
    r: {
        X: number;
        Y: number;
        Z: number;
    }
    setR: React.Dispatch<React.SetStateAction<{
    X: number;
    Y: number;
    Z: number;
        }>>;
    pointSize: number;
    setPointSize: React.Dispatch<React.SetStateAction<number>>;
}


function Sidebar({setPointCloudType, r, setR, pointSize, setPointSize}: SideBarProps){

    const ClickPCD = () => {
      setPointCloudType(RenderType.PCD);
    };
  
    const ClickHM = () => {
      setPointCloudType(RenderType.HM);
    };

    const rotateX = () => {
      setR({X: Math.PI/2, Y: 0, Z: 0})
    }

    const rotateXBack = () => {
      setR({X: -Math.PI/2, Y: 0, Z: 0})
    }

    const rotateY = () => {
      setR( {X: 0, Y: Math.PI/2, Z: 0})
    }

    const rotateYBack = () => {
      setR( {X: 0, Y: -Math.PI/2, Z: 0})
    }
  
    const cssCenter = {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    } as const;
  

    const [menuVisibility, setMenuVisibility] = useState(true);
    const [visibilityClass, setVisibilityClass] = useState("hide")

    const toggleMenu = () => {
        setMenuVisibility(!menuVisibility)
        if (menuVisibility) {
            setVisibilityClass("show")
        } else {
            setVisibilityClass("hide")
        }
    };
  
  
    return (
        <div id = "sidebar" className={visibilityClass}>
            <button id="showButton" onClick={toggleMenu}>Tools</button>
            <div id="toolsContainer">
                <div id="tools"> 
                    <div>
                        <button onClick={ClickPCD}>Show Point Cloud</button>
                        <button onClick={ClickHM}>Show Heat Map</button>
                    </div>
                    <p> Rotate X: {Math.round(r.X / Math.PI * 180)} </p>
                    <Slider
                        axis="x"
                        xmax={2 * Math.PI}
                        xstep={0.0005}
                        xmin={0.0}
                        x={r.X}
                        onChange={({x}) => setR((oldR) => ({X: x, Y: oldR.Y, Z: oldR.Z}))}
                    />
                    <p> Rotate Y: {Math.round(r.Y / Math.PI * 180)} </p>
                    <Slider
                        axis="x"
                        xmax={2 * Math.PI}
                        xstep={0.0005}
                        xmin={0.0}
                        x={r.Y}
                        onChange={({x}) => setR((oldR) => ({X: oldR.X, Y: x, Z: oldR.Z}))}
                    />
                    <p> Point Size: {pointSize}</p>
                    <Slider
                        axis="x"
                        xmax={0.1}
                        xstep={0.0005}
                        xmin={0.001}
                        x={pointSize}
                        onChange={({ x }) => setPointSize(x)}
                    />
                </div>
            </div>
        </div>
    );
 
 }

 export default Sidebar;