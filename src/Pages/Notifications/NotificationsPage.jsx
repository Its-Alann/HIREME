import { React, useState, useEffect } from "react";
import { doc, getFirestore, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Stack, Menu, MenuItem, Button, Card, CardContent } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { app, auth } from "../../Firebase/firebase";
import { db } from "../../Firebase/firebase";
import { NavLink } from "react-router-dom";
import "./Notifications.css";

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
  const [deleteIndex, setDeleteIndex] = useState(0);

  // Delete function to remove the selected notification
  const deleteIndexNotification = (index) => {
    setDeleteIndex(index);
    deleteNotification();
  }

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
      console.log("wait for information before loading")
      setInfoAvailable(true);
      //Set length of current notifications array
      setNumOfNotifications(notifications.length);
    }
  }, [notifications]);

  // Delete notification item in array
  const deleteNotification = async () => {
    console.log(deleteIndex);
    const notificationRef = doc(db, "notifications", currentUserEmail);
    var array = notifications;
    array.splice(deleteIndex, 1);
    setNotifications(array);
    setNumOfNotifications(notifications.length)
    try{
      await updateDoc(notificationRef, {
        notifications,
      })
    } 
    catch (error) {
      console.log(error);
    }
    handleClose();
  }

  // Display the number of notifications of the
  const displayNotifications = () => {
    const cards = [];
    // If notifications is empty
    if (notifications === []) {
      cards.push(<h4>No notifications to display :/</h4>);
    } else {
      // Add notification cards
      for (let i = 0; i < numOfNotifications; i += 1) {

        // Add link to either connection list or job posting
        let redirectLink = "";
        if(notifications[i].type === "connections")
        {
          redirectLink = "/network";
        }
        else if (notifications[i].type === "jobs")
        {
          redirectLink = `/${notifications[i].link}`
        }
        cards.push(
          <Card className="notificationCards" variant="outlined">
            <Grid container xs={12} sm={12} md={12}>
              <NavLink className="nav_link" to={redirectLink} style={{textDecoration: "none"}}>
                <Grid item xs={12} style={{marginLeft: 15}}>
                  <h4>{notifications[i].content}</h4>
                </Grid>
                <Grid item xs={10} style={{marginLeft: 15}}>
                  <h4>
                    Timestamp:{" "}
                    {new Date(
                      notifications[i].timestamp.seconds * 1000 +
                        notifications[i].timestamp.nanoseconds / 1000000
                    ).toLocaleDateString()}
                  </h4>
                </Grid>
              </NavLink>
              <Grid item xs={1} >
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
                  <MenuItem onClick={() => deleteIndexNotification(i)}>
                    <DeleteOutlineIcon /> Delete this notification
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Card>
        );
      }
    }
    return cards;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row">
        <Grid item xs={12} sm={12} md={12}
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
          <br></br>
          <NavLink to="/settings">View Settings</NavLink>
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
