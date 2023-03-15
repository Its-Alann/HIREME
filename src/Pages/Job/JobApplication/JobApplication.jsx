import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import FileUpload from "../../../Components/FileUpload/FileUpload";
import { db } from "../../../Firebase/firebase";

const JobApplication = () => {
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
  const [coverLetter, setCoverLetter] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{10}$/;
  const addressPattern = /^.+$/;

  const URLjobID = useParams().jobID;
  const URLcompanyID = useParams().companyID;

  // Event handler function to update the state variables when a file is selected for upload
  const onFileChange = (e, fileType) => {
    e.preventDefault();
    switch (fileType) {
      case "resume":
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

  const uploadDocuments = () => {
    const storage = getStorage();

    const resumeRef = ref(
      storage,
      `/job-applications/${companyName.toLowerCase()}/${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}/${email}/resume.jpg`
    );
    const coverLetterRef = ref(
      storage,
      `/job-applications/${companyName.toLowerCase()}/${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}/${email}/coverletter.jpg`
    );
    const transcriptRef = ref(
      storage,
      `/job-applications/${companyName.toLowerCase()}/${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}/${email}/transcript.jpg`
    );
    uploadBytes(resumeRef, resume);
    uploadBytes(coverLetterRef, coverLetter);
    uploadBytes(transcriptRef, transcript);
  };

  const onSubmit = () => {
    if (
      (emailPattern.test(email) &&
        phonePattern.test(phoneNumber) &&
        addressPattern.test(address)) === false
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
    } else {
      uploadDocuments();
      console.log("completed");
      console.log(
        "Data packet",
        resume,
        coverLetter,
        transcript,
        phoneNumber,
        address,
        email
      );
    }
  };

  const getJobTitle = async () => {
    try {
      const docSnap = await getDoc(doc(db, "jobs", URLjobID));
      const jobData = docSnap.data();
      setJobTitle(jobData.title);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanyName = async () => {
    try {
      const docSnap = await getDoc(doc(db, "companies", URLcompanyID));
      const jobData = docSnap.data();
      setCompanyName(jobData.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobTitle();
    getCompanyName();
  }, []);

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
        <Grid item md={12} sm={12} xs={12}>
          <Typography variant="h3"> Your Application </Typography>
        </Grid>

        {/* Job title */}
        <Grid item md={12} sm={12} xs={12}>
          <Typography variant="h6">
            You are applying for: {`${companyName} ${jobTitle}`}
          </Typography>
        </Grid>

        {/* List of files to upload */}
        <Grid item>
          <List>
            <ListItem disableGutters>
              <ListItemText sx={{ mr: 5 }}> Resume </ListItemText>
              <FileUpload
                onFileChange={(e) => onFileChange(e, "resume")}
                data-testid="upload-resume"
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText sx={{ mr: 5 }}> Cover Letter </ListItemText>
              <FileUpload
                onFileChange={(e) => onFileChange(e, "coverLetter")}
                data-testid="upload-coverLetter"
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText sx={{ mr: 5 }}> Transcript </ListItemText>
              <FileUpload
                onFileChange={(e) => onFileChange(e, "transcript")}
                data-testid="upload-transcript"
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            label="Email"
            variant="standard"
            InputLabelProps={{ required: true }}
            onChange={(e) => setEmail(e.target.value)}
            error={emailPattern.test(email) === false}
            helperText={
              emailPattern.test(email) === false
                ? "Please enter a valid email"
                : ""
            }
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            label="Phone Number"
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
                ? "Please enter a valid number"
                : ""
            }
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            label="Address"
            variant="standard"
            InputLabelProps={{ required: true }}
            onChange={(e) => setAddress(e.target.value)}
            error={addressPattern.test(address) === false}
            helperText={
              addressPattern.test(address) === false
                ? "Please enter a valid address"
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
            Submit
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default JobApplication;
