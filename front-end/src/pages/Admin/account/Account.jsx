import { Add, Edit } from "@mui/icons-material";
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
import _ from "lodash";

import ModalAccount from "./ModalAccount";
import { AllAccount } from "../../../services/AdminService";
import dayjs from "dayjs";

const Account = () => {
  //List Account
  const [listAccounts, setListAccounts] = useState([]);

  //Modal
  const [isShowModal, setShowModal] = useState(false);
  const [action, setAction] = useState("Create");
  const [dataModal, setDataModal] = useState({});

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = listAccounts.slice(indexOfFirstUser, indexOfLastUser);

  //Get All Users (Account)
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    let res = await AllAccount();

    if (res && res.data) {
      setListAccounts(res.data);
    }
  };

  //Format Date
  function formatDate(value) {
    const date = dayjs(value);
    const formattedDate = date.format("DD-MM-YYYY");
    return formattedDate;
  }

  const handleCreate = () => {
    setAction("Create");
    setShowModal(true);
  };

  const onHide = () => {
    setShowModal(false);
  };

  const handleUpdate = (accounts) => {
    setAction("Update");
    setDataModal(accounts);
    setShowModal(true);
  };

  const isDuplicate = (email) => {
    return listAccounts.some((accounts) => accounts.email === email);
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
            Account Management
          </Typography>
        </Box>
        <Container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">No.</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Created Date</TableCell>
                  <TableCell align="center">Updated Date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers &&
                  currentUsers.length > 0 &&
                  currentUsers.map((item, index) => {
                    return (
                      <TableRow
                        key={`user-${index}`}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">{item.email}</TableCell>
                        <TableCell align="center">{item.role}</TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="p"
                            sx={{
                              color: "white",
                              backgroundColor:
                                item.status === "Active" ? "green" : "red",
                              borderRadius: "10px",
                              padding: "5px",
                            }}
                          >
                            {item.status}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(item.updateAt)}
                        </TableCell>
                        <TableCell align="center">
                          {item.role !== "admin" && item.role !== "manager" && (
                            <Button
                              onClick={() => handleUpdate(item)}
                              variant="outlined"
                              startIcon={<Edit />}
                              color="success"
                              size="small"
                            >
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Box>
          <Stack sx={{ margin: "10px 35%" }} alignItems="center">
            <Pagination
              count={Math.ceil(listAccounts.length / perPage)}
              shape="circular"
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </Box>
        <ModalAccount
          onHide={onHide}
          open={isShowModal}
          dataModal={dataModal}
          action={action}
          onSuccess={() => getUsers()}
          isDuplicate={isDuplicate}
        />
      </Box>
    </>
  );
};

export default Account;
