import SearchIcon from "@mui/icons-material/Search";
import styles from './filterInput.module.scss'
import { FormControl, InputAdornment, TextField } from "@mui/material";

export function FilterInput({ text = "Filter by name..."}) {
  return (
    <FormControl
      className={styles.filter}
      sx={{
        "&:hover": {
          color: "#00000080",
        },
        color: "#00000099",
      }}
    >
      <TextField
        placeholder={text}
        variant="outlined"
        sx={{
          "&:hover": {
            color: "#00000080",
          },
          color: "#00000099",
        }}
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
