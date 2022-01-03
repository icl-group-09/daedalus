import './PcdMenu.css'
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from "react";
import { useEffect } from "react";

type PcdMenuProps = {
  pcd: string;
  changePCD: (newPCD: string) => void;
  className: string;
};

const PcdMenu = ({ pcd, changePCD, className }: PcdMenuProps) => {
  const handleChange = (event: string | null, e: React.SyntheticEvent<unknown>) => {
    changePCD(event!);
  };


  const[pcdList, setPcdList] = useState<string[]>([]);

  const loadInitialPcdList = async() => {
    const response = await fetch(`/getFileNames`,
      {
        method: 'GET',
        headers: { accept: "application/json" }
      })

      if (response.ok){
        var json_names = await (response.json())
        var names = json_names["body"]
          .split(",")
          .filter((name : string) => {return name.endsWith(".pcd")})
          .map((name : string) => {return name.replace(/\.[^/.]+$/, "")})
        setPcdList(names)
      }
    }

  useEffect(() => {
    loadInitialPcdList()
  },[])



  return (
    <div>
      <Dropdown onSelect={handleChange} className={className}>
        <Dropdown.Toggle variant="dark" className={"w-100 menu-button"}>
          {pcd}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {pcdList.map((pcd, i) => {
             return (
               <Dropdown.Item key={i} eventKey={pcd} value={pcd}>
                 {pcd}
               </Dropdown.Item>
             );
           })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default PcdMenu;
