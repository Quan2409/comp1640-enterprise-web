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
  createGuest,
  updateGuest,
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

const ModalGuest = (props) => {
  const { open, action, dataModal, onHide, onSuccess, isDuplicate } = props;
  const date = new Date();
  const defaultGuest = {
    guestName: "",
    guestAvatar: "",
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
    guestName: "",
    accountId: "",
    facultyId: ""
  };

  const [guest, setGuest] = useState(defaultGuest);
  const [faculty, setFaculty] = useState([]);
  const [account, setAccount] = useState([]);
  const [error, setError] = useState(defaultError);

  const validationSchema = Yup.object({
    guestName: Yup.string().required("Guest Name is required!!!"),
  });

  //Get All Faculty
  useEffect(() => {
    getFaculty();
    getAccount();
  }, []);

  const getFaculty = async () => {
    let res = await AllFaculty();

    if (res && res.data) {
      setFaculty(res.data);
      if (res.data.length > 0) {
        const { facultyName, facultyId } = res.data[0];
        setGuest((prevGuest) => ({
          ...prevGuest,
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
      const guestAccounts = res.data.filter(
        (account) => account.role === "guest"
      );
      setAccount(guestAccounts);
      if (guestAccounts.length > 0) {
        const { email, accountId } = guestAccounts[0];
        setGuest((prevGuest) => ({
          ...prevGuest,
          accountData: {
            Email: email,
            AccountId: accountId,
          },
        }));
      }
    }
  };



  const handleInputChange = (value, name) => {
    let _guest = _.cloneDeep(guest);
    _guest[name] = value;
    setGuest(_guest);
  };

  const handleFacultyChange = (event) => {
    const selectedFacultyId = event.target.value;
    const updatedGuest = { ...guest };
    updatedGuest.facultyData.FacultyId = selectedFacultyId;
    setGuest(updatedGuest);
  };

  const handleAccountChange = (event) => {
    const selectedAccountId = event.target.value;
    const updatedGuest = { ...guest };
    updatedGuest.accountData.AccountId = selectedAccountId;
    setGuest(updatedGuest);
  };

  const handleConfirmGuest = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(guest, { abortEarly: false });

      const checkGuestName = isDuplicate(guest.guestName);
      const checkAccount = props.isDuplicateAccount(guest.accountData.AccountId);
      const checkFaculty = props.isDuplicateFaculty(guest.facultyData.FacultyId);

      if (checkAccount) {
        setError({ accountId: "This account has already been used." });
        return;
      }

      
      if (checkFaculty) {
        setError({ facultyId: "This Faculty has been accounted." });
        return;
      }

      if (checkGuestName) {
        action === "Create"
          ? setError({ guestName: "Guest Name already exists!!!!" })
          : setError({
              guestName:
                "Guest Name already exists. Please change the other Guest Name!!!",
            });
        return;
      }

      let res =
        action === "Create"
          ? await createGuest(
              guest,
              guest.facultyData.FacultyId,
              guest.accountData.AccountId
            )
          : await updateGuest(guest, guest.guestId);
      if (res.data) {
        onHide();
        setGuest(defaultGuest);
        onSuccess();
        const defaultFaculty = faculty.length > 0 ? faculty[0] : {};
        const defaultAccount = account.length > 0 ? account[0] : {};
        setGuest({
          ...defaultGuest,
          facultyData: {
            FacultyId: defaultFaculty.FacultyId || "",
            FacultyName: defaultFaculty.FacultyName || "",
          },
          accountData: {
            Email: defaultAccount.Email || "",
            AccountId: defaultAccount.AccountId || "",
          },
        });
        action === "Create"
          ? toast.success("Create Successfully", {
              position: "top-right",
            })
          : toast.success("Update Successfully", {
              position: "top-right",
            });
      } else {
        action === "Create"
          ? toast.error("Create fail!", {
              position: "top-right",
            })
          : toast.error("Update fail!", {
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
    const defaultFaculty = faculty.length > 0 ? faculty[0] : {};
    const defaultAccount = account.length > 0 ? account[0] : {};
    setGuest({
      ...defaultGuest,
      facultyData: {
        FacultyId: defaultFaculty.FacultyId || "",
        FacultyName: defaultFaculty.FacultyName || "",
      },
      accountData: {
        Email: defaultAccount.Email || "",
        AccountId: defaultAccount.AccountId || "",
      },
    });

    setError(defaultError);
    onHide();
  };

  useEffect(() => {
    if (action === "Update") {
      setGuest(dataModal);
    }
  }, [dataModal]);

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
            <span>{action === "Create" ? "Create Guest" : "Update Guest"}</span>
          </Typography>
          <Box align="center" mt="20px">
            <StyleInputBase
              type="text"
              placeholder="Guest Name"
              value={guest.guestName}
              onChange={(e) => handleInputChange(e.target.value, "guestName")}
              disabled={action === "Create" ? false : true}
            />
            {error.guestName && (
              <Typography variant="body2" color="error">
                {error.guestName}
              </Typography>
            )}
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>Faculty</InputLabel>
                <Select
                  value={guest.facultyData ? guest.facultyData.FacultyId : ""}
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
                        key={`guest-faculty-${index}`}
                        value={item.facultyId}
                      >
                        {item.facultyName}
                      </MenuItem>
                    );
                  })}
                </Select>
                {error.facultyId && (
                  <Typography variant="body2" color="error">
                    {error.facultyId}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>Account</InputLabel>
                <Select
                  value={guest.accountData ? guest.accountData.AccountId : ""}
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
                        key={`guest-account-${index}`}
                        value={item.accountId}
                      >
                        {item.email}
                      </MenuItem>
                    );
                  })}
                </Select>
                {error.accountId && (
                  <Typography variant="body2" color="error">
                    {error.accountId}
                  </Typography>
                )}
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
              onClick={(e) => handleConfirmGuest(e)}
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

export default ModalGuest;
