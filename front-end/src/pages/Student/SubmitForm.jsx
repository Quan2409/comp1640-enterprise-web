import React, { useState, useEffect, useContext } from "react";
import style from "../../styles/student/submit.module.css";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { MyContext } from "../../App";
import ModalTerms from "../../components/Modal/ModalTerms";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const StudentSubmitForm = () => {
  // location-history
  const location = useLocation();

  // get event id param in url
  const searchParams01 = new URLSearchParams(location.search);
  const eventId = searchParams01.get("event_id");

  // get student id param in url
  const searchParams02 = new URLSearchParams(location.search);
  const studentId = searchParams02.get("student_id");

  // state
  const { role, email } = useContext(MyContext);
  const [formData, setFormData] = useState({});
  const [contributionId, setContributionId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [eventData, setEventData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [coordinatorData, setCoordinatorData] = useState(null);
  const [isUpload, setUpload] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [isFeedback, setIsFeedBack] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditFeedback, setIsEditFeedback] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [errors, setErrors] = useState("");

  // validation
  const schema = yup.object().shape({
    document: yup
      .mixed()
      .required("Please choose a document for uploading.")
      .test(
        "fileType",
        "Invalid file type. Only .docx and .png files are allowed.",
        (value) => {
          if (!value) return true; // No file selected, so it's valid
          const allowedFileTypes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/png",
          ];
          return allowedFileTypes.includes(value.type);
        }
      ),
  });

  // get event detail by id
  const getEventDetail = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/Event/detail?id=${eventId}`
      );
      const data = await response.data;
      setEventData(data);
    } catch (error) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };
  useEffect(() => {
    getEventDetail();
  }, [eventId]);

  // get student detail by id
  const getStudentDetail = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/student/detail?id=${studentId}`
      );
      const data = await response.data;
      if (response.status === 200) {
        setStudentData(data);
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
    getStudentDetail();
  }, [studentId]);

  //get contribution id
  const getAllContribution = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/contribution`
      );
      const data = await response.data;
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((contributionData) => {
          if (contributionData.studentId.studentId === studentId) {
            setContributionId(contributionData.contributionId);
            setFormData(contributionData);
            setUpload(true);
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
    getAllContribution();
  }, [contributionId]);

  // get coordinator id
  const getAllCoordinator = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/coordinator`
      );
      const data = await response.data;
      // console.log(data);
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((coordinatorData) => {
          if (coordinatorData.accountData.Email === email) {
            const coordinatorId = coordinatorData.coordinatorId;
            setCoordinatorData(coordinatorId);
          }
        });
      }
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data); // Display server error
      } else {
        console.log("Axios error:", err); // Display Axios error
      }
    }
  };
  useEffect(() => {
    getAllCoordinator();
  }, [email]);

  // handle upload file
  const handleFileUpload = async () => {
    if (!formData.document) {
      alert("Choose a document for uploading.");
      return;
    }

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      const currentTime = new Date();
      const submissionDate = formatDate(currentTime);
      setFormData((prevState) => ({
        ...prevState,
        submitDate: submissionDate,
      }));

      const response = await axios.post(
        `https://backend-api-system.azurewebsites.net/api/contribution/create?studentId=${studentId}&eventId=${eventId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        console.log("Files upload successfully", data);
        setFormData(data);
        setUpload(true);
      } else {
        console.log("Upload Fail");
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        if (err.response) {
          console.log("Server error:", err.response.data);
        } else {
          console.log("Axios error:", err);
        }
      }
    }
  };

  // handle edit submit
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `https://backend-api-system.azurewebsites.net/api/contribution/update?id=${contributionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        console.log("Updated successfully", data);
        setFormData(data);
        setUpload(true);
      }
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };

  // handle delete submit
  const handleDeleteSubmit = async () => {
    const isConfirmed = window.confirm("Are you sure want to delete?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://backend-api-system.azurewebsites.net/api/contribution/delete?id=${contributionId}`
        );
        if (response.status === 200) {
          setFormData((prevState) => ({
            ...prevState,
            document: null,
            fileName: null,
            submitDate: null,
          }));
          setUpload(false);
        }
      } catch (err) {
        if (err.response) {
          console.log("Server error:", err.response.data);
        } else {
          console.log("Axios error:", err);
        }
      }
    }
  };

  //handle feedback
  const handleFeedback = async () => {
    if (!feedbackData.trim()) {
      alert("Enter Feedback");
      return;
    }
    try {
      const response = await axios.post(
        `https://backend-api-system.azurewebsites.net/api/comment/create?contributionId=${formData.contributionId}&coordinatorId=${coordinatorData}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          review: feedbackData,
        }
      );
      if (response.status === 200) {
        console.log("Feedback successfully", response.data);
        setFeedbackData([response.data]);
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        // Update state or display errors in the UI
        console.log("Validation errors:", validationErrors);
      } else {
        if (err.response) {
          console.log("Server error:", err.response.data);
        } else {
          console.log("Axios error:", err);
        }
      }
    }
  };

  //handle read all feedback
  const handleAllFeedback = async () => {
    try {
      const response = await axios.get(
        `https://backend-api-system.azurewebsites.net/api/comment`
      );
      const data = await response.data;
      if (Array.isArray(data) && data.length > 0) {
        const filteredFeedback = data.filter(
          (feedback) =>
            feedback.contributionData.ContributionId === contributionId
        );
        console.log(filteredFeedback);
        setFeedbackData(filteredFeedback);
        if (filteredFeedback.length > 0) {
          setCommentId(filteredFeedback[0].commentId);
        }
        setIsFeedBack(filteredFeedback.length > 0);
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
    handleAllFeedback();
  }, [formData.contributionId]);

  //handle edit feedback
  const handleEditFeedback = async () => {
    try {
      if (feedbackData && feedbackData.length > 0) {
        const response = await axios.put(
          `https://backend-api-system.azurewebsites.net/api/comment/update?id=${commentId}`,
          {
            review: feedbackData,
          }
        );
        if (response.status === 200) {
          const newData = response.data;
          console.log("Update Success", newData);
          setFeedbackData(newData);
        }
      } else {
        console.log("Feedback Data is empty.");
      }
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };

  //handle delete
  const handleDeleteFeedback = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete");
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `https://backend-api-system.azurewebsites.net/api/comment/delete?id=${commentId}`
        );
        if (response.status === 200) {
          setIsFeedBack(false);
          setFeedbackData("");
        }
      } catch (err) {
        if (err.response) {
          console.log("Server error:", err.response.data);
        } else {
          console.log("Axios error:", err);
        }
      }
    }
  };

  // handle file input change
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        document: file,
        fileName: file,
        newFile: file,
      }));
    }
  };

  //handle feedback input change
  const handleFeedbackChange = (e) => {
    setFeedbackData(e.target.value);
  };

  //handle open terms
  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  //handle close terms
  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  return (
    <div className={style["container"]}>
      {/* HEADER */}
      <div className={style["header"]}>
        <Header />
      </div>
      <ToastContainer />
      <div className={style["table"]}>
        <TableContainer
          style={{ width: "60%", alignSelf: "center" }}
          component={Paper}
        >
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                  className={style["CotTrai"]}
                >
                  Title
                </TableCell>
                <TableCell align="left" className={style["CotPhai"]}>
                  {eventData ? eventData.eventName : "Loading..."}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                >
                  Open Date
                </TableCell>
                <TableCell align="left" className={style["CotPhai"]}>
                  {eventData ? formatDate(eventData.openDate) : "Loading..."}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                >
                  Close Date
                </TableCell>
                <TableCell align="left" className={style["CotPhai"]}>
                  {eventData ? formatDate(eventData.closeDate) : "Loading..."}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                >
                  Student Name
                </TableCell>
                <TableCell align="left" className={style["CotPhai"]}>
                  {studentData ? studentData.studentName : "Loading..."}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                >
                  Student Email
                </TableCell>
                <TableCell align="left" className={style["CotPhai"]}>
                  {studentData ? studentData.accountData.Email : "Loading..."}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                >
                  File Submissions
                </TableCell>

                <TableCell align="left" className={style["CotPhai"]}>
                  {!isEditing && (
                    <>
                      {!isUpload && formData.document ? (
                        <>
                          <span>{formData.document.name}</span>
                          {errors.document && (
                            <div className={style["error"]}>
                              {errors.document}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <label
                            htmlFor="fileInput"
                            className={style["uploadFile"]}
                            style={{ display: isUpload ? "none" : "inline" }} // Ẩn nút khi isUpload là true
                          >
                            Choose File
                            <input
                              id="fileInput"
                              className={style["fileInput"]}
                              type="file"
                              onChange={(e) => handleChange(e)}
                              style={{ display: "none" }}
                            />
                          </label>
                        </>
                      )}

                      {isUpload && (
                        <div>
                          <span>{formData.document.fileName}</span>
                        </div>
                      )}
                    </>
                  )}

                  {isEditing && (
                    <>
                      {isUpload && formData.newFile ? (
                        <span>{formData.newFile.name}</span>
                      ) : (
                        <label
                          htmlFor="fileInput"
                          className={style["uploadFile"]}
                        >
                          Choose File
                          <input
                            id="fileInput"
                            className={style["fileInput"]}
                            type="file"
                            onChange={(e) => handleChange(e)}
                            style={{ display: "none" }}
                          />
                        </label>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                >
                  Submission Comments
                </TableCell>
                <TableCell align="left" className={style["CotPhai"]}>
                  <div>
                    {role === "student" && (
                      <input
                        type="text"
                        id="commentInput"
                        name="commentInput"
                        placeholder="Wite Feedback"
                        style={{
                          width: "300px",
                          padding: "5px",
                          borderRadius: "3px",
                          border: "1px solid #ccc",
                        }}
                        // disabled
                      />
                    )}

                    {role === "coordinator" && (
                      <input
                        type="text"
                        id="commentInput"
                        name="commentInput"
                        placeholder="Write Feedback"
                        style={{
                          width: "300px",
                          padding: "5px",
                          borderRadius: "3px",
                          border: "1px solid #ccc",
                        }}
                        onChange={(e) => handleFeedbackChange(e)}
                        value={
                          typeof feedbackData === "string" ? feedbackData : ""
                        }
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    alignSelf: "center",
                  }}
                >
                  Feedback
                </TableCell>
                <TableCell align="left" className={style["CotPhai"]}>
                  {Array.isArray(feedbackData) && feedbackData.length > 0 ? (
                    <div>
                      {feedbackData.map((feedback, index) => (
                        <div key={index}>
                          <span>{feedback.review}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No Feedback yet</div>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className={style["btn-action"]}>
        <ModalTerms
          isOpen={openTerms}
          handleClose={handleCloseTerms}
          handleUpload={handleFileUpload}
        />
        {/* student-action */}
        {!isEditing && role === "student" && (
          <>
            {isUpload ? (
              <>
                <button
                  type="file"
                  className={style["submit-btn"]}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubmit()}
                  className={style["submit-btn"]}
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                type="file"
                className={style["submit-btn"]}
                onClick={() => handleOpenTerms()}
              >
                Upload
              </button>
            )}
          </>
        )}
        {isEditing && role === "student" && (
          <>
            {isUpload ? (
              <button
                type="file"
                className={style["submit-btn"]}
                onClick={() => handleEditSubmit()}
              >
                Update
              </button>
            ) : (
              <>
                <button
                  type="file"
                  className={style["submit-btn"]}
                  onClick={() => handleEditSubmit()}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubmit()}
                  className={style["submit-btn"]}
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}

        {/* feedback action */}
        {!isEditFeedback && role === "coordinator" && (
          <>
            {isFeedback ? (
              <>
                <button
                  type="file"
                  className={style["submit-btn"]}
                  onClick={() => setIsEditFeedback(true)}
                >
                  Edit Feedback
                </button>
                <button
                  onClick={() => handleDeleteFeedback()}
                  className={style["submit-btn"]}
                >
                  Delete Feedback
                </button>
              </>
            ) : (
              <button
                type="file"
                className={style["submit-btn"]}
                onClick={() => handleFeedback()}
              >
                Feedback
              </button>
            )}
          </>
        )}
        {isEditFeedback && role === "coordinator" && (
          <>
            {isFeedback ? (
              <button
                type="file"
                className={style["submit-btn"]}
                onClick={() => handleEditFeedback()}
              >
                Feedback
              </button>
            ) : (
              <>
                <button
                  type="file"
                  className={style["submit-btn"]}
                  onClick={() => handleEditFeedback()}
                >
                  Edit Feedback
                </button>
                <button
                  onClick={() => handleDeleteFeedback()}
                  className={style["submit-btn"]}
                >
                  Delete Feedback
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StudentSubmitForm;
