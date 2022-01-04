import './PcdMenu.css'
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

type PcdMenuProps = {
  pcd: string;
  changePCD: (newPCD: string) => void;
  className: string;
  disabled: boolean;
  pcdList: string[];
};

const PcdMenu = ({ pcd, changePCD, className, disabled, pcdList }: PcdMenuProps) => {
  const handleChange = (event: string | null, e: React.SyntheticEvent<unknown>) => {
    changePCD(event!);
  };

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
