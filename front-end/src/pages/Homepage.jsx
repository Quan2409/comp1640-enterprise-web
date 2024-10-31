import React, { Fragment, useContext, useEffect, useState } from "react";
import style from "../styles/homepage/homepage.module.css";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import axios from "../api/axios";
import { MyContext } from "../App";
import { formatDate } from "../utils/formatDate";

export const EventContext = React.createContext();

const Homepage = () => {
  // navigate
  const navigate = useNavigate();

  // state
  const { role, email } = useContext(MyContext);
  const { events, setEvent } = useContext(MyContext);
  const [studentId, setStudentId] = useState(null);
  const [facultyName, setFacultyName] = useState(null);
  const [eventFaculty, setEventFacultyName] = useState(null);
  const [studentFaculty, setStudentFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const indexOfLastEvent = currentPage * perPage;
  const indexOfFirstEvent = indexOfLastEvent - perPage;
  const currentEvent = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // handle api event
  useEffect(() => {
    const getEvent = async () => {
      try {
        const response = await axios.get(
          "https://backend-api-system.azurewebsites.net/api/Event"
        );
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((eventFaculty) => {
            const eventFacultyName = eventFaculty.facultyData.FacultyName;
            setEventFacultyName(eventFacultyName);
          });
        }
        setEvent(data);
        setLoading(false);
      } catch (err) {
        if (err.response) {
          console.log("Server error:", err.response.data);
        } else {
          console.log("Axios error:", err);
        }
      }
    };
    getEvent();
  }, []);

  // handle api student by id
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
            const studentFaculty = studentData.facultyData.FacultyName;
            setStudentFaculty(studentFaculty);
            setStudentId(studentId);
          }
        });
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
  }, [email]);

  //handle get faculty of coordinator
  const getFaculty = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/coordinator`
      );
      const data = response.data;
      if (Array.isArray(data) && data.length >= 0) {
        data.forEach((coordinatorData) => {
          if (coordinatorData.accountData.Email === email) {
            const coordinatorFaculty = coordinatorData.facultyData.FacultyName;
            setFacultyName(coordinatorFaculty);
          }
        });
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
    getFaculty();
  }, [email]);

  // handle navigate
  const handleNavigate = (eventId, eventFaculty, studentId) => {
    if (role === "student") {
      if (studentFaculty === eventFaculty) {
        navigate(`/submit?event_id=${eventId}&student_id=${studentId}`);
      } else {
        alert("You don't have permission to access this event");
      }
    }

    if (role === "coordinator") {
      if (facultyName === eventFaculty) {
        navigate(`/view-submit?id=${eventId}`);
      } else {
        alert("You don't have permission to access this event");
      }
    }

    if (role === "manager" || role == "guest") {
      navigate(`/view-submit?id=${eventId}`);
    }
  };

  return (
    <EventContext.Provider value={{ events }}>
      <Fragment>
        <div className={style["container"]}>
          {/* header */}
          <Header />

          {/* main */}
          <div className={style["mainContent"]}>
            <div className={style["eventList"]}>
              {loading ? (
                <p>Loading...</p>
              ) : currentEvent ? (
                currentEvent.map(
                  ({
                    eventId,
                    eventName,
                    facultyData,
                    openDate,
                    closeDate,
                  }) => (
                    <div
                      key={eventId}
                      className={style["eventItem"]}
                      onClick={() => {
                        handleNavigate(
                          eventId,
                          facultyData.FacultyName,
                          studentId
                        );
                      }}
                    >
                      <h1>{eventName}</h1>
                      <h2>{facultyData.FacultyName}</h2>
                      <p>Open Date: {formatDate(openDate)}</p>
                      <p>Due Date: {formatDate(closeDate)}</p>
                    </div>
                  )
                )
              ) : (
                <p>No events found.</p>
              )}
            </div>

            {/* pagination */}
            <div className={style["paginationContainer"]}>
              <Pagination
                count={Math.ceil(events.length / perPage)}
                shape="circular"
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
              />
            </div>
          </div>

          {/* footer */}
          <Footer />
        </div>
      </Fragment>
    </EventContext.Provider>
  );
};

export default Homepage;
