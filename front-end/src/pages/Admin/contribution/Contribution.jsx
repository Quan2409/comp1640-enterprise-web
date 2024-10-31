import {
  Box,
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
import { AllContribution } from "../../../services/AdminService";
import dayjs from "dayjs";

const Contribution = () => {
  const [listContribution, setContribution] = useState([]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const indexOfLastContribution = currentPage * perPage;
  const indexOfFirstContribution = indexOfLastContribution - perPage;
  const currentContribution = listContribution.slice(
    indexOfFirstContribution,
    indexOfLastContribution
  );

  useEffect(() => {
    getContribution();
  }, []);

  const getContribution = async () => {
    let res = await AllContribution();
    if (res && res.data) {
      setContribution(res.data);
    }
  };
  //Format Date
  function formatDate(value) {
    const date = dayjs(value);
    const formattedDate =
      date.format("DD-MM-YYYY");
    return formattedDate;
  }
  return (
    <Box
      sx={{
        border: "1px solid black",
        borderRadius: "10px",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        color="#2E3678"
        sx={{ fontSize: "30px", margin: "20px 0 20px 0" }}
      >
        Contributions Management
      </Typography>
      <Container>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">Title</TableCell>

                <TableCell align="center">Faculty</TableCell>
                <TableCell align="center">Document</TableCell>
                <TableCell align="center">Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentContribution &&
                currentContribution.length > 0 &&
                currentContribution.map((item, index) => {
                  return (
                    <TableRow
                      key={`contribution-${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{item.eventId.eventName}</TableCell>
                      <TableCell align="center">{item.eventId.facultyData.FacultyName}</TableCell>
                      <TableCell align="center">{item.document.fileName}</TableCell>
                      <TableCell align="center">
                        {formatDate(item.submissionDate)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Box>
        <Stack
          spacing={2}
          sx={{ margin: "20px 35%" }}
          justifyContent="center"
          alignItems="center"
        >
          <Pagination
            count={Math.ceil(listContribution.length / perPage)}
            shape="circular"
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default Contribution;
