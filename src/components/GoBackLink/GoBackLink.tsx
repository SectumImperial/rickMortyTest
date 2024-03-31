import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./goBackLink.module.scss";

interface GoBackLinkProps {
  url: string;
}

export const GoBackLink = ({ url }: GoBackLinkProps) => (
  <Link to={url} className={styles.link}>
    <ArrowBackIcon />
    Go back
  </Link>
);
