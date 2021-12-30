import React from "react";
import { Dispatch, SetStateAction } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { useEffect } from "react";


type PcdMenuProps = {
  pcd: string;
  setPcd: Dispatch<SetStateAction<string>>;
};

const PcdMenu = ({ pcd, setPcd }: PcdMenuProps) => {
  const handleChange = async (event: SelectChangeEvent) => {
    setPcd(event.target.value as string);
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



  const menuStyle = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  const menuColor = {
    background: "white"
  } as const;

  return (
    <div style={menuStyle}>
      <div style={menuColor}>
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        {/* <InputLabel id="demo-simple-select-label">PCD</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={pcd}
          label="Age"
          onChange={handleChange}
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
