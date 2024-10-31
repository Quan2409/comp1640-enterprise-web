import styled from "@emotion/styled";
import { Box, Button, Modal, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "20px",
  p: 4,
  width: "560px",
  height: "content",
};

const StyleButton = styled(Button)({
  height: "40px",
  width: "100px",
  marginTop: "50px",
});
export const ConfirmDelete = (props) => {
  const { open, handleClose, confirmDelete } = props;
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" align="center" fontSize="30px" color="error">
          Are you sure you want to delete ?
        </Typography>
        <Box display="flex" justifyContent="space-evenly">
          <StyleButton
            variant="contained"
            size="small"
            onClick={confirmDelete}
            sx={{ backgroundColor: "#757575" }}
          >
            Yes
          </StyleButton>
          <StyleButton
            variant="contained"
            size="small"
            onClick={handleClose}
            color="primary"
          >
            No
          </StyleButton>
        </Box>
      </Box>
    </Modal>
  );
};
