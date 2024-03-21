import { Modal, Box } from "@mui/material";
import styles from './filtersModal.module.scss'

export const FiltersModal = ({ isOpen, handleClose }) => {
    return (
      <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
{/* FILTERS */}
        <button onClick={handleClose}>Close</button>
      </div>
    );
  };
