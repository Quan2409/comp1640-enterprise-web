import styled from "@emotion/styled";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createAccount, updateAccount } from "../../../services/AdminService";
import _ from "lodash";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
  backgroundColor: "white",
  padding: "0 15px",
  width: "400px",
  height: "55px",
  borderRadius: "10px",
  color: "black",
  margin: "5px",
});

const StyledInput = ({ error, ...rest }) => {
  return (
    <FormControl error={!!error}>
      <StyleInputBase
        {...rest}
        sx={{
          border: error ? "2px solid red" : "2px solid #5FA6E3",
        }}
      />
      {error && (
        <FormHelperText sx={{ fontSize: "15px" }}>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

const StyleButton = styled(Button)({
  height: "35px",
  marginTop: "20px",
});

const ModalAccount = (props) => {
  const { open, onHide, action, dataModal, onSuccess } = props;

  const date = new Date();

  const defaultAccount = {
    email: "",
    password: "",
    retypePassword: "",
    role: "",
    status: "Active",
    __v: 0,
    createdAt: date,
    updateAt: date,
  };
  const [accounts, setAccounts] = useState(defaultAccount);

  const defaultError = {
    email: "",
    password: "",
    retypePassword: "",
  };
  const [error, setError] = useState(defaultError);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is Required")
      .email("Invalid email format")
      .matches(/@fpt\.edu\.vn$/, "Email must end with @fpt.edu.vn"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    retypePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleInputChange = (value, name) => {
    let updateAccount = { ...accounts, [name]: value };
    setAccounts(updateAccount);
  };

  const handleConfirmAccount = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(accounts, { abortEarly: false });

      let res =
        action === "Create"
          ? await createAccount(accounts)
          : await updateAccount(accounts, accounts.accountId);
      if (res.data) {
        onHide();
        onSuccess();
        setAccounts(defaultAccount);
        setError(defaultError);

        action === "Create"
          ? toast.success("Create Account successful!!", {
              position: "top-right",
            })
          : toast.success("Update Account successful!!", {
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
    setAccounts(defaultAccount);
    setError(defaultError);
    onHide();
  };

  useEffect(() => {
    if (action === "Update") {
      setAccounts(dataModal);
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
            <span>
              {action === "Create" ? "Create Account" : "Update Account"}
            </span>
          </Typography>
          <Box align="center" mt="20px">
            <StyledInput
              type="email"
              placeholder="Email"
              value={accounts.email}
              onChange={(e) => handleInputChange(e.target.value, "email")}
              disabled={action === "Create" ? false : true}
              error={error.email}
            />
            <StyledInput
              type="password"
              placeholder="Password"
              value={accounts.password}
              onChange={(e) => handleInputChange(e.target.value, "password")}
              error={error.password}
            />
            <StyledInput
              type="password"
              placeholder="Retype Password"
              value={accounts.retypePassword}
              onChange={(e) =>
                handleInputChange(e.target.value, "retypePassword")
              }
              error={error.retypePassword}
            />
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={accounts.role || "guest"}
                  label="Role"
                  name="role"
                  onChange={(e) => handleInputChange(e.target.value, "role")}
                  align="left"
                  sx={{
                    borderRadius: "10px",
                    height: "55px",
                    width: "400px",
                  }}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="coordinator">Coordinator</MenuItem>
                  <MenuItem value="guest">Guest</MenuItem>
                </Select>
                {error.role && <div className="error">{error.role}</div>}
              </FormControl>
            </Box>
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={accounts.status || "Active"}
                  name="status"
                  label="Status"
                  onChange={(e) => handleInputChange(e.target.value, "status")}
                  align="left"
                  required
                  disabled={action === "Update" ? false : true}
                  sx={{
                    borderRadius: "10px",
                    height: "55px",
                    width: "400px",
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Disable">Disable</MenuItem>
                </Select>
                {error.status && <div className="error">{error.status}</div>}
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
              onClick={(e) => handleConfirmAccount(e)}
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

export default ModalAccount;
