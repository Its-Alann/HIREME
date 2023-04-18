import { React, useState, useEffect } from "react";
import { doc, getFirestore, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import { app, auth } from "../../Firebase/firebase";
import NotificationCards from "../../Components/Notifications/NotificationCards";

const NotificationsPage = () => {
  // Theme for the page
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

  // Consts for user email, database and notifications
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const database = getFirestore(app);
  const [notifications, setNotifications] = useState([]);
  const [numOfNotifications, setNumOfNotifications] = useState(0);
  const [infoAvailable, setInfoAvailable] = useState(false);

  // Only once, attach listener to onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        console.log("No user currently logged in");
      }
    });
  }, []);

  // Whenever currentUserEmail or database changes, get user's notifications from database
  // Save it to notifications array
  useEffect(() => {
    async function fetchData() {
      if (currentUserEmail != null) {
        const notificationsDocRef = doc(
          database,
          "notifications",
          currentUserEmail
        );
        // Get notifications data and set it to local array
        const notificationsSnapShot = await getDoc(notificationsDocRef);
        if (notificationsSnapShot.exists()) {
          console.log("Notifications for user Exist");
          setNotifications(notificationsSnapShot.data().notifications);
          //Set length of current notifications array
          setNumOfNotifications(notifications.length);
        } else {
          console.log("Notifications for user does not Exist");
        }
      }
    }
    console.log("current User Email");
    console.log(currentUserEmail);
    fetchData();
  }, [currentUserEmail, database]);

  //wait until info is retrieved from db before loading cards
  useEffect(() => {
    if (notifications !== []) {
      console.log("wait for information before loading");
      setInfoAvailable(true);
      //Set length of current notifications array
      setNumOfNotifications(notifications.length);
    }
  }, [notifications]);

  // Display the number of notifications of the
  const displayNotifications = () => {
    const cards = [];
    // If notifications is empty
    if (notifications === []) {
      cards.push(<h4>No notifications to display :/</h4>);
    } else {
      // Add notification cards
      for (let i = numOfNotifications - 1; i >= 0; i -= 1) {
        cards.push(
          <NotificationCards
            key={`NotificationCard-${i}`}
            notifications={notifications}
            setNotifications={setNotifications}
            setNumOfNotifications={setNumOfNotifications}
            cardNum={i}
            currentUserEmail={currentUserEmail}
          />
        );
      }
    }
    return cards;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            backgroundColor: "white",
            padding: "35px",
            borderRadius: "16px",
            marginLeft: "50px",
            marginRight: "50px",
            marginTop: "20px",
            maxHeight: 150,
          }}
        >
          Manage your notifications
          <br />
          <NavLink id="visitSettings" to="/settings">
            View Settings
          </NavLink>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            style={{
              backgroundColor: "white",
              padding: "35px",
              borderRadius: "16px",
              marginLeft: "50px",
              marginRight: "50px",
              marginTop: "20px",
            }}
          >
            {infoAvailable && <>{displayNotifications()}</>}
            {!infoAvailable && <p>Loading</p>}
          </Stack>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default NotificationsPage;
