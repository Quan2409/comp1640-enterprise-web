import { Grid, Box, Typography } from "@mui/material";
import style from "./chart.module.css";
import { PieChart, BarChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import styled from "styled-components";

const chartSetting = {
  yAxis: [
    {
      label: "Number",
    },
  ],
  width: 550,
  height: 310,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-10px, 0)",
    },
  },
};

const StyleTypography = styled(Typography)({
  textAlign: "center",
  fontWeight: 600,
  "&:last-child": {
    color: "#ed7400",
    fontSize: "2.5rem",
  },
});

const valueFormatter = (value) => `${value}`;

export default function Chart() {
  const [faculty, setFaculty] = useState([]);
  const [student, setStudent] = useState([]);
  const [contribution, setContribution] = useState([]);
  const [events, setEvents] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getAllFaculty = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/faculty/getAll`
      );
      if (response && response.data) {
        setFaculty(response.data);
      }
    } catch (error) {
      console.error("There was a problem fetching the faculty data:", error);
    }
  };
  const getAllStudent = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/student`
      );
      if (response && response.data) {
        setStudent(response.data);
      }
    } catch (error) {
      console.error("There was a problem fetching the student data:" + error);
    }
  };
  const getAllContribution = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/contribution`
      );
      if (response && response.data) {
        setContribution(response.data);
      }
    } catch (error) {
      console.error(
        "There was a problem fetching the contribution data:",
        error
      );
    }
  };
  const getAllEvent = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/Event`
      );
      if (response && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error(
        "There was a problem fetching the contribution data:",
        error
      );
    }
  };

  useEffect(() => {
    getAllFaculty();
    getAllStudent();
    getAllContribution();
    getAllEvent();
  }, []);

  useEffect(() => {
    const data = faculty.map((fac) => ({
      faculty: fac.facultyName,
      contribution: calculateTotalContributions(fac.facultyId),
      student: calculateTotalContributors(fac.facultyId),
    }));
    setBarChartData(data);
  }, [faculty, contribution, student]);

  const calculateTotalContributions = (facultyId) => {
    return contribution.filter(
      (con) => con.studentId.facultyData.FacultyId === facultyId
    ).length;
  };

  const calculateTotalContributors = (facultyId) => {
    return new Set(
      contribution
        .filter((con) => con.studentId.facultyData.FacultyId === facultyId)
        .map((con) => con.studentId)
    ).size;
  };

  const calculateTotalContributionByYear = () => {
    const contributionByYear = {};
    contribution.forEach((con) => {
      const year = dayjs(con.submissionDate).year();
      if (!contributionByYear[year]) {
        contributionByYear[year] = 0;
      }
      contributionByYear[year]++;
    });

    return Object.entries(contributionByYear).map(([year, count]) => ({
      year: parseInt(year),
      count,
    }));
  };

  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      <Grid container className={style["container"]}>
        <Grid item xs={12} display="flex" justifyContent="space-evenly">
          <Box width="20%" className={style["box"]}>
            <StyleTypography>Total number of Contribution</StyleTypography>
            <StyleTypography>{contribution.length}</StyleTypography>
          </Box>

          <Box width="20%" className={style["box"]}>
            <StyleTypography>Total number of Student</StyleTypography>
            <StyleTypography>{student.length}</StyleTypography>
          </Box>

          <Box width="20%" className={style["box"]}>
            <StyleTypography>Total number of Event</StyleTypography>
            <StyleTypography>{events.length}</StyleTypography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          display={isScreenSmall ? "" : "flex"}
          justifyContent="space-evenly"
          textAlign="center"
          padding="10px"
          className={style["xs-12"]}
        >
          <Box className={style["css-0"]}>
            <Box flexGrow={1}>
              <PieChart
                series={[
                  {
                    data: calculateTotalContributionByYear().map(
                      ({ year, count }) => ({
                        id: year.toString(),
                        value: count,
                        label: year.toString(),
                      })
                    ),
                  },
                ]}
                width={450}
                height={280}
              />
              <Typography
                style={{ fontWeight: 600, marginTop: "2rem", color: "#ed7400" }}
              >
                Number contribution in Year
              </Typography>
            </Box>
          </Box>
          <Box className={style["css-0"]}>
            <Box flexGrow={1}>
              <BarChart
                dataset={barChartData}
                xAxis={[
                  {
                    scaleType: "band",
                    dataKey: "faculty",
                  },
                ]}
                series={[
                  {
                    dataKey: "contribution",
                    label: "Contribution",
                    valueFormatter,
                  },
                  {
                    dataKey: "student",
                    label: "Contributor",
                    valueFormatter,
                  },
                ]}
                {...chartSetting}
              />
              <Typography style={{ fontWeight: 600, color: "#ed7400" }}>
                Number of Contribution and Contributor in Faculty
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
