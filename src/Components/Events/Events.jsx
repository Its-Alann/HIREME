import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { CircularProgress, Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import { db, auth } from "../../Firebase/firebase";

const Events = ({ companyID, companyLogo, companyName }) => {
  const [events, setEvents] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(false);

  // takes company ID
  const getEvents = async (company) => {
    const eventsList = [];
    const querySnapshot = await getDocs(
      collection(db, `companies2/${company}/events`)
    );
    querySnapshot.forEach((document) => {
      eventsList.push({ id: document.id, ...document.data() });
    });
    setEvents(eventsList);
  };

  const checkIsRecruter = async () => {
    const docRef = doc(db, "recruiters2", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setIsRecruiter(true);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        Promise.all([getEvents(companyID), checkIsRecruter()]);
      } else {
        //take you back to the homepage
        //console.log(user);
      }
    });
  }, []);

  return (
    <div>
      <Box sx={{ my: 2, mx: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4">Events</Typography>
          {isRecruiter ? (
            <Button
              variant="contained"
              size="medium"
              sx={{ my: 1 }}
              id="create-job"
              data-cy="view"
            >
              <Link
                to="./createEvent"
                className="link"
                underline="none"
                style={{ textDecoration: "none" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  alignSelf="center"
                  justifyContent="space-between"
                >
                  Create Event &nbsp;&nbsp;
                  <EventIcon sx={{ fontSize: "25px" }} />
                </Stack>
              </Link>
            </Button>
          ) : null}
        </Stack>

        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {events.map((event) => (
            <Grid item sx={{ m: 2 }}>
              <EventCard
                key={event.id}
                eventInfo={{
                  eventID: event.id,
                  name: event.name,
                  address: event.address,
                  date: event.date,
                  description: event.description,
                }}
                companyLogo={companyLogo}
                companyName={companyName}
                companyID={companyID}
                isRecruiter={isRecruiter}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

Events.propTypes = {
  companyID: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  companyLogo: PropTypes.string.isRequired,
};

export default Events;
