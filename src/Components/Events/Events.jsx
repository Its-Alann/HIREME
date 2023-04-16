import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
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

  //   const eventInfo = {
  //     name: "Event Name",
  //     address: "Address",
  //     date: "01/01/2023",
  //   };

  useEffect(() => {
    getEvents(companyID);
  }, []);

  return (
    <div>
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
