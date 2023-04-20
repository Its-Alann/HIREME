import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
import { Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { auth, db } from "../../Firebase/firebase";

const EditEvent = () => {
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [publishedAt, setPublishedAt] = useState(null);

  const [logoPath, setLogoPath] = useState("");
  const [companyName, setCompanyName] = useState("");

  const { companyID, eventID } = useParams();

  const [saved, setSaved] = useState(false);

  async function handleSubmit() {
    // update event
    await updateDoc(doc(db, `companies2/${companyID}/events`, eventID), {
      address,
      date,
      description,
      name,
    });
    setSaved(true);
  }

  async function getEventInfo() {
    const eventDocRef = doc(db, `companies2/${companyID}/events`, eventID);
    const docSnap = await getDoc(eventDocRef);
    if (docSnap.exists()) {
      const res = docSnap.data();
      setAddress(res.address);
      setDate(res.date.toDate());
      setDescription(res.description);
      setName(res.name);
      setPublishedAt(res.publishedAt);
    }
  }

  async function getCompanyInfo() {
    const companyDocRef = doc(db, "companies2", companyID);
    const docSnap = await getDoc(companyDocRef);
    if (docSnap.exists()) {
      const res = docSnap.data();
      setLogoPath(res.logoPath);
      setCompanyName(res.name);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getEventInfo();
        getCompanyInfo();
      }
    });
  }, []);

  useEffect(() => {
    let timeout;
    if (saved) {
      timeout = setTimeout(() => setSaved(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [saved]);

  return (
    <Container maxWidth="md" sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Button
          variant="contained"
          size="medium"
          id="Button-Back"
          sx={{ my: 2 }}
          href={`/${companyID}`}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Edit Event: {name}
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography>Company Name</Typography>
            <TextField
              required
              id="TextField-CompanyName"
              variant="standard"
              placeholder="Company Name"
              fullWidth
              value={companyName}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="DatePicker-Date"
                label="Event Date"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue.$d);
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Stack>

        {/* <Link to={`/${companyID}`}> */}
        <Button
          variant="contained"
          size="medium"
          id="Button-Save"
          sx={{ my: 2 }}
          onClick={() => handleSubmit()}
        >
          Save
        </Button>
        {saved && <Typography>Saved! ✔</Typography>}
        {/* </Link> */}
      </Box>
    </Container>
  );
};

export default EditEvent;
