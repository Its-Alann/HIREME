import { React, useState } from "react";
import {
  Grid,
  Button,
  Modal,
  Box,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAuth } from "firebase/auth";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/firebase";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configue worker viewer
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

/**
 * @brief Handles resume uploads, modifications and viewing current file
 *
 * @param[in] resumeUrl Resume url retrieved from firebase if it exists
 *
 * @return Resume component
 */
const Resume = ({ resumeUrl, visitingProfile }) => {
  // Current resume url created from file upload
  const [url, setUrl] = useState("");
  // Variable to hide submit button
  const [hidden, setHidden] = useState(true);
  // Variable to store resume value and name
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  // Variable to check if a new resume is uploaded
  const [newResume, setNewResume] = useState(false);
  // State to show resume preview
  const [showResume, setShowResume] = useState(false);
  const handleOpenResume = () => setShowResume(true);
  const handleCloseResume = () => setShowResume(false);

  // State to show/hide alert
  const [showAlert, setShowAlert] = useState(false);

  // Function to close alerts
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  // Store Page number for modal
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Function to load document
  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    setPageNumber(1);
    console.log(resumeUrl);
  };

  // Function to change page
  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  // Function to view previous page
  const previousPage = () => {
    changePage(-1);
  };
  // Function to view next page
  const nextPage = () => {
    changePage(1);
  };

  // Theme for the component
  const theme = createTheme({
    palette: {
      primary: { main: "#2B2F90" },
      background: { main: "#EAEAEA" },
      gray: { main: "#757575" },
    },
    typography: {
      fontFamily: ["Proxima Nova"],
    },
  });

  // Function to handle resume submit
  const handleSubmit = () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const resumeLink = `${user.email}-resume`;
      const resumeRef = ref(storage, `resumes/${resumeLink}`);
      uploadBytes(resumeRef, resume)
        .then(() => {
          getDownloadURL(resumeRef)
            // eslint-disable-next-line no-shadow
            .then((url) => {
              setUrl(url);
              setShowAlert(true);
            })
            .catch((error) => {
              console.log(error.message, "error getting the resume url");
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle resume file upload changes
  const handleResumeChange = (e) => {
    if (e.target.files[0]) {
      setResume(e.target.files[0]);
      setResumeName(e.target.files[0].name);
      setHidden(false);
      setNewResume(true);
      console.log(resumeUrl);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Container */}
      <Grid
        container
        display="flex"
        style={{
          paddingLeft: 40,
          paddingBottom: 10,
          display: visitingProfile ? "none" : "block",
        }}
      >
        {/* Title, upload file button and file name display */}
        <Grid item xs={12} md={12}>
          <h4 style={{ color: "#eaeaea" }}>Upload a resume!</h4>
          <Button
            component="label"
            style={{ backgroundColor: "#eaeaea" }}
            color="primary"
            variant="outlined"
            name="UploadBtn"
          >
            Upload a file
            <input
              accept="application/pdf"
              type="file"
              onChange={handleResumeChange}
              color="#eaeaea"
              hidden
            />
          </Button>
          <Typography
            variant="primary"
            style={{ color: "white", paddingLeft: "10px" }}
          >
            File Chosen: {resumeName === "" ? "none" : resumeName}
          </Typography>
        </Grid>
        {/* View resume and submit button */}
        <Grid item xs={12} md={12}>
          <Button
            style={{
              backgroundColor: "#eaeaea",
              display: hidden && resumeUrl === undefined ? "none" : "inline",
              width: "129px",
            }}
            color="primary"
            variant="outlined"
            onClick={handleOpenResume}
          >
            View Resume
          </Button>
          <Button
            onClick={handleSubmit}
            justifyContent="center"
            textAlign="center"
            type="submit"
            style={{
              backgroundColor: "#eaeaea",
              display: hidden ? "none" : "inline",
              marginLeft: "12px",
            }}
          >
            Submit
          </Button>

          {/* Alert for resume Upload status */}
          <Snackbar
            open={showAlert}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="success"
              sx={{ width: "100%" }}
            >
              Resume Upload Sucessful!
            </Alert>
          </Snackbar>

          {/* Modal Body used to display pdf */}
          <Modal open={showResume} onClose={handleCloseResume}>
            <Box
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "auto",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <div style={{ backgroundColor: "white" }}>
                <Document
                  file={
                    resumeUrl !== undefined && newResume === false
                      ? resumeUrl
                      : resume
                  }
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading="Loading resume, please wait..."
                  onLoadError={(error) =>
                    // eslint-disable-next-line no-alert
                    alert(`Error while loading document! ${error.message}`)
                  }
                >
                  <Page pageNumber={pageNumber} />
                </Document>
                <div
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <p>
                    Page {pageNumber || (numPages ? 1 : "--")} of{" "}
                    {numPages || "--"}
                  </p>
                  <Button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    sx={{ mt: 3, mb: 2, py: 1 }}
                    color="primary"
                    variant="outlined"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                    sx={{ mt: 3, mb: 2, py: 1 }}
                    color="primary"
                    variant="outlined"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

Resume.propTypes = {
  resumeUrl: PropTypes.string,
  visitingProfile: PropTypes.bool,
};

export default Resume;
