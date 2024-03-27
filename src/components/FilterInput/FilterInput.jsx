import SearchIcon from "@mui/icons-material/Search";
import styles from "./filterInput.module.scss";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import { useFilters } from "../../hooks/useFilters";
import { useSelector } from "react-redux";

export function FilterInput({
  text = "Filter by name...",
  filterName,
  action,
  type = "characters",
}) {
  const { updateFilter } = useFilters(type);
  const filters = useSelector(action);

  const handleFilterChange = (event) => {
    updateFilter(filterName, event.target.value);
  };

  return (
    <FormControl className={styles.filter}>
      <TextField
        className={styles.textField}
        placeholder={text}
        variant="outlined"
        value={filters[filterName]}
        onChange={handleFilterChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
}
