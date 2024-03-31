import SearchIcon from "@mui/icons-material/Search";
import styles from "./filterInput.module.scss";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import { useFilters } from "../../hooks/useFilters";

interface FilterInputProps {
  text?: string;
  filterName: string;
  type: "characters" | "locations" | "episodes";
}

export function FilterInput({
  text = "Filter by name...",
  filterName,
  type = "characters",
}: FilterInputProps) {
  const { updateFilter, getCurrentFilters } = useFilters(type);
  const filters = getCurrentFilters(type);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter(filterName, event.target.value);
  };

  return (
    <FormControl className={styles.filter}>
      <TextField
        className={styles.textField}
        placeholder={text}
        variant="outlined"
        value={filters[filterName] || ""}
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
