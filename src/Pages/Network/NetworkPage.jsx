import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

  const compareByName = (a, b) => {
    const firstNameA = a.values.firstName.toUpperCase();
    const firstNameB = b.values.firstName.toUpperCase();
    const lastNameA = a.values.lastName.toUpperCase();
    const lastNameB = b.values.lastName.toUpperCase();

    if (firstNameA < firstNameB) {
      return -1;
    }
    if (firstNameA > firstNameB) {
      return 1;
    }
    if (firstNameA === firstNameB) {
      if (lastNameA < lastNameB) {
        return -1;
      }
      if (lastNameA > lastNameB) {
        return 1;
      }
      return 0;
    }
    return 0;
  };

  //get connected user IDs
  const getConnectedUserIDs = async () => {
    // READ DATA
    try {
      const docSnap = await getDoc(doc(db, "network", auth.currentUser.email));
      const userData = docSnap.data();
      const connectedUserIds = userData.connectedUsers;
      //console.log(connectedUserIdArr);
      const connectedUserProfiles = allUsers.filter((user) =>
        connectedUserIds.includes(user.id)
      );
      //console.log(connectedUserProfiles);
      connectedUserProfiles.sort(compareByName);
      setNetworkConnections(connectedUserProfiles);
      //console.log(connectedUserProfiles);
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

      const receivedInvitationIDs = userData.receivedInvitations;
      const receivedInvitationUserProfiles = allUsers.filter((user) =>
        receivedInvitationIDs.includes(user.id)
      );
      receivedInvitationUserProfiles.sort(compareByName);

      const sentInvitationIDs = userData.sentInvitations;
      const sentInvitationUserProfiles = allUsers.filter((user) =>
        sentInvitationIDs.includes(user.id)
      );
      sentInvitationUserProfiles.sort(compareByName);

      setReceivedInvitations(receivedInvitationUserProfiles);
      setSentInvitations(sentInvitationUserProfiles);
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
          !networkConnections.includes(user) &&
          !sentInvitations.includes(user) &&
          currentUser !== user.id
      );
      newNonConnectedUsersArr.sort(compareByName);
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
        await Promise.all([getAllUsers()]);
      } else {
        //take you back to the homepage
        //console.log(user);
      }
    });
  }, []);

  useEffect(() => {
    if (allUsers) {
      getConnectedUserIDs();
      getSentAndReceivedInvitations();
      //console.log(allUsers);
    }
  }, [allUsers]);

  useEffect(() => {
    if (allUsers && networkConnections && sentInvitations) {
      getPossibleConnections();
      //console.log(allUsers);
    }
  }, [allUsers, networkConnections, sentInvitations]);

  return (
    <div style={{ height: "100%" }}>
      <style>{`body {background-color: #EAEAEA; margin: 0; }`}</style>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth={false}>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="nav tabs example"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
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
              networkConnections={networkConnections}
              currentUserEmail={currentUser}
            />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 1}>
            <ReceivedInvitation
              receivedInvitationIDs={receivedInvitations}
              currentUserEmail={currentUser}
            />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 2}>
            <SentInvitation
              sentInvitationsID={sentInvitations}
              currentUserEmail={currentUser}
            />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 3}>
            <NetworkPossibleConnections
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
