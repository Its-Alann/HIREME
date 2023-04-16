import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import { db } from "../../Firebase/firebase";

const Events = ({ companyID, companyLogo, companyName }) => {
  const [events, setEvents] = useState([]);

  // takes company ID
  const getEvents = async (company) => {
    const eventsList = [];
    const querySnapshot = await getDocs(
      collection(db, `companies2/${company}/events`)
    );
    querySnapshot.forEach((doc) => {
      eventsList.push(doc.data());
    });
    setEvents(eventsList);
  };

  useEffect(() => {
    getEvents(companyID);
  }, []);

  return (
    <div>
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
            <PostAddIcon sx={{ fontSize: "25px" }} />
          </Stack>
        </Link>
      </Button>

      {events.map((event) => (
        <EventCard
          key={event.id}
          eventInfo={{
            name: event.name,
            address: event.address,
            date: event.date,
          }}
          companyLogo={companyLogo}
          companyName={companyName}
        />
      ))}
    </div>
  );
};

Events.propTypes = {
  companyID: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  companyLogo: PropTypes.string.isRequired,
};

export default Events;
