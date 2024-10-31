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
  createStudent,
  updateStudent,
} from "../../../services/AdminService";
import _ from "lodash";
import { toast } from "react-toastify";
import * as Yup from "yup";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const today = dayjs();
const todayStartOfTheDay = today.startOf("day");

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
  border: "2px solid #5FA6E3",
  color: "black",
  margin: "5px",
});

const StyleButton = styled(Button)({
  height: "35px",
  marginTop: "20px",
});

const ModalStudent = (props) => {
  const { open, action, dataModal, onHide, onSuccess, isDuplicate } = props;
  const date = dayjs(todayStartOfTheDay);
  const defaultStudent = {
    studentName: "",
    studentCode: "",
    studentDob: date.$d,
    studentAvatar: "",
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
    studentName: "",
    studentCode: "",
    studentDob: "",
    studentAvatar: "",
  };

  const [students, setStudents] = useState(defaultStudent);
  const [faculty, setFaculty] = useState([]);
  const [account, setAccount] = useState([]);
  const [error, setError] = useState(defaultError);

  const validationSchema = Yup.object({
    studentName: Yup.string().required("Student Name is required"),
    studentCode: Yup.string().required("Student Code is Required"),
    studentDob: Yup.string().required("Date of Birth is Required"),
    studentAvatar: Yup.string().required("Student Avatar is Required"),
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
        setStudents((prevStudents) => ({
          ...prevStudents,
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
      const studentAccounts = res.data.filter(
        (account) => account.role === "student"
      );
      setAccount(studentAccounts);
      if (studentAccounts.length > 0) {
        const { email, accountId } = studentAccounts[0];
        setStudents((prevStudents) => ({
          ...prevStudents,
          accountData: {
            Email: email,
            AccountId: accountId,
          },
        }));
      }
    }
  };

  const handleInputChange = (value, name) => {
    let _students = _.cloneDeep(students);
    _students[name] = value;
    setStudents(_students);
  };

  const handleFacultyChange = (event) => {
    const selectedFacultyId = event.target.value;
    const updatedStudents = { ...students };
    updatedStudents.facultyData.FacultyId = selectedFacultyId;
    setStudents(updatedStudents);
  };

  const handleAccountChange = (event) => {
    const selectedAccountId = event.target.value;
    const updatedStudents = { ...students };
    updatedStudents.accountData.AccountId = selectedAccountId;
    setStudents(updatedStudents);
  };

  const handleConfirmStudent = async (e) => {
    e.preventDefault();

    try {
      const checkDuplicate = isDuplicate(students.accountData.AccountId);
      console.log(checkDuplicate);
      if (checkDuplicate) {
        action === "Create"
          ? setError({ accountId: "This account has already been used." })
          : setError({});
      }
      await validationSchema.validate(students, { abortEarly: false });

      let res =
        action === "Create"
          ? await createStudent(
              students,
              students.facultyData.FacultyId,
              students.accountData.AccountId
            )
          : await updateStudent(students, students.studentId);

      if (res.data) {
        onHide();
        onSuccess();
        const defaultFaculty = faculty.length > 0 ? faculty[0] : {};
        const defaultAccount = account.length > 0 ? account[0] : {};
        setStudents({
          ...defaultStudent,
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

  useEffect(() => {
    if (action === "Update") {
      setStudents(dataModal);
    }
  }, [dataModal]);

  const handleCancel = () => {
    const defaultFaculty = faculty.length > 0 ? faculty[0] : {};
    const defaultAccount = account.length > 0 ? account[0] : {};
    setStudents({
      ...defaultStudent,
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
              {action === "Create" ? "Create Student" : "Update Student"}
            </span>
          </Typography>
          <Box align="center" mt="20px">
            <StyleInputBase
              type="text"
              placeholder="Student Name"
              value={students.studentName}
              onChange={(e) => handleInputChange(e.target.value, "studentName")}
              disabled={action === "Create" ? false : true}
            />
            {error.studentName && (
              <Typography variant="body2" color="error">
                {error.studentName}
              </Typography>
            )}
            <StyleInputBase
              type="text"
              placeholder="Student Code"
              value={students.studentCode}
              onChange={(e) => handleInputChange(e.target.value, "studentCode")}
            />
            {error.studentCode && (
              <Typography variant="body2" color="error">
                {error.studentCode}
              </Typography>
            )}
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ justifyContent: "center" }}
                >
                  <DatePicker
                    value={dayjs(students.studentDob)}
                    onChange={(date) =>
                      setStudents({ ...students, studentDob: date.toDate() })
                    }
                    format="DD-MM-YYYY"
                  />
                  {error.studentDob && (
                    <Typography variant="body2" color="error">
                      {error.studentDob}
                    </Typography>
                  )}
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <StyleInputBase
              type="text"
              placeholder="Student Avatar"
              value={students.studentAvatar}
              onChange={(e) =>
                handleInputChange(e.target.value, "studentAvatar")
              }
            />
            {error.studentAvatar && (
              <Typography variant="body2" color="error">
                {error.studentAvatar}
              </Typography>
            )}
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel id="faculty-label">Faculty</InputLabel>
                <Select
                  labelId="faculty-label"
                  id="faculty-select"
                  value={
                    students.facultyData
                      ? students.facultyData.FacultyId
                      : faculty[0].facultyId
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
                        key={`student-faculty-${index}`}
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
                <InputLabel id="account-label">Account</InputLabel>
                <Select
                  labelId="account-label"
                  id="account-select"
                  value={
                    students.accountData
                      ? students.accountData.AccountId
                      : account[0].accountId
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
                        key={`student-account-${index}`}
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
              onClick={(e) => handleConfirmStudent(e)}
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

export default ModalStudent;
