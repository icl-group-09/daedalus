import { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function PcdMenu() {
  const [pcd, setPcd] = useState("online");

  const handleChange = (event: SelectChangeEvent) => {
    setPcd(event.target.value as string);
  };

  var pcdList = ["online", "Rf10", "frame_00023"];

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>PCD</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={pcd}
          label='Age'
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
  );
}
