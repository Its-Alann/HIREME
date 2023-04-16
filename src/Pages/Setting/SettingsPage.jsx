import { React, useState, useEffect } from "react";
import {
  doc,
  getFirestore,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Switch, FormControlLabel } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { app, auth, db } from "../../Firebase/firebase";

const SettingsPage = () => {
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

  // Add setting values and user
  const [connectionsNotifications, setConnectionsNotifications] =
    useState(false);
  const [jobNotifications, setJobNotifications] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const database = getFirestore(app);
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
          setJobNotifications(notificationsSnapShot.data().notificationForJobs);
          setConnectionsNotifications(
            notificationsSnapShot.data().notificationForConnections
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
    console.log("wait for information before loading");
    setInfoAvailable(true);
  });

  // Custom button
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
    // eslint-disable-next-line no-shadow
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  // On change for connections notifications
  const changeConnectionsNotification = async () => {
    try {
      const notificationsDocRef = doc(
        database,
        "notifications",
        currentUserEmail
      );

      const notificationDocSnapshot = await getDoc(notificationsDocRef);

      // Check if the document exists
      if (notificationDocSnapshot.exists()) {
        console.log("Notification document exists for this user");
      } else {
        console.log("Notification document exists for this user");
        console.log("Creating notification document for this user!");
        // Add user email to notifications collection
        await setDoc(doc(db, "notifications", currentUserEmail), {
          notifications: [],

          // eslint-disable-next-line no-undef
          field: "",
          notificationForJobs: false,
          notificationForConnections: false,
        });
      }
      // Get notifications data and set it to local array
      await updateDoc(notificationsDocRef, {
        notificationForConnections: !connectionsNotifications,
      });
      setConnectionsNotifications(!connectionsNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  // On change for jobs notification
  const changeJobNotification = async () => {
    try {
      const notificationsDocRef = doc(
        database,
        "notifications",
        currentUserEmail
      );
      // Get notifications data and set it to local array
      await updateDoc(notificationsDocRef, {
        notificationForJobs: !jobNotifications,
      });
    } catch (error) {
      console.log(error);
    }
    setJobNotifications(!jobNotifications);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        justifyContent="space-between"
        style={{
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "16px",
          marginLeft: "50px",
          marginRight: "50px",
          marginTop: "20px",
        }}
      >
        <Grid item xs={12}>
          <h2>Notifications you receive</h2>
        </Grid>
        <Grid item xs={6}>
          Connections
        </Grid>
        {infoAvailable && (
          <Grid item xs={6}>
            <FormControlLabel
              data-testid="connectionsForm"
              control={
                <IOSSwitch
                  data-testid="connectionsSwitch"
                  sx={{ m: 1 }}
                  defaultChecked={connectionsNotifications}
                />
              }
              label={connectionsNotifications ? "On" : "Off"}
              onChange={changeConnectionsNotification}
            />
          </Grid>
        )}
        {!infoAvailable && <p>Loading...</p>}
        <Grid item xs={6}>
          Job Suggestions
        </Grid>
        {infoAvailable && (
          <Grid item xs={6}>
            <FormControlLabel
              data-testid="jobForm"
              control={
                <IOSSwitch
                  data-testid="jobSwitch"
                  sx={{ m: 1 }}
                  defaultChecked={jobNotifications}
                />
              }
              label={jobNotifications ? "On" : "Off"}
              onChange={changeJobNotification}
            />
          </Grid>
        )}
        {!infoAvailable && <p>Loading...</p>}
      </Grid>
    </ThemeProvider>
  );
};
export default SettingsPage;
