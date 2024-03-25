import { useId, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import styles from "./selectField.module.scss";

export function SelectField({ props }) {
  const { label, items, filterName, action } = props;
  const dispatch = useDispatch();
  const idSelect = useId();
  const idLabel = useId();

  const filters = JSON.parse(localStorage.getItem("characterFilters")) || {};
  const [item, setItem] = useState(filters[filterName] || "");

  const handleChange = (event) => {
    setItem(event.target.value);
  };

  useEffect(() => {
    const currentFilters =
      JSON.parse(localStorage.getItem("characterFilters")) || {};
    currentFilters[filterName] = item;
    localStorage.setItem("characterFilters", JSON.stringify(currentFilters));
    dispatch(action({ filterName, value: item }));
  }, [item, filterName, dispatch, action]);

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
        labelId={idLabel}
        id={idSelect}
        value={item}
        onChange={handleChange}
        label={label}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {items.map((menuItem) => (
          <MenuItem value={menuItem} key={menuItem}>
            {menuItem}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
