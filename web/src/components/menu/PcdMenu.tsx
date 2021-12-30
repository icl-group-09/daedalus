import React from "react";
import { Dispatch, SetStateAction } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropDownButton from 'react-bootstrap/DropDownButton';
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
      <DropDownButton 
      title={pcd}
      onSelect={handleChange}
      >
        {pcdList.map((pcd, i) => {
             return (
               <Dropdown.Item key={i} eventKey={pcd} value={pcd}>
                 {pcd}
               </Dropdown.Item>
             );
           })}
      </DropDownButton>
    </div>
  );
};
export default PcdMenu;
