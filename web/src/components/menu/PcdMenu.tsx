import './PcdMenu.css'
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useState, useEffect } from "react";

type PcdMenuProps = {
  pcd: string;
  changePCD: (newPCD: string) => void;
  className: string;
  disabled: boolean;
};

const PcdMenu = ({ pcd, changePCD, className, disabled }: PcdMenuProps) => {
  const handleChange = (event: string | null, e: React.SyntheticEvent<unknown>) => {
    changePCD(event!);
  };


  const[pcdList, setPcdList] = useState<string[]>([]);

  
  const testFunc = ((input: RequestInfo, init?: RequestInit | undefined) => { return new Promise<Response>((resolve, reject) => {}); })

  let fetchFunc = testFunc;
  try {
    fetchFunc = fetch;
  } catch (e) {
    fetchFunc = testFunc;
  }

  useEffect(() => {
    fetchFunc(`/getFileNames`,
      {
        method: 'GET',
        headers: { accept: "application/json" }
      }).then((response) => response.json())
      .then((json_names)=> {
        var names = json_names["body"]
          .split(",")
          .filter((name : string) => {return name.endsWith(".pcd")})
          .map((name : string) => {return name.replace(/\.[^/.]+$/, "")})
         setPcdList(names)
      }).catch((error) => {
          console.log('Error: ', error)
      })
  }, [fetchFunc])

  return (
    <div>
      <Dropdown onSelect={handleChange} className={className}>
        <Dropdown.Toggle variant="dark" disabled={disabled} className={"w-100 menu-button"}>
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
