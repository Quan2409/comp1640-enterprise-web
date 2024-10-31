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
  AllFaculty,
  createEvent,
  updateEvent,
} from "../../../services/AdminService";
import _ from "lodash";
import { toast } from "react-toastify";
import * as Yup from "yup";
import "../../../styles/admin/event.css";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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

const ModalEvents = (props) => {
  const { open, action, dataModal, onHide, onSuccess, isDuplicate } = props;
  const date = dayjs(todayStartOfTheDay);
  const defaultEvents = {
    eventName: "",
    facultyData: {
      FacultyName: "",
      FacultyId: "",
    },
    openDate: date,
    closeDate: date,
    __v: 0,
    createdAt: date,
    updateAt: date,
  };

  const defaultError = {
    eventName: "",
    openDate: "",
    closeDate: "",
  };

  const [events, setEvents] = useState(defaultEvents);
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState(defaultError);

  const validationSchema = Yup.object({
    eventName: Yup.string().required("Event Name is Required"),
    openDate: Yup.string().required("Open Date is Required"),
    closeDate: Yup.string().required("Close Date is Required"),
  });

  //Get All Faculty
  useEffect(() => {
    getFaculty();
  }, []);

  const getFaculty = async () => {
    let res = await AllFaculty();

    if (res && res.data) {
      setFaculty(res.data);
      if (res.data.length > 0) {
        const { facultyName, facultyId } = res.data[0];
        setEvents((prevEvents) => ({
          ...prevEvents,
          facultyData: {
            FacultyName: facultyName,
            FacultyId: facultyId,
          },
        }));
      }
    }
  };
  const handleInputChange = (value, name) => {
    let _events = _.cloneDeep(events);
    _events[name] = value;
    setEvents(_events);
  };

  const handleFacultyChange = (event) => {
    const selectedFacultyId = event.target.value;
    setEvents((prevEvents) => ({
      ...prevEvents,
      facultyData: {
        ...prevEvents.facultyData,
        FacultyId: selectedFacultyId,
      },
    }));
  };

  const handleConfirmEvents = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(events, { abortEarly: false });

      const checkDuplicate = isDuplicate(events.eventName);
      if (checkDuplicate) {
        if (action === "Create") {
          setError({ eventName: "Event Name already exists!!!!" });
        }
        return;
      }

      let res =
        action === "Create"
          ? await createEvent(events, events.facultyData.FacultyId)
          : await updateEvent(events, events.eventId);
      if (res.data) {
        onHide();
        onSuccess();
        const defaultFaculty = faculty.length > 0 ? faculty[0] : {};
        setEvents({
          ...defaultEvents,
          facultyData: {
            FacultyId: defaultFaculty.FacultyId || "",
            FacultyName: defaultFaculty.FacultyName || "",
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
    setEvents({
      ...defaultEvents,
      facultyData: {
        FacultyId: defaultFaculty.FacultyId || "",
        FacultyName: defaultFaculty.FacultyName || "",
      },
    });
    setError(defaultError);
    onHide();
  };

  useEffect(() => {
    if (action === "Update") {
      setEvents(dataModal);
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
              {action === "Create" ? "Create Events" : "Update Events"}
            </span>
          </Typography>
          <Box align="center" mt="20px">
            <StyleInputBase
              type="text"
              placeholder="Events Name"
              value={events.eventName}
              onChange={(e) => handleInputChange(e.target.value, "eventName")}
            />
            {error.eventName && (
              <Typography variant="body2" color="error">
                {error.eventName}
              </Typography>
            )}
            <Box sx={{ width: "400px", marginTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>Faculty</InputLabel>
                <Select
                  value={events.facultyData ? events.facultyData.FacultyId : ""}
                  onChange={(e) => handleFacultyChange(e)}
                  align="left"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                      },
                    },
                  }}
                  required
                  sx={{
                    borderRadius: "10px",
                    height: "55px",
                    width: "400px",
                  }}
                  disabled={action === "Create" ? false : true}
                >
                  {faculty.map((item, index) => {
                    return (
                      <MenuItem
                        key={`events-faculty-${index}`}
                        value={item.facultyId}
                      >
                        {item.facultyName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    value={dayjs(events.openDate)}
                    onChange={(date) =>
                      setEvents({ ...events, openDate: date.$d })
                    }
                    format="DD-MM-YYYY HH:mm A"
                    ampm={true}
                  />
                  {error.openDate && (
                    <Typography variant="body2" color="error">
                      {error.openDate}
                    </Typography>
                  )}
                  <DateTimePicker
                    value={dayjs(events.closeDate)}
                    onChange={(date) =>
                      setEvents({ ...events, closeDate: date.$d })
                    }
                    format="DD-MM-YYYY HH:mm A"
                    ampm={true}
                  />
                  {error.closeDate && (
                    <Typography variant="body2" color="error">
                      {error.closeDate}
                    </Typography>
                  )}
                </DemoContainer>
              </LocalizationProvider>
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
              onClick={(e) => handleConfirmEvents(e)}
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

export default ModalEvents;
