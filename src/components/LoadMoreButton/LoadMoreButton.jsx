import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import styles from "./loadMoreButton.scss";

const LoadMoreButtonStyle = styled(Button)({
  backgroundColor: "#F2F9FE",
  borderColor: "#0063cc",
  color: "#2196F3",
  width: "146px",
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
    color: "white",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
    color: "white",
  },
  "&:focus": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
    color: "white",
  },
});

export function LoadMoreButton() {
  return (
    <LoadMoreButtonStyle
      variant="contained"
      disableRipple
      className={styles.button}
    >
      Load more
    </LoadMoreButtonStyle>
  );
}
