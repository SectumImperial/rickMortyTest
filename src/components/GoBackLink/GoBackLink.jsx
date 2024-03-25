import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./goBackLink.module.scss";

export const GoBackLink = ({ url }) => {
  return (
    <Link to={url} className={styles.link}>
      <ArrowBackIcon />
      Go back
    </Link>
  );
};
