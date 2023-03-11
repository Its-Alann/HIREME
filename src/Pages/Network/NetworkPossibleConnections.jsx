/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Typography } from "@mui/material";
import { db, auth } from "../../Firebase/firebase";
import { PossibleConnectionCard } from "../../Components/Network/PossibleConnectionCard";

const theme = createTheme();

export const NetworkPossibleConnections = () => {
  const [connectedUsersId, setConnectedUsersId] = useState([]);
  const [sentInvitationsId, setSentInvitationsId] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [nonConnectedUsersArr, setNonConnectedUsersArr] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  const getPossibleConnections = async (user) => {
    // READ DATA
    try {
      //get list of user connections of current user
      const networkDocSnap = await getDoc(doc(db, "network", user.email));
      const currentUserNetworkData = networkDocSnap.data();

      setConnectedUsersId(currentUserNetworkData?.connectedUsers);

      //get list of users that the current user sent invitations to
      const sentInvitationsDocSnap = await getDoc(
        doc(db, "invitations", user.email)
      );
      const sentInvitationsData = sentInvitationsDocSnap.data();
      setSentInvitationsId(sentInvitationsData?.sentInvitations);

      // get all users in userProfiles
      const usersRef = collection(db, "userProfiles");
      const data = await getDocs(usersRef);

      const users = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setAllUsers(users);
    } catch (err) {
      console.error("err:", err);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        //take you back to the homepage
        //console.log(user);
      }
    });
  }, []);

  useEffect(() => {
    getPossibleConnections(currentUser);
    //console.log(currentUser);
  }, [currentUser]);

  useEffect(() => {
    try {
      //create a new array of users that isnt connected with the currentUser
      allUsers.forEach(() => {
        const newNonConnectedUsersArr = allUsers.filter(
          (user) =>
            !connectedUsersId?.includes(user?.id) &&
            !sentInvitationsId?.includes(user?.id) &&
            currentUser.email !== user.id
        );
        setNonConnectedUsersArr(newNonConnectedUsersArr);
      });
    } catch (error) {
      console.log(error);
    }
  }, [connectedUsersId, sentInvitationsId, allUsers, currentUser]);

  return (
    <div style={{ backgroundColor: "#EAEAEA", height: "100vh" }}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xxl" sx={{ m: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ ml: 10, my: 5 }}>
            People you may know
          </Typography>
          <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            data-cy="connectionsBox"
          >
            {nonConnectedUsersArr.length > 0 && nonConnectedUsersArr != null ? (
              <Grid
                container
                spacing={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
                data-cy="connectionGrid"
              >
                {nonConnectedUsersArr.map((possibleConnectionUserID) => (
                  <Grid item>
                    <PossibleConnectionCard
                      possibleConnectionUserId={possibleConnectionUserID.id}
                      currentUser={currentUser.email}
                      data-cy={`gridItem${possibleConnectionUserID}`}
                      id={`gridItem${possibleConnectionUserID}`}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No connections yet :/</Typography>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default NetworkPossibleConnections;
