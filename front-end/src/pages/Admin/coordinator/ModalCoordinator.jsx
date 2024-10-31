import styled from "@emotion/styled";
import {
  Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AllAccount,
  AllFaculty,
  createCoordinator,
} from "../../../services/AdminService";
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

const ModalCoordinator = (props) => {
  const { open, action, dataModal, onHide, onSuccess } = props;
  const date = new Date();
  const defaultCoordinator = {
    coordinatorName: "",
    coordinatorAvatar: "",
    facultyData: {
      FacultyName: "",
      FacultyId: "",
    },
    accountData: {
      Email: "",
      AccountId: "",
    },
    __v: 0,
    createdAt: date,
    updateAt: date,
  };

  const defaultError = {
    coordinatorName: "",
  };

  const [coordinator, setCoordinator] = useState(defaultCoordinator);
  const [error, setError] = useState(defaultError);
  const [faculty, setFaculty] = useState([]);
  const [account, setAccount] = useState([]);

  const validationSchema = Yup.object({
    coordinatorName: Yup.string().required("Coordinator Name is required"),
  });

  //Get All Faculty
  useEffect(() => {
    getFaculty();
    getAccount();
  }, []);
  9;
  const getFaculty = async () => {
    let res = await AllFaculty();

    if (res && res.data) {
      setFaculty(res.data);
      if (res.data.length > 0) {
        const { facultyName, facultyId } = res.data[0];
        setCoordinator((prevCoordinator) => ({
          ...prevCoordinator,
          facultyData: {
            FacultyName: facultyName,
            FacultyId: facultyId,
          },
        }));
      }
    }
  };

  const getAccount = async () => {
    let res = await AllAccount();

    if (res && res.data) {
      const coordinatorAccounts = res.data.filter(
        (account) => account.role === "coordinator"
      );
      setAccount(coordinatorAccounts);
      if (coordinatorAccounts.length > 0) {
        const { email, accountId } = coordinatorAccounts[0];
        setCoordinator((prevCoordinator) => ({
          ...prevCoordinator,
          accountData: {
            Email: email,
            AccountId: accountId,
          },
        }));
      }
    }
  };

  const handleInputChange = (value, name) => {
    let _coordinator = _.cloneDeep(coordinator);
    _coordinator[name] = value;
    setCoordinator(_coordinator);
  };

  const handleFacultyChange = (event) => {
    const selectedFacultyId = event.target.value;
    const updatedCoordinator = { ...coordinator };
    updatedCoordinator.facultyData.FacultyId = selectedFacultyId;
    setCoordinator(updatedCoordinator);
  };

  const handleAccountChange = (event) => {
    const selectedAccountId = event.target.value;
    const updatedCoordinator = { ...coordinator };
    updatedCoordinator.accountData.AccountId = selectedAccountId;
    setCoordinator(updatedCoordinator);
  };

  const handleConfirmCoordinator = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(coordinator, { abortEarly: false });

      let res = await createCoordinator(
        coordinator,
        coordinator.facultyData.FacultyId,
        coordinator.accountData.AccountId
      );
      if (res.data) {
        onHide();
        onSuccess();
        const defaultFaculty = faculty.length > 0 ? faculty[0] : {};
        const defaultAccount = account.length > 0 ? account[0] : {};
        setCoordinator({
          ...defaultCoordinator,
          facultyData: {
            FacultyId: defaultFaculty.FacultyId || "",
            FacultyName: defaultFaculty.FacultyName || "",
          },
          accountData: {
            Email: defaultAccount.Email || "",
            AccountId: defaultAccount.AccountId || "",
          },
        });
        toast.success("Create Successfully", {
          position: "top-right",
        });
      } else {
        toast.error("Create fail!", {
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
    setError(defaultError);
    onHide();
  };

  return (
    <>
      <Modal open={open}>
        <Box sx={style}>
          <Typography
            variant="h5"
            align="center"
            color="#0C28BB"
            fontSize="30px"
          >
            <span>Create Coordinator</span>
          </Typography>
          <Box align="center" mt="20px">
            <StyleInputBase
              type="text"
              placeholder="Coordinator Name"
              value={coordinator.coordinatorName}
              onChange={(e) =>
                handleInputChange(e.target.value, "coordinatorName")
              }
            />
            {error.coordinatorName && (
              <Typography variant="body2" color="error">
                {error.coordinatorName}
              </Typography>
            )}
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>Faculty</InputLabel>
                <Select
                  value={
                    coordinator.facultyData
                      ? coordinator.facultyData.FacultyId
                      : ""
                  }
                  onChange={handleFacultyChange}
                  align="left"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                      },
                    },
                  }}
                  required
                  disabled={action === "Create" ? false : true}
                  sx={{
                    borderRadius: "10px",
                    height: "55px",
                    width: "400px",
                  }}
                >
                  {faculty.map((item, index) => {
                    return (
                      <MenuItem
                        key={`coordinator-faculty-${index}`}
                        value={item.facultyId}
                      >
                        {item.facultyName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>Account</InputLabel>
                <Select
                  value={
                    coordinator.accountData
                      ? coordinator.accountData.AccountId
                      : ""
                  }
                  onChange={handleAccountChange}
                  align="left"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                      },
                    },
                  }}
                  required
                  disabled={action === "Create" ? false : true}
                  sx={{
                    borderRadius: "10px",
                    height: "55px",
                    width: "400px",
                  }}
                >
                  {account.map((item, index) => {
                    return (
                      <MenuItem
                        key={`coordinator-account-${index}`}
                        value={item.accountId}
                      >
                        {item.email}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
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
              onClick={(e) => handleConfirmCoordinator(e)}
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

export default ModalCoordinator;
