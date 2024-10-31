import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { ConfirmDelete } from "../../../components/Admin/ConfirmDelete";
import { AllEvent, deleteEvent } from "../../../services/AdminService";
import ModalEvent from "./ModalEvent";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const Event = () => {
  const [listEvent, setListEvent] = useState([]);
  const [isDelete, setDelete] = useState(false);
  const [isShowModal, setShowModal] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [action, setAction] = useState("Create");

  const handleClose = () => {
    setDelete(false);
  };
  const onHide = () => {
    setShowModal(false);
    setDataModal({});
  };

  const handleCreate = () => {
    setShowModal(true);
    setAction("Create");
  };

  const handleUpdate = (events) => {
    setShowModal(true);
    setAction("Update");
    setDataModal(events);
  };

  const handleDelete = (events) => {
    setDelete(true);
    setDataModal(events);
  };

  const confirmDelete = async () => {
    let res = await deleteEvent(dataModal.eventId);
    if (res.data) {
      handleClose();
      await getEvent();
    } else {
      toast.error("Delete Fail!!!");
    }
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentEvent = listEvent.slice(indexOfFirst, indexOfLast);

  //Format Date
  // function formatDate(value) {
  //   const date = new Date(value);
  //   const day = date.getDate();
  //   const month = date.getMonth() + 1;
  //   const year = date.getFullYear();
  //   if (day >= 10 && month < 10) {
  //     return `${day}-0${month}-${year}`;
  //   } else if (day < 10 && month >= 10) {
  //     return `0${day}-${month}-${year}`;
  //   } else if (day < 10 && month < 10) {
  //     return `0${day}-0${month}-${year}`;
  //   } else {
  //     return `${day}-${month}-${year}`;
  //   }
  // }

    function formatDate(value) {
      const date = dayjs(value);
      const formattedDate =
        date.format("DD-MM-YYYY");
      return formattedDate;
    }

  const isDuplicate = (eventName) => {
    return listEvent.some((events) => events.eventName === eventName);
  };

  //Get All Faculty
  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    let res = await AllEvent();

    if (res && res.data) {
      setListEvent(res.data);
    }
  };

  return (
    <>
      <Box
        sx={{
          border: "1px solid black",
          borderRadius: "10px",
        }}
      >
        <Box display="flex">
          <Button
            onClick={() => handleCreate()}
            variant="contained"
            startIcon={<Add />}
            size="small"
            sx={{
              height: "35px",
              alignContent: "center",
              margin: "25px 28% 20px 40px",
            }}
          />
          <Typography
            variant="h6"
            align="center"
            color="#2E3678"
            sx={{ fontSize: "30px", margin: "20px 0 20px 0" }}
          >
            Event Management
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">Event</TableCell>
                <TableCell align="center">Faculty</TableCell>
                <TableCell align="center">Open Deadline</TableCell>
                <TableCell align="center">Close Deadline</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentEvent &&
                currentEvent.length > 0 &&
                currentEvent.map((item, index) => {
                  return (
                    <TableRow
                      key={`event-${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{item.eventName}</TableCell>
                      <TableCell align="center">
                        {item.facultyData ? item.facultyData.FacultyName : ""}
                      </TableCell>
                      <TableCell align="center">
                        {formatDate(item.openDate)}
                      </TableCell>
                      <TableCell align="center">
                        {formatDate(item.closeDate)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleUpdate(item)}
                          variant="outlined"
                          startIcon={<Edit />}
                          color="success"
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(item)}
                          variant="outlined"
                          startIcon={<Delete />}
                          color="error"
                          size="small"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
          <Stack sx={{ margin: "20px 35%" }} alignItems="center">
            <Pagination
              count={Math.ceil(listEvent.length / perPage)}
              shape="circular"
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </Box>
        <ModalEvent
          open={isShowModal}
          onHide={onHide}
          dataModal={dataModal}
          action={action}
          onSuccess={() => getEvent()}
          isDuplicate={isDuplicate}
        />
        <ConfirmDelete
          open={isDelete}
          handleClose={handleClose}
          dataModal={dataModal}
          confirmDelete={confirmDelete}
        />
      </Box>
    </>
  );
};

export default Event;
