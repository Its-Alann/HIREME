import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  IconButton,
  Divider,
  Box,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from "../../../Components/FileUpload/FileUpload";
import { db } from "../../../Firebase/firebase";

const JobApplication = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  // Define the MUI theme to be used in the component
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

  // Define state variables for the form input fields and files to be uploaded
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeUrlfromDB, setResumeUrlfromDB] = useState(null);
  const [resumeChanged, setResumeChanged] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [resumeReq, setResumeReq] = useState(false);
  const [coverLetterReq, setCoverLetterReq] = useState(false);
  const [transcriptReq, setTranscriptReq] = useState(false);
  const [fileUrls, setFileUrls] = useState({});

  // Patterns that the email, phone number and address must match in order for it to be an
  // eligible application
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{10}$/;
  const addressPattern = /^.+$/;

  // Job ID and company ID retrieved from the URL
  const URLjobID = useParams().jobID;
  const URLcompanyID = useParams().companyID;

  const auth = getAuth();

  // Event handler function to update the state variables when a file is selected for upload
  const onFileChange = (e, fileType) => {
    e.preventDefault();
    switch (fileType) {
      case "resume":
        setResumeChanged(true);
        setResume(e.target.files[0]);
        console.log(fileType, e.target.files[0]);
        break;

      case "coverLetter":
        setCoverLetter(e.target.files[0]);
        console.log(fileType, e.target.files[0]);
        break;

      case "transcript":
        setTranscript(e.target.files[0]);
        console.log(fileType, e.target.files[0]);
        break;

      default:
    }
  };

  // Function that uploads the documents that users have uploaded to firebase
  const uploadDocuments = async () => {
    const storage = getStorage();

    // Creates a location for a resume in Firebase storage with the company name under the /job-applications/ directory
    // ex: /job-applications/microsoft/software-dev/resume.jpg
    const resumeRef = ref(
      storage,
      `/job-applications/${companyName.toLowerCase()}/${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}/${email}/resume.jpg`
    );

    // Creates a location for a cover letter in Firebase storage with the company name under the /job-applications/ directory
    // ex: /job-applications/microsoft/software-dev/coverletter.jpg
    const coverLetterRef = ref(
      storage,
      `/job-applications/${companyName.toLowerCase()}/${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}/${email}/coverletter.jpg`
    );

    // Creates a location for a transcript in Firebase storage with the company name under the /job-applications/ directory
    // ex: /job-applications/microsoft/software-dev/transcript.jpg
    const transcriptRef = ref(
      storage,
      `/job-applications/${companyName.toLowerCase()}/${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}/${email}/transcript.jpg`
    );

    const temp = fileUrls;
    // If the resume, cover letter or transcript are null, they will not send any data to the Firestore storage
    if (resume != null) {
      try {
        await uploadBytes(resumeRef, resume);
        const url = await getDownloadURL(resumeRef);
        //console.log("url", url);
        temp.resume = url;
        setFileUrls({ ...temp });
      } catch (error) {
        console.log(error);
      }
    }
    if (coverLetter != null) {
      try {
        await uploadBytes(coverLetterRef, coverLetter);
        const url = await getDownloadURL(coverLetterRef);
        //console.log("url", url);
        temp.coverLetter = url;
        setFileUrls({ ...temp });
      } catch (error) {
        console.log(error);
      }
    }
    // setFileUrls({ ...temp });
    //console.log(fileUrls);
    if (transcript != null) {
      try {
        await uploadBytes(transcriptRef, transcript);
        const url = await getDownloadURL(transcriptRef);
        //console.log("url", url);
        temp.transcript = url;
        setFileUrls({ ...temp });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Adds the job application information to the applications collection on Firestore. Appends to user's
  // job array with the job ID, status, email, phone number and address given by the user during application
  const addJobApplication = async () => {
    console.log("inJOB22", fileUrls);

    if (
      (resumeReq && resumeChanged && fileUrls.resume !== null) ||
      !resumeReq ||
      (((resumeReq && !resumeChanged && resumeUrlfromDB !== null) ||
        !resumeReq) &&
        ((coverLetterReq && fileUrls.coverLetter !== null) ||
          !coverLetterReq) &&
        ((transcriptReq && fileUrls.transcript !== null) || !transcriptReq))
    ) {
      const coverletterURL = fileUrls.coverLetter ? fileUrls.coverLetter : "";
      const transcriptURL = fileUrls.transcript ? fileUrls.transcript : "";
      const resumeURL = fileUrls.resume ? fileUrls.resume : resumeUrlfromDB;

      await addDoc(
        collection(db, "applications2"),
        // eslint-disable-next-line no-undef
        {
          jobID: URLjobID,
          status: "pending",
          email,
          applicantEmail: currentUserEmail,
          phoneNumber,
          address,
          urlCoverLetter: coverletterURL,
          urlResume: resumeURL,
          urlTranscript: transcriptURL,
        },
        { merge: true }
      );
    } else {
      console.log("failed coverletter=undefinied");
    }
  };

  // Handles the submit button and validates the form. If the inputs are incorrect, the application will not be submitted
  const onSubmit = () => {
    if (
      (emailPattern.test(email) &&
        phonePattern.test(phoneNumber) &&
        addressPattern.test(address)) === false ||
      (resumeReq === true && resume === null && resumeChanged === true) ===
        true ||
      (resumeReq === true &&
        resumeUrlfromDB === null &&
        resumeChanged === false) === true ||
      (coverLetterReq === true && coverLetter === null) === true ||
      (transcriptReq === true && transcript === null) === true
    ) {
      if (!emailPattern.test(email)) {
        console.log("enter a valid email format");
      }
      if (!phonePattern.test(phoneNumber)) {
        console.log("enter a valid phone number");
      }
      if (!addressPattern.test(address)) {
        console.log("enter a valid address");
      }
      if (
        (resumeReq === true && resume === null && resumeChanged === true) ||
        (resumeReq === true &&
          resumeUrlfromDB === null &&
          resumeChanged === false)
      ) {
        console.log("upload a resume");
      }
      if (coverLetterReq === true && coverLetter === null) {
        console.log("upload a cover letter");
      }
      if (transcriptReq === true && transcript === null) {
        console.log("upload a transcript");
      }
    } else {
      uploadDocuments().then(() => {
        addJobApplication();
      });
      console.log("completed");
      navigate(`/browseJobs`);
    }
  };

  // Gets the job title from Firestore jobs collection
  const getJobTitle = async () => {
    try {
      const docSnap = await getDoc(doc(db, "jobs2", URLjobID));
      const jobData = docSnap.data();
      setJobTitle(jobData.title);
      setResumeReq(jobData.resume);
      setCoverLetterReq(jobData.coverLetter);
      setTranscriptReq(jobData.transcript);
    } catch (error) {
      console.log(error);
    }
  };

  // Gets the company name from Firestore companies collection
  const getCompanyName = async () => {
    try {
      const docSnap = await getDoc(doc(db, "companies2", URLcompanyID));
      const jobData = docSnap.data();
      setCompanyName(jobData.name);
    } catch (error) {
      console.log(error);
    }
  };

  // On load, this will set the current user's email and retrieve the job title and company name
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        console.error("No user found");
      }
    });
    getJobTitle();
    getCompanyName();
  }, []);

  // Remove resume when user select delete-icon
  const onDeleteFileResume = () => {
    setResume(null);
    setResumeUrlfromDB(null);
  };

  // Display resume file name accordingly
  const fileNameResume = resume ? resume.name : "Resume";

  // Get url from resume file
  const onDownloadResume = () => {
    if (resumeChanged) {
      const url = window.URL.createObjectURL(new Blob([resume]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resume.name);
      document.body.appendChild(link);
      link.click();
    } else {
      window.open(resumeUrlfromDB);
    }
  };

  // Remove coverLetter when user select delete-icon
  const onDeleteFileCoverLetter = () => {
    setCoverLetter(null);
  };

  // Display coverLetter file name accordingly
  const fileNameCoverLetter = coverLetter ? coverLetter.name : "";

  // Get url from coverLetter file
  const onDownloadCoverLetter = () => {
    const url = window.URL.createObjectURL(new Blob([coverLetter]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", coverLetter.name);
    document.body.appendChild(link);
    link.click();
    console.log(url);
  };

  // Remove transcript when user select delete-icon
  const onDeleteFileTranscript = () => {
    setTranscript(null);
  };

  // Display transcript file name accordingly
  const fileNameTranscript = transcript ? transcript.name : "";

  // Get url from transcript file
  const onDownloadTranscript = () => {
    const url = window.URL.createObjectURL(new Blob([transcript]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", transcript.name);
    document.body.appendChild(link);
    link.click();
  };

  // get existing resume from db (if exists)
  useEffect(() => {
    const storage = getStorage();
    //Get user resume from firebase
    const resumeLink = `${currentUserEmail}-resume`;
    const resumeRef = ref(storage, `resumes/${resumeLink}`);
    getDownloadURL(resumeRef)
      // eslint-disable-next-line no-shadow
      .then((resumeUrl) => {
        setResumeUrlfromDB(resumeUrl);
      })
      .catch((error) => {
        if (error.code === "storage/object-not-found") {
          console.log("Resume does not exist");
        } else {
          console.error("Error checking if resume exists:", error);
        }
      });
  }, [currentUserEmail]);

  return (
    // Apply the MUI theme to the component using the ThemeProvider component
    <ThemeProvider theme={theme}>
      <Grid
        container
        sx={{
          bgcolor: "white",
          maxWidth: 1200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          mx: "auto",
          my: 10,
        }}
      >
        {/* Page title */}
        <Grid item md={12} sm={12} xs={12} sx={{ mt: 4 }}>
          <Typography variant="h3">{t("YourApplication")}</Typography>
        </Grid>

        {/* Job title */}
        <Grid item md={12} sm={12} xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6">
            {t("Youareapplyingfor:")} {`${companyName} ${jobTitle}`}
          </Typography>
        </Grid>

        {/* List of files to upload */}
        <Grid item>
          <List>
            {/* Resume Section */}
            {resumeReq === true ? (
              <>
                <ListItem disableGutters>
                  <ListItemText sx={{ mr: 5 }}>
                    <Box display="flex" flexDirection="column">
                      <Typography color="#d32f2f"> {t("Resume*")}</Typography>
                      <Typography variant="caption" color="#d32f2f">
                        {t("Required-PleaseuploadaResume")}
                      </Typography>
                    </Box>
                  </ListItemText>
                  {resume || resumeUrlfromDB ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={onDownloadResume}
                          sx={{
                            marginLeft: 1,
                            padding: 0,
                            textTransform: "none",
                            color: "blue",
                            textDecoration: "underline",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Typography>{fileNameResume}</Typography>
                        </Button>

                        <Box display="flex" mt={1}>
                          <IconButton
                            aria-label="delete"
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={onDeleteFileResume}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Box>
                  ) : (
                    <FileUpload
                      onFileChange={(e) => onFileChange(e, "resume")}
                      data-testid="upload-resume"
                      // fileUploadText={fileUploadText}
                    />
                  )}
                </ListItem>
                {/* <Divider /> */}
              </>
            ) : (
              <ListItem disableGutters>
                <ListItemText sx={{ mr: 5 }}>
                  <Box display="flex" flexDirection="column">
                    <Typography>{t("Resume")}</Typography>
                    <Typography variant="caption">{t("Optional")}</Typography>
                  </Box>
                </ListItemText>
                {resume || resumeUrlfromDB ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={onDownloadResume}
                        sx={{
                          marginLeft: 1,
                          padding: 0,
                          textTransform: "none",
                          color: "blue",
                          textDecoration: "underline",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>{fileNameResume}</Typography>
                      </Button>

                      <Box display="flex" mt={1}>
                        <IconButton
                          aria-label="delete"
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={onDeleteFileResume}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  <FileUpload
                    onFileChange={(e) => onFileChange(e, "resume")}
                    data-testid="upload-resume"
                    // fileUploadText={fileUploadText}
                  />
                )}
              </ListItem>
            )}

            {/* Cover Letter Section */}
            {coverLetterReq === true ? (
              <>
                <ListItem disableGutters>
                  <ListItemText sx={{ mr: 5 }}>
                    <Box display="flex" flexDirection="column">
                      <Typography color="#d32f2f">
                        {t("CoverLetter*")}
                      </Typography>
                      <Typography variant="caption" color="#d32f2f">
                        {t("Required-PleaseuploadaCoverLetter")}
                      </Typography>
                    </Box>
                  </ListItemText>
                  {coverLetter ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={onDownloadCoverLetter}
                          sx={{
                            marginLeft: 1,
                            padding: 0,
                            textTransform: "none",
                            color: "blue",
                            textDecoration: "underline",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Typography>{fileNameCoverLetter}</Typography>
                        </Button>

                        <Box display="flex" mt={1}>
                          <IconButton
                            aria-label="delete"
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={onDeleteFileCoverLetter}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Box>
                  ) : (
                    <FileUpload
                      onFileChange={(e) => onFileChange(e, "coverLetter")}
                      data-testid="upload-coverLetter"
                    />
                  )}
                </ListItem>
                {/* <Divider /> */}
              </>
            ) : (
              <ListItem disableGutters>
                <ListItemText sx={{ mr: 5 }}>
                  <Box display="flex" flexDirection="column">
                    <Typography>{t("CoverLetter")}</Typography>
                    <Typography variant="caption">{t("Optional")}</Typography>
                  </Box>
                </ListItemText>
                {coverLetter ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={onDownloadCoverLetter}
                        sx={{
                          marginLeft: 1,
                          padding: 0,
                          textTransform: "none",
                          color: "blue",
                          textDecoration: "underline",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>{fileNameCoverLetter}</Typography>
                      </Button>

                      <Box display="flex" mt={1}>
                        <IconButton
                          aria-label="delete"
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={onDeleteFileCoverLetter}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  <FileUpload
                    onFileChange={(e) => onFileChange(e, "coverLetter")}
                    data-testid="upload-coverLetter"
                  />
                )}
              </ListItem>
            )}

            {/* Transcript Section */}
            {transcriptReq === true ? (
              <>
                <ListItem disableGutters>
                  <ListItemText sx={{ mr: 5 }}>
                    <Box display="flex" flexDirection="column">
                      <Typography color="#d32f2f">
                        {t("Transcript*")}
                      </Typography>
                      <Typography variant="caption" color="#d32f2f">
                        {t("Required-PleaseuploadaTranscript")}
                      </Typography>
                    </Box>
                  </ListItemText>
                  {transcript ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={onDownloadTranscript}
                          sx={{
                            marginLeft: 1,
                            padding: 0,
                            textTransform: "none",
                            color: "blue",
                            textDecoration: "underline",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Typography>{fileNameTranscript}</Typography>
                        </Button>

                        <Box display="flex" mt={1}>
                          <IconButton
                            aria-label="delete"
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={onDeleteFileTranscript}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Box>
                  ) : (
                    <FileUpload
                      onFileChange={(e) => onFileChange(e, "transcript")}
                      data-testid="upload-transcript"
                    />
                  )}
                </ListItem>
                {/* <Divider /> */}
              </>
            ) : (
              <ListItem disableGutters>
                <ListItemText sx={{ mr: 5 }}>
                  <Box display="flex" flexDirection="column">
                    <Typography>{t("Transcript")}</Typography>
                    <Typography variant="caption">{t("Optional")}</Typography>
                  </Box>
                </ListItemText>
                {transcript ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={onDownloadTranscript}
                        sx={{
                          marginLeft: 1,
                          padding: 0,
                          textTransform: "none",
                          color: "blue",
                          textDecoration: "underline",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>{fileNameTranscript}</Typography>
                      </Button>

                      <Box display="flex" mt={1}>
                        <IconButton
                          aria-label="delete"
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={onDeleteFileTranscript}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  <FileUpload
                    onFileChange={(e) => onFileChange(e, "transcript")}
                    data-testid="upload-transcript"
                  />
                )}
              </ListItem>
            )}
          </List>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            label={t("Email")}
            variant="standard"
            InputLabelProps={{ required: true }}
            onChange={(e) => setEmail(e.target.value)}
            error={emailPattern.test(email) === false}
            helperText={
              emailPattern.test(email) === false
                ? `${t("Pleaseenteravalidemail")}`
                : ""
            }
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            label={t("PhoneNumber")}
            variant="standard"
            InputLabelProps={{ required: true }}
            inputProps={{
              onKeyPress: (event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              },
              maxLength: 10,
              inputMode: "numeric",
            }}
            placeholder="123-123-1234"
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={phonePattern.test(phoneNumber) === false}
            helperText={
              phonePattern.test(phoneNumber) === false
                ? `${t("Pleaseenteravalidnumber")}`
                : ""
            }
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            label={t("Address")}
            variant="standard"
            InputLabelProps={{ required: true }}
            onChange={(e) => setAddress(e.target.value)}
            error={addressPattern.test(address) === false}
            helperText={
              addressPattern.test(address) === false
                ? `${t("Pleaseenteravalidaddress")}`
                : ""
            }
          />
        </Grid>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          sx={{
            my: 5,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            data-testid="submit-button"
            onClick={onSubmit}
          >
            {t("Submit")}
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default JobApplication;
