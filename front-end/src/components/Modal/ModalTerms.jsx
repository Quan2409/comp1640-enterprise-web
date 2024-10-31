import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { CheckBox, CloseOutlined } from "@mui/icons-material";

const styles = {
  modalStyle: {
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0, .2)",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackGround: {
    display: "flex",
    background: "white",
    padding: 20,
    borderRadius: 6,
    flexDirection: "column",
    width: "30vw",
  },
  iconX: {
    // background: '#cfc',
  },
  title: {
    display: "flex",
    // background: 'lightPink',
    marginTop: 0,
    justifyContent: "center",
  },
  bodyChuden: {
    fontSize: 15,
    marginBottom: 10,
  },
  bodyContainer: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    overflowY: "auto",
    maxHeight: "300px",
  },
};

const ModalTerms = ({ isOpen, handleClose, handleUpload }) => {
  // state
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleAgree = () => {
    if (isChecked) {
      handleUpload();
      handleClose();
    } else {
      alert("Please agree to the terms before continuing.");
    }
  };

  const labelStyle = {
    marginLeft: 10,
    color: isChecked ? "black" : "red",
    fontWeight: 600,
  };

  return (
    <>
      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={styles.modalStyle}>
          <div style={styles.modalBackGround}>
            {/* close */}
            <div style={styles.iconX}>
              <Button
                onClick={handleClose}
                startIcon={<CloseOutlined />}
                sx={{
                  color: "black",
                  "&:hover": {
                    backgroundColor: "red",
                    color: "white",
                  },
                }}
              />
            </div>

            {/* title */}
            <div style={styles.title}>
              <p style={{ fontSize: 20, fontWeight: "550" }}>
                Terms enforcement
              </p>
            </div>

            {/* body */}
            <div style={styles.bodyContainer}>
              <p style={styles.bodyChuden}>
                1. Acceptance of University Policies and Regulations: Students
                must accept and comply with university regulations and policies,
                including those regarding academic ethics and copyright.
              </p>
              <p style={styles.bodyChuden}>
                2. Automatic Publication and Sharing: Students agree that their
                submissions may be published and shared with communities within
                and outside the university for academic or promotional purposes.
              </p>
              <p style={styles.bodyChuden}>
                3. No Copying or Plagiarism: Students undertake that all
                submissions are their own work and that there is no copying or
                copyright infringement from any other source.
              </p>
              <p style={styles.bodyChuden}>
                4. Acceptance of Assessment and Feedback: Students accept that
                their submission may be subject to assessment and feedback from
                teachers or instructors.
              </p>
              <p style={styles.bodyChuden}>
                5. Acceptance of Information Security Policy: Students agree to
                comply with the school's information security policy, including
                not sharing personal or important information with others.
              </p>
              <p style={styles.bodyChuden}>
                6. Acceptance of Technology Use Policy: Students commit to
                comply with the school's technology use policy, including the
                use of computers, the internet and other electronic resources.
              </p>
              <p style={styles.bodyChuden}>
                7. Acceptance of Copyright and Intellectual Property Rights:
                Students agree that they will not infringe the copyright or
                intellectual property rights of any person or entity in the
                course of submitting their work.
              </p>
              <p style={styles.bodyChuden}>
                8. Acceptance of Personal Responsibility: Students accept
                personal responsibility for the content of the submission and
                responsibility for any consequences arising from breach of the
                terms and conditions.
              </p>
              <p style={styles.bodyChuden}>
                9. Acceptance of Penalties and Decisions of the University:
                Students agree that violation of regulations and conditions may
                result in penalties or decisions on the part of the university.
              </p>
              <p style={styles.bodyChuden}>
                10. Acceptance of Changes and Updates: Students agree that these
                terms and conditions may be changed or updated at any time, and
                will be subject to any newly published versions.
              </p>

              <div
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  style={{ transform: "scale(1.5)", cursor: "pointer" }}
                />

                <label style={labelStyle}>
                  Agree to all of the above terms
                </label>
              </div>
            </div>

            <button
              style={{
                margin: "10px auto",
                border: "none",
                padding: "10px",
                width: 150,
                background: "#ed4700",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={handleAgree}
            >
              Agree
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ModalTerms;
