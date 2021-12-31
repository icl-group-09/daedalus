import React from "react";
import { Dispatch, SetStateAction } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { eventNames } from "cluster";

type PcdMenuProps = {
  pcd: string;
  setPcd: Dispatch<SetStateAction<string>>;
};

const PcdMenu = ({ pcd, setPcd }: PcdMenuProps) => {
  const handleChange = (event: string | null, e: React.SyntheticEvent<unknown>) => {
    setPcd(event!);
  };

  var pcdList = ["online", "Rf10", "frame_00023"];

  return (
    <div>
      <Dropdown onSelect={handleChange}>
        <Dropdown.Toggle variant="dark">
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
