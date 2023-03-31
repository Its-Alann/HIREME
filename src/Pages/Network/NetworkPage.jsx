import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Route, Link, Routes } from "react-router-dom";
import { PropTypes } from "prop-types";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ViewNetwork } from "./MyConnections/ViewNetwork";
import { SentInvitation } from "./Invitation/SentInvitation";
import { ReceivedInvitation } from "./Invitation/ReceivedInvitation";
import { NetworkPossibleConnections } from "./NetworkPossibleConnections";
import { db, auth } from "../../Firebase/firebase";

const theme = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    background: { main: "#EAEAEA" },
    gray: { main: "#757575" },
  },
  /* typography: {
    fontFamily: ["Proxima Nova"],
  },*/
});

/*const LinkTab = (props) => (
  <Tab
    component={Link}
    to={props.href}
    onClick={(event) => {
      event.preventDefault();
    }}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);*/

const NetworkPage = () => {
  const [value, setValue] = React.useState(0);
  const [networkConnections, setNetworkConnections] = useState([]);
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [nonConnectedUsersArr, setNonConnectedUsersArr] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //get connected user IDs
  const getConnectedUserIDs = async () => {
    // READ DATA
    try {
      const docSnap = await getDoc(doc(db, "network", auth.currentUser.email));
      const userData = docSnap.data();
      setNetworkConnections(userData.connectedUsers);
      //console.log(networkConnections);
    } catch (err) {
      console.log("err:", err);
    }
  };

  const getSentAndReceivedInvitations = async () => {
    // READ DATA
    try {
      const docSnap = await getDoc(
        doc(db, "invitations", auth.currentUser.email)
      );
      const userData = docSnap.data();
      setReceivedInvitations(userData.receivedInvitations);
      setSentInvitations(userData.sentInvitations);
      // console.log(userData.receivedInvitations);
      // console.log(userData.sentInvitations);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllUsers = async () => {
    try {
      const usersRef = collection(db, "userProfiles");
      const data = await getDocs(usersRef);
      const users = data.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));
      //console.log(users);
      setAllUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  const getPossibleConnections = async () => {
    try {
      //create a new array of users that isnt connected with the currentUser
      const newNonConnectedUsersArr = allUsers.filter(
        (user) =>
          !networkConnections.includes(user.id) &&
          !sentInvitations.includes(user.id) &&
          currentUser !== user.id
      );
      setNonConnectedUsersArr(newNonConnectedUsersArr);
      //console.log(newNonConnectedUsersArr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(auth.currentUser.email);
        await Promise.all([
          getConnectedUserIDs(),
          getSentAndReceivedInvitations(),
          getAllUsers(),
        ]);
      } else {
        //take you back to the homepage
        //console.log(user);
      }
    });
  }, []);

  useEffect(() => {
    if (allUsers && networkConnections && sentInvitations) {
      getPossibleConnections();
      //console.log(allUsers);
    }
  }, [allUsers, networkConnections, sentInvitations]);

  return (
    <div style={{ backgroundColor: "#EAEAEA", height: "100vh" }}>
      <Divider />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth={false}>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="nav tabs example"
            >
              <Tab label="My Network" value={0} data-cy="NetworkTab" />
              <Tab
                label="Received Invitations"
                value={1}
                data-cy="ReceivedInvitationTab"
              />
              <Tab
                label="Sent Invitation"
                value={2}
                data-cy="SentInvitationTab"
              />
              <Tab
                label="Possible Connections"
                value={3}
                data-cy="PossibleConnectionsTab"
              />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 0}>
            <ViewNetwork
              allUserProfiles={allUsers}
              networkConnections={networkConnections}
              currentUserEmail={currentUser}
            />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 1}>
            <ReceivedInvitation
              allUserProfiles={allUsers}
              receivedInvitationIDs={receivedInvitations}
              currentUserEmail={currentUser}
            />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 2}>
            <SentInvitation
              allUserProfiles={allUsers}
              sentInvitationsID={sentInvitations}
              currentUserEmail={currentUser}
            />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 3}>
            <NetworkPossibleConnections
              allUserProfiles={allUsers}
              nonConnectedUsersID={nonConnectedUsersArr}
              currentUserEmail={currentUser}
            />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

/*LinkTab.propTypes = {
  href: PropTypes.string.isRequired,
};*/

export default NetworkPage;
