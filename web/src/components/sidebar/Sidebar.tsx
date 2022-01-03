import React from "react";
import PcdMenu from "../menu/PcdMenu";
import Slider from "react-input-slider";
import { RenderType } from "../gpu/RenderType";
import { RotationDir } from "../gpu/Rotate";
import { useState } from "react";
import Switch from "react-switch";

import "./Sidebar.css"

type SideBarProps = {
    pointCloudType: RenderType;
    setPointCloudType: React.Dispatch<React.SetStateAction<RenderType>>;
    r: RotationDir;
    setR: React.Dispatch<React.SetStateAction<RotationDir>>;
    pointSize: number;
    setPointSize: React.Dispatch<React.SetStateAction<number>>;
}


function Sidebar({pointCloudType, setPointCloudType, r, setR, pointSize, setPointSize}: SideBarProps){

    const [menuVisibility, setMenuVisibility] = useState(true);
    const [visibilityClass, setVisibilityClass] = useState("hide")
  
    const ClickHM = () => {
        if (pointCloudType == RenderType.HM) {
            setPointCloudType(RenderType.PCD);
        } else {
            setPointCloudType(RenderType.HM);
        }
      
    };


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
                <div id="tools" className={visibilityClass}>
                    
                    <h5> Toggle Heat Map </h5> 
                    <label>
                        <Switch onChange={ClickHM} checked={pointCloudType === RenderType.HM} onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={20}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={15}
                        width={35}/>
                    </label>
                    
                    <h5> Rotation </h5>
                    <span> x: {Math.round(r.X / Math.PI * 180)} </span><br></br>
                    <Slider
                        axis="x"
                        xmax={2 * Math.PI}
                        xstep={0.0005}
                        xmin={0.0}
                        x={r.X}
                        onChange={({x}) => setR((oldR) => ({X: x, Y: oldR.Y, Z: oldR.Z}))}
                    /><br></br>
                    <span> y: {Math.round(r.Y / Math.PI * 180)} </span><br></br>
                    <Slider
                        axis="x"
                        xmax={2 * Math.PI}
                        xstep={0.0005}
                        xmin={0.0}
                        x={r.Y}
                        onChange={({x}) => setR((oldR) => ({X: oldR.X, Y: x, Z: oldR.Z}))}
                    /><br></br>
                    <span> Point Size: {Math.round(pointSize * 10000) / 10000}</span>
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