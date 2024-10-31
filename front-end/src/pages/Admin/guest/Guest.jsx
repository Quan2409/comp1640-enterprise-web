import { Add, Edit, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
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
import { AllGuest, deleteGuest } from "../../../services/AdminService";
import ModalGuest from "./ModalGuest";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const Guest = () => {
  const [listGuest, setListGuest] = useState([]);
  const [isDelete, setDelete] = useState(false);
  const [isShowModal, setShowModal] = useState(false);
  const [action, setAction] = useState("Create");
  const [dataModal, setDataModal] = useState({});

  const handleClose = () => {
    setDelete(false);
  };

  const onHide = () => {
    setShowModal(false);
  };
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentGuest = listGuest.slice(indexOfFirst, indexOfLast);

  //Format Date
    function formatDate(value) {
      const date = dayjs(value);
      const formattedDate = date.format("DD-MM-YYYY");
      return formattedDate;
    }

  //Get All Faculty
  useEffect(() => {
    getGuest();
  }, []);

  const getGuest = async () => {
    let res = await AllGuest();

    if (res && res.data) {
      setListGuest(res.data);
    }
  };

  const isDuplicate = (guestName) => {
    return listGuest.some((guest) => guest.guestName === guestName);
  };

    const isDuplicateAccount = (accountId) => {
      return listGuest.some(
        (guest) => guest.accountData.AccountId === accountId
      );
    };

    const isDuplicateFaculty = (facultyId) => {
      return listGuest.some(
        (guest) => guest.facultyData.FacultyId === facultyId
      );
    };

  const handleCreate = () => {
    setAction("Create");
    setShowModal(true);
  };

  const handleUpdate = (guest) => {
    setAction("Update");
    setDataModal(guest);
    setShowModal(true);
  };

  const handleDelete = async (guest) => {
    setDataModal(guest);
    setDelete(true);
  };

  const confirmDelete = async () => {
    let res = await deleteGuest(dataModal.guestId);
    if (res.data) {
      handleClose();
      toast.success("Delete Guest Successfully!!", {
        position: "top-center",
      });
      await getGuest();
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
            Guest Management
          </Typography>
        </Box>
        <Container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">No.</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Faculty Name</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Updated At</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentGuest &&
                  currentGuest.length > 0 &&
                  currentGuest.map((item, index) => {
                    return (
                      <TableRow
                        key={`guest-${index}`}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">{item.guestName}</TableCell>
                        <TableCell align="center">
                          {item.accountData ? item.accountData.Email : ""}
                        </TableCell>
                        <TableCell align="center">
                          {item.facultyData ? item.facultyData.FacultyName : ""}
                        </TableCell>
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
        </Container>
        <Box>
          <Stack sx={{ margin: "20px 35%" }} alignItems="center">
            <Pagination
              count={Math.ceil(listGuest.length / perPage)}
              shape="circular"
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </Box>
        <ModalGuest
          open={isShowModal}
          onHide={onHide}
          dataModal={dataModal}
          action={action}
          onSuccess={() => getGuest()}
          isDuplicate={isDuplicate}
          isDuplicateAccount={isDuplicateAccount}
          isDuplicateFaculty={isDuplicateFaculty}
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

export default Guest;
