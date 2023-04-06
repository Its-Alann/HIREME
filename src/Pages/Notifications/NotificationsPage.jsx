import { React, useState, useEffect } from "react";
import { doc, getFirestore, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Stack, Menu, MenuItem, Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { app, auth } from "../../Firebase/firebase";

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

  // Consts for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

  // Whenever currentUserEmail or database changes, get user's profile from database
  // Save it to profile
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
          console.log(notifications);
          //Set length of current notifications array
          setNumOfNotifications(notifications.length);
          console.log(
            `Number of notifications for this user:${numOfNotifications}`
          );
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
    console.log("User Notifications", notifications);
    if (notifications !== []) {
      setInfoAvailable(true);
      //Set length of current notifications array
      setNumOfNotifications(notifications.length);
      console.log(
        `Number of notifications for this user:${numOfNotifications}`
      );
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
      for (let i = 0; i < numOfNotifications; i += 1) {
        cards.push(
          <Grid item xs={12}>
            <Grid item xs={6}>
              <h4>{notifications[i].content}</h4>
            </Grid>
            <Grid item xs={6}>
              <Button
                aria-controls={open ? "basic menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreHorizIcon />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
              >
                <MenuItem onClick={handleClose}>
                  <DeleteOutlineIcon /> Delete this notification
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={6}>
              <h4>
                Timestamp:{" "}
                {new Date(
                  notifications[i].timestamp.seconds * 1000 +
                    notifications[i].timestamp.nanoseconds / 1000000
                ).toLocaleDateString()}
              </h4>
            </Grid>
          </Grid>
        );
      }
    }
    return cards;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        style={{
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "16px",
          marginRight: "150px",
          marginLeft: "150px",
          marginTop: "100px",
        }}
      >
        View Settings
      </Grid>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        style={{
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "16px",
          marginRight: "150px",
          marginLeft: "150px",
          marginTop: "100px",
        }}
      >
        <Grid>
          {infoAvailable && <>{displayNotifications()}</>}
          {!infoAvailable && <p>Loading</p>}
        </Grid>
      </Stack>
    </ThemeProvider>
  );
};
export default NotificationsPage;
