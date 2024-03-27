import { useId, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import styles from "./selectField.module.scss";
import { useFilters } from '../../hooks/useFilters'; 

export function SelectField({ label, items = [], filterName, type }) {
  const { updateFilter } = useFilters(type); 
  const [selectedItem, setSelectedItem] = useState('');

  const idSelect = useId();
  const idLabel = useId();

  const filters = JSON.parse(localStorage.getItem("characterFilters")) || {};
  const [item, setItem] = useState(filters[filterName] || "");

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem(`${type}Filters`)) || {};
    if(savedFilters[filterName]) {
      setSelectedItem(savedFilters[filterName]);
    }
  }, [filterName, type]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedItem(value);
    updateFilter(filterName, value);
  };

  return (
    <FormControl
      className={styles.select}
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
        value={selectedItem}
        onChange={handleChange}
        label={label}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {items.map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
