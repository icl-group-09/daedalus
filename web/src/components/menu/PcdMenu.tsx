import './PcdMenu.css'
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

type PcdMenuProps = {
  pcd: string;
  changePCD: (newPCD: string) => void;
  className: string;
};

const PcdMenu = ({ pcd, changePCD, className }: PcdMenuProps) => {
  const handleChange = (event: string | null, e: React.SyntheticEvent<unknown>) => {
    changePCD(event!);
  };

  var pcdList = ["online", "Rf10", "frame_00023"];

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
