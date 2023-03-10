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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [transcript, setTranscript] = useState(null);

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
    <ThemeProvider theme={theme}>
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 600,
        }}
      >
        <Grid
          container
          sx={{
            
            bgcolor: "white",
            maxWidth: 600,
          }}
        >
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h3"> Your Application </Typography>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              You are applying for: Nuance Product Manager
            </Typography>
          </Grid>
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
          {/* <Grid container md={12} sm={12} xs={12} spacing={5}>
          <Grid item>
            <TextField id="standard-basic" label="Email" variant="standard" />
          </Grid>
          <Grid item>
            <TextField
              id="standard-basic"
              label="Phone Number"
              variant="standard"
            />
          </Grid>
        </Grid> */}
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField id="standard-basic" label="Email" variant="standard" />
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              id="standard-basic"
              label="Phone Number"
              variant="standard"
            />
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField id="standard-basic" label="Address" variant="standard" />
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              my: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
      </Grid>
    </ThemeProvider>
  );
};

export default JobApplication;
