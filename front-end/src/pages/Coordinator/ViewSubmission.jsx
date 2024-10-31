import React, { useState, useEffect, useContext } from "react";
import Header from "../../layouts/Header";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../layouts/Footer";
import Button from "@mui/material/Button";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";
import { MyContext } from "../../App";
import Pagination from "@mui/material/Pagination";

const styles = {
  header: {
    position: "fixed",
    top: 0,
    width: "100%",
    backgroundColor: "#fff",
    zIndex: 999,
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  title: {
    fontSize: 35,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  tableTo: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ddd",
    position: "relative",
    top: "-40px",
  },
  cotVadong: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
    width: 165,
  },
  responsivetable: {
    overflowX: "auto",
    marginTop: "20px",
    padding: 50,
  },
  MuiButtonRoot: {
    margin: "0 auto",
    display: "block",
  },
};

const SubmitScreen = () => {
  const navigate = useNavigate();
  const { role, email } = useContext(MyContext);

  // get id from url
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get("id");

  // state setup
  const [eventData, setEventData] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [contributionId, setContributionId] = useState([]);
  const [contributionData, setContributionData] = useState([]);
  const [checkedStates, setCheckedStates] = useState({});

  // handle read event detail
  const getEventData = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/Event/detail?id=${eventId}`
      );
      const data = await response.data;
      setEventData(data);
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };
  useEffect(() => {
    getEventData();
  }, [eventId]);

  // handle read all contribution
  const getAllContribution = async () => {
    try {
      const response = await axios.get(
        "https://backend-api-system.azurewebsites.net/api/contribution"
      );
      const data = await response.data;
      const filteredContribution = data.filter((contribution) => {
        // if (response && response.data) {
        //   if (role === "guest") {
        //     const contributionSelect = response.data.filter(
        //       (contribution) =>
        //         contribution.isPublished === true &&
        //         contribution.eventId.eventId === eventId
        //     );
        //     setContributionData(contributionSelect);
        //   } else if (role === "manager") {
        //     const contribution = response.data.filter(
        //       (contribution) =>
        //         contribution.isPublished === true &&
        //         contribution.eventId.eventId === eventId
        //     );
        //     setContributionData(contribution);
        //   }
        // }
        return (
          contribution.studentId.facultyData.FacultyName ===
          eventData.facultyData.FacultyName
        );
      });
      setContributionData(filteredContribution);
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };
  useEffect(() => {
    if (eventData) {
      getAllContribution();
    }
  }, [eventData]);

  // handle read all student
  const getStudentId = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/student`
      );
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((studentData) => {
          if (studentData.accountData.Email === email) {
            const studentId = studentData.studentId;
            setStudentId(studentId);
          }
        });
      } else {
        console.error("Empty data returned from the server");
      }
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };
  useEffect(() => {
    getStudentId();
  }, []);

  //handle navigate button
  const handleNavigate = (eventId, studentId) => {
    navigate(`/submit?event_id=${eventId}&student_id=${studentId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={styles.header}>
        <Header />
      </div>

      <div
        style={{
          padding: 30,
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: 40, fontWeight: "600", textAlign: "center" }}>
          LIST OF THE SUBMISSION
        </p>
        <p style={{ fontSize: 25, fontWeight: "500" }}>
          {eventData ? eventData.eventName : "Loading..."}
        </p>
        <div style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
          <p> {eventData ? formatDate(eventData.openDate) : "Loading..."}</p>
          <p style={{ margin: "0 10px" }}> - </p>
          <p> {eventData ? formatDate(eventData.closeDate) : "Loading..."}</p>
        </div>
      </div>

      <div
        style={{
          background: "#fcfcfc",
          justifyContent: "center",
          display: "flex",
          marginBottom: 100,
          paddingBottom: 20,
        }}
      >
        <div style={styles.responsivetable}>
          <table style={styles.tableTo}>
            <thead>
              <tr>
                <th style={styles.cotVadong}>Student</th>
                <th style={styles.cotVadong}>Submit At</th>
                <th style={styles.cotVadong}>Submit File</th>
                <th style={styles.cotVadong}>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {contributionData.map(
                ({ studentId, document, submissionDate }) => (
                  <tr key={studentId.studentId}>
                    <td style={styles.cotVadong}>{studentId.studentName}</td>
                    <td style={styles.cotVadong}>
                      {formatDate(submissionDate)}
                    </td>
                    <td style={styles.cotVadong}>
                      <a href={document.fileUrl} download={document.fileName}>
                        {document.fileName}
                      </a>
                    </td>
                    <td style={styles.cotVadong}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          handleNavigate(
                            eventData.eventId,
                            studentId.studentId
                          );
                        }}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 30,
            }}
          >
            <Pagination
              count={10}
              variant="outlined"
              shape="rounded"
              width="100%"
            />
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};
export default SubmitScreen;
