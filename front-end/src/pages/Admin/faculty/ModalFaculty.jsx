import styled from "@emotion/styled";
import { Box, Button, InputBase, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createFaculty, updateFaculty } from "../../../services/AdminService";
import _ from "lodash";
import { toast } from "react-toastify";
import * as Yup from "yup";

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

const StyleInputBase = styled(InputBase)({
  padding: "0 15px",
  width: "400px",
  height: "55px",
  borderRadius: "10px",
  border: "2px solid #5FA6E3",
  color: "black",
  margin: "5px",
});

const StyleButton = styled(Button)({
  height: "35px",
  marginTop: "20px",
});

const ModalFaculty = (props) => {
  const { open, onHide, action, dataModal, onSuccess, isDuplicate } = props;
  const date = new Date();
  const defaultFaculty = {
    facultyName: "",
    __v: 0,
    createdAt: date,
    updateAt: date,
  };
  const [faculty, setFaculty] = useState(defaultFaculty);

  const defaultError = {
    facultyName: "",
  };
  const [error, setError] = useState(defaultError);

  const validationSchema = Yup.object({
    facultyName: Yup.string().required("Faculty Name is Required"),
  });

  const handleInputChange = (value, name) => {
    let _faculty = _.cloneDeep(faculty);
    _faculty[name] = value;
    setFaculty(_faculty);
  };

  const handleConfirmFaculty = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(faculty, { abortEarly: false });

      const checkDuplicate = isDuplicate(faculty.facultyName);
      if (checkDuplicate) {
        action === "Create"
          ? setError({ facultyName: "Faculty Name already exists!!!!" })
          : setError({
              facultyName:
                "Faculty Name already exists. Please change the other Faculty Name!!!",
            });
        return;
      }

      let res =
        action === "Create"
          ? await createFaculty(faculty)
          : await updateFaculty(faculty, faculty.facultyId);
      if (res.data) {
        onHide();
        setFaculty(defaultFaculty);
        onSuccess();
        action === "Create"
          ? toast.success("Create Faculty successful!!", {
              position: "top-right",
            })
          : toast.success("Update Faculty successful!!", {
              position: "top-right",
            });
      } else {
        toast.error("Oh, it didn't work. Please try again later!!!", {
          position: "top-right",
        });
      }
    } catch (error) {
      if (error.inner) {
        const newError = {};
        error.inner.forEach((err) => {
          newError[err.path] = err.message;
        });
        setError(newError);
      } else {
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setFaculty(defaultFaculty);
    setError(defaultError);
    onHide();
  };

  useEffect(() => {
    if (action === "Update") {
      setFaculty(dataModal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataModal]);

  return (
    <>
      <Modal open={open} onClose={onHide}>
        <Box sx={style}>
          <Typography
            variant="h5"
            align="center"
            color="#0C28BB"
            fontSize="30px"
          >
            <span>
              {action === "Create" ? "Create Faculty" : "Update Faculty"}
            </span>
          </Typography>
          <Box align="center" mt="20px">
            <StyleInputBase
              type="text"
              placeholder="Faculty Name"
              value={faculty.facultyName}
              onChange={(e) => handleInputChange(e.target.value, "facultyName")}
              required
            />
            {error.facultyName && (
              <Typography variant="body2" color="error">
                {error.facultyName}
              </Typography>
            )}
          </Box>
          <Box display="flex" justifyContent="space-evenly">
            <StyleButton
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => handleCancel()}
            >
              Cancel
            </StyleButton>
            <StyleButton
              variant="contained"
              size="small"
              onClick={(e) => handleConfirmFaculty(e)}
              color="primary"
            >
              Save
            </StyleButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalFaculty;
