import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import styles from './loadMoreButton.scss'

const LoadMoreButtonStyle = styled(Button)({
  boxShadow: "0px 6px 10px 0px #00000024, px 1px 18px 0px #0000001F, 0px 3px 5px 0px #00000033",
  textTransform: "uppercase",
  fontSize: 14,
  padding: "6px 12px",
  lineHeight: 1.5,
  backgroundColor: "#F2F9FE",
  borderColor: "#0063cc",
  color: "#2196F3",
  width: '154',
  height: '36',
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
    color: "white"
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
    color: "white"
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    color: "white"
  },
});

export function LoadMoreButton() {
  return (
    <LoadMoreButtonStyle variant="contained" disableRipple className={styles.button}>
      Load more
    </LoadMoreButtonStyle>
  );
}
