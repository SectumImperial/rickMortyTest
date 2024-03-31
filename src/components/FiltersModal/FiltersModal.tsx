import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, Modal, Typography } from "@mui/material";
import styles from "./filtersModal.module.scss";
import { AdvancedFiltersButton, SelectField } from "..";

interface ModalDataType {
  label: string;
  items: string[];
}

interface FiltersModalProps {
  modalData: ModalDataType[];
  type: FilterName;
}

type FilterName = "characters" | "episodes" | "locations";

const ApplyButtonStyle = styled(Button)({
  backgroundColor: "#F2F9FE",
  borderColor: "#0063cc",
  color: "#2196F3",
  width: "100%",
  marginTop: "33px",
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

export function FiltersModal(
  { modalData }: FiltersModalProps,
  type: FilterName,
) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div onClick={handleOpen}>
        <AdvancedFiltersButton />
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ bgcolor: "background.paper" }} className={styles.modalBox}>
          <div className={styles.nav}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Filters
            </Typography>
            <div className={styles.closeModal} onClick={handleClose}></div>
          </div>

          <div>
            <ul className={styles.modalList}>
              {modalData.map((item) => (
                <li key={item.label} className={styles.filterItem}>
                  <SelectField
                    label={item.label}
                    items={item.items}
                    filterName={item.label.toLowerCase()}
                    type={type}
                  />
                </li>
              ))}
            </ul>
            <ApplyButtonStyle
              variant="contained"
              disableRipple
              onClick={handleClose}
            >
              Apply
            </ApplyButtonStyle>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
