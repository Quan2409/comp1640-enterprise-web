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
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { ConfirmDelete } from "../../../components/Admin/ConfirmDelete";
import { AllFaculty, deleteFaculty } from "../../../services/AdminService";
import ModalFaculty from "./ModalFaculty";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const Faculty = () => {
  const [listFaculty, setListFaculty] = useState([]);
  const [isShowModal, setShowModal] = useState(false);
  const [action, setAction] = useState("Create");
  const [dataModal, setDataModal] = useState({});
  const [isDelete, setDelete] = useState(false);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const indexOfLastFaculty = currentPage * perPage;
  const indexOfFirstFaculty = indexOfLastFaculty - perPage;
  const currentFaculty = listFaculty.slice(
    indexOfFirstFaculty,
    indexOfLastFaculty
  );

  //Format Date
  function formatDate(value) {
    const date = dayjs(value);
    const formattedDate = date.format("DD-MM-YYYY");
    return formattedDate;
  }

  //Get All Faculty
  useEffect(() => {
    getFaculty();
  }, []);

  const getFaculty = async () => {
    let res = await AllFaculty();

    if (res && res.data) {
      setListFaculty(res.data);
    }
  };

  const isDuplicate = (facultyName) => {
    return listFaculty.some((faculty) => faculty.facultyName === facultyName);
  };

  const handleClose = () => {
    setDataModal({});
    setDelete(false);
  };

  const onHide = () => {
    setShowModal(false);
    setDataModal({});
  };

  const handleCreate = () => {
    setAction("Create");
    setShowModal(true);
  };

  const handleUpdate = (faculty) => {
    setAction("Update");
    setDataModal(faculty);
    setShowModal(true);
  };

  const handleDelete = async (faculty) => {
    setDataModal(faculty);
    setDelete(true);
  };

  const confirmDelete = async () => {
    let res = await deleteFaculty(dataModal.facultyId);
    if (res.data) {
      handleClose();
      toast.success("Delete Faculty Successfully!!!", {
        position: "top-center",
      });
      await getFaculty();
    } else {
      toast.error("Oh, it didn't work. Please try again later!!!", {
        position: "top-center",
      });
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
            onClick={handleCreate}
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
            Faculty Management
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">Faculty Name</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Updated At</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentFaculty &&
                currentFaculty.length > 0 &&
                currentFaculty.map((item, index) => {
                  return (
                    <TableRow
                      key={`faculty-${index}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{item.facultyName}</TableCell>
                      <TableCell align="center">
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        {formatDate(item.updateAt)}
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
              count={Math.ceil(listFaculty.length / perPage)}
              shape="circular"
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </Box>
        <ModalFaculty
          open={isShowModal}
          onHide={onHide}
          dataModal={dataModal}
          action={action}
          onSuccess={() => getFaculty()}
          isDuplicate={isDuplicate}
        />
        <ConfirmDelete
          open={isDelete}
          handleClose={handleClose}
          confirmDelete={confirmDelete}
          dataModal={dataModal}
        />
      </Box>
    </>
  );
};

export default Faculty;
