import { useId, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export function SelectField({ props }) {
  const idSelect = useId();
  const idLabel = useId();
  const { label, items } = props;

  const [item, setItem] = useState("");

  const menuItems = items.map((menuItem) => (
    <MenuItem value={menuItem} key={menuItem}>{menuItem}</MenuItem>
  ));

  const handleChange = (event) => {
    setItem(event.target.value);
  };

  return (
      <FormControl
        variant="outlined"
        sx={{
          m: 1,
          minWidth: 240,
          margin: 0,
          borderColor: "#00000061",
          "&:hover": {
            borderColor: "#00000080",
          },
        }}
      >
        <InputLabel
          id={idLabel}
          sx={{
            "&:hover": {
              color: "#00000080",
            },
            color: "#00000099",
          }}
        >
          {label}
        </InputLabel>
        <Select
          labelId={idLabel}
          id={idSelect}
          value={item}
          onChange={handleChange}
          autoWidth
          label={label}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {menuItems}
        </Select>
      </FormControl>
  );
}
