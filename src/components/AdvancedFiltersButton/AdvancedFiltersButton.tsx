import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FC } from "react";

export const AdvancedFiltersButton: FC = () => {
  return (
    <Button
      variant="contained"
      startIcon={
        <FilterListIcon sx={{ color: "#0000008A", alignSelf: "self-start" }} />
      }
      sx={{
        backgroundColor: "#E3F2FD",
        color: "#2196F3",
        "&:hover": {
          backgroundColor: "#AEAEAE",
        },
        borderRadius: "4px",
        padding: "10px 20px",
        textTransform: "uppercase",
        boxShadow: "none",
        width: "100%",
      }}
    >
      Advanced Filters
    </Button>
  );
};
