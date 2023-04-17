import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Checkbox from "@mui/material/Checkbox";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { auth, db } from "../../Firebase/firebase";

const CreateEvents = () => {
  const [eventInformation, setEventInformation] = React.useState({
    companyID: "",
    date: new Date(),
    description: "",
    address: "",
    publishedAt: new Date(),
    name: "",
  });

  const [companyName, setCompanyName] = React.useState({
    name: "",
  });

  async function handleSubmit() {
    await addDoc(
      collection(db, `companies2/${eventInformation.companyID}/events`),
      {
        ...eventInformation,
      }
    );
  }

  async function getCompanyInfo() {
    const recruiterRef = doc(db, "recruiters2", auth.currentUser.uid);
    const recruiterSnapshot = await getDoc(recruiterRef);
    if (recruiterSnapshot.exists()) {
      const companyID = recruiterSnapshot.data().workFor;
      if (companyID == null) {
        console.log("current recruiter's company ID not exist");
        return;
      }
      const companyRef = doc(db, "companies2", companyID);
      const companySnapshot = await getDoc(companyRef);
      if (companySnapshot.exists()) {
        setEventInformation({
          ...eventInformation,
          companyID,
          owner: auth.currentUser.uid,
        });
        setCompanyName({ name: companySnapshot.data().name });
      } else {
        console.log("current recruiter's company not exist");
      }
    } else {
      console.log("current user not a recruiter");
    }
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getCompanyInfo();
      }
    });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Event Creation
        </Typography>
        {/* is this supposed to be a public comment? */}

        <Stack spacing={2}>
          {/* i think we can exclude the ids */}
          {/* <Box>
            <Typography>Company ID</Typography>
            <TextField
              required
              id="TextField-CompanyID"
              variant="standard"
              placeholder="Company ID"
              fullWidth
              value={eventInformation.companyID}
              InputProps={{ readOnly: true }}
            />
          </Box> */}

          <Box>
            <Typography>Company Name</Typography>
            <TextField
              required
              id="TextField-CompanyName"
              variant="standard"
              placeholder="Company Name"
              fullWidth
              value={companyName.name}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box>
            <Typography>Event Name</Typography>
            <TextField
              required
              id="TextField-Name"
              variant="standard"
              placeholder="Event Name"
              fullWidth
              value={eventInformation.name}
              onChange={(e) =>
                setEventInformation({
                  ...eventInformation,
                  name: e.target.value,
                })
              }
            />
          </Box>

          <Box>
            <Typography>Address</Typography>
            <TextField
              required
              id="TextField-Address"
              variant="standard"
              placeholder="Address"
              fullWidth
              value={eventInformation.address}
              onChange={(e) =>
                setEventInformation({
                  ...eventInformation,
                  address: e.target.value,
                })
              }
            />
          </Box>

          <Box>
            <Typography>Event description</Typography>
            <TextField
              required
              id="TextField-Description"
              fullWidth
              multiline
              rows={4}
              value={eventInformation.description}
              onChange={(e) =>
                setEventInformation({
                  ...eventInformation,
                  description: e.target.value,
                })
              }
            />
          </Box>

          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="DatePicker-Date"
                label="Event Date"
                value={eventInformation.date}
                onChange={(newValue) => {
                  setEventInformation({
                    ...eventInformation,
                    date: newValue.$d,
                  });
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Stack>

        <Link to={`/${eventInformation.companyID}`}>
          <Button
            variant="contained"
            size="medium"
            id="Button-Save"
            sx={{ mt: 2 }}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default CreateEvents;
