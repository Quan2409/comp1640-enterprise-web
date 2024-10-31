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
import {
  AllCoordinator,
  deleteCoordinator,
} from "../../../services/AdminService";
import ModalCoordinator from "./ModalCoordinator";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const Coordinator = () => {
  const [listCoordinator, setListCoordinator] = useState([]);
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
  const currentCoordinator = listCoordinator.slice(indexOfFirst, indexOfLast);

  //Format Date
  function formatDate(value) {
    const date = dayjs(value);
    const formattedDate = date.format("DD-MM-YYYY");
    return formattedDate;
  }

  //Get All Faculty
  useEffect(() => {
    getCoordinator();
  }, []);

  const getCoordinator = async () => {
    let res = await AllCoordinator();

    if (res && res.data) {
      setListCoordinator(res.data);
    }
  };

  const handleCreate = () => {
    setAction("Create");
    setShowModal(true);
  };

  const handleUpdate = (coordinator) => {
    setAction("Update");
    setDataModal(coordinator);
    setShowModal(true);
  };

  const handleDelete = async (coordinator) => {
    setDataModal(coordinator);
    setDelete(true);
  };

  const confirmDelete = async () => {
    let res = await deleteCoordinator(dataModal.coordinatorId);
    if (res.data) {
      handleClose();
      await getCoordinator();
    } else {
      toast.error("Delete Fail!");
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
            Coordinator Management
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
                  <TableCell align="center">Faculty</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Updated At</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCoordinator &&
                  currentCoordinator.length > 0 &&
                  currentCoordinator.map((item, index) => {
                    return (
                      <TableRow
                        key={`coordinator-${index}`}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">
                          {item.coordinatorName}
                        </TableCell>
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
              count={Math.ceil(listCoordinator.length / perPage)}
              shape="circular"
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </Box>
        <ModalCoordinator
          open={isShowModal}
          onHide={onHide}
          dataModal={dataModal}
          action={action}
          onSuccess={() => getCoordinator()}
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

export default Coordinator;
