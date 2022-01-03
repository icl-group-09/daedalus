import React from "react";
import { Dispatch, SetStateAction } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type PcdMenuProps = {
  pcd: string;
  setPcd: Dispatch<SetStateAction<string>>;
};

const PcdMenu = ({ pcd, setPcd }: PcdMenuProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    setPcd(event.target.value as string);
  };

  var pcdList = ["online", "Rf10", "frame_00023"];

  const menuStyle = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  const menuColor = {
    background: "white",
  } as const;

  return (
    <div style={menuStyle}>
      <div style={menuColor}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={pcd}
              onChange={handleChange}
              data-testid="select-menu"
              inputProps ={{"data-testid": "menu-items"}}
            >
              {pcdList.map((pcd, i) => {
                return (
                  <MenuItem key={i} value={pcd}>
                    {pcd}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        </div>
    </div>
  );
};
export default PcdMenu;
