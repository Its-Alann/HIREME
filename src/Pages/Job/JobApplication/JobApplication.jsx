import React, { useState } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FileUpload from "../../../Components/FileUpload/FileUpload";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [transcript, setTranscript] = useState(null);

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
            You are applying for: Nuance Product Manager
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
          <TextField id="standard-basic" label="Email" variant="standard" />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField
            id="standard-basic"
            label="Phone Number"
            variant="standard"
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <TextField id="standard-basic" label="Address" variant="standard" />
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
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default JobApplication;
