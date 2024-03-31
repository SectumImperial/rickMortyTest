import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./upToButton.module.scss";
import { FC } from "react";

export const UpToButton: FC = () => {
  return (
    <div className={styles.button}>
      <KeyboardArrowUpIcon />
    </div>
  );
};
