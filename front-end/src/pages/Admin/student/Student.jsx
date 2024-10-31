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
import { Add, Delete, Edit } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { ConfirmDelete } from "../../../components/Admin/ConfirmDelete";
import { AllStudent, deleteStudent } from "../../../services/AdminService";
import ModalStudent from "./ModalStudent";
import dayjs from "dayjs";

const Student = () => {
  const [listStudents, setListStudents] = useState([]);
  const [isShowModal, setShowModal] = useState(false);
  const [action, setAction] = useState("Create");
  const [dataModal, setDataModal] = useState({});
  const [isDelete, setDelete] = useState(false);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const indexOfLastStudent = currentPage * perPage;
  const indexOfFirstStudent = indexOfLastStudent - perPage;
  const currentStudent = listStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  //Format Date
  function formatDate(value) {
    const date = dayjs(value);
    const formattedDate = date.format("DD-MM-YYYY");
    return formattedDate;
  }

  //Get All Students
  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    let res = await AllStudent();

    if (res && res.data) {
      setListStudents(res.data);
    }
  };

  const isDuplicate = (accountId) => {
    return listStudents.some(
      (student) => student.accountData.AccountId === accountId
    );
  };

  const handleClose = () => {
    setShowModal(false);
    setDataModal({});
    setDelete(false);
  };

  const onHideModal = () => {
    setShowModal(false);
  };

  const handleCreate = () => {
    setAction("Create");
    setShowModal(true);
  };

  const handleUpdate = (students) => {
    setAction("Update");
    setDataModal(students);
    setShowModal(true);
  };

  const handleDelete = async (students) => {
    setDataModal(students);
    setDelete(true);
  };

  const confirmDelete = async () => {
    let res = await deleteStudent(dataModal.studentId);
    if (res.data) {
      handleClose();
      await getStudents();
    } else {
      toast.error("Fail!");
    }
  };

  return (
    <>
      <Box
      height="80vh"
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
            Student Management
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{height: "400px", padding: "20px"}}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">Avatar</TableCell>
                <TableCell align="center">Student Name</TableCell>
                <TableCell align="center">Student Code</TableCell>
                <TableCell align="center">Date Of Birth</TableCell>
                <TableCell align="center">Faculty Name</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Updated At</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentStudent &&
                currentStudent.length > 0 &&
                currentStudent.map((item, index) => {
                  return (
                    <TableRow
                      key={`student-${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          borderRadius="10px"
                          component="img"
                          sx={{ height: 90 }}
                          src={item.studentAvatar}
                        />
                      </TableCell>
                      <TableCell align="center">{item.studentName}</TableCell>
                      <TableCell align="center">{item.studentCode}</TableCell>
                      <TableCell align="center">
                        {formatDate(item.studentDob)}
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
        <Box>
          <Stack
            spacing={2}
            sx={{ margin: "20px 35%" }}
            justifyContent="center"
            alignItems="center"
          >
            <Pagination
              count={Math.ceil(listStudents.length / perPage)}
              shape="circular"
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </Box>
        <ModalStudent
          open={isShowModal}
          onHide={onHideModal}
          dataModal={dataModal}
          action={action}
          onSuccess={() => getStudents()}
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

export default Student;
