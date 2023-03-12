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
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { db, auth } from "../../Firebase/firebase";
import { PossibleConnectionCard } from "../../Components/Network/PossibleConnectionCard";
import { useAuth } from "../../context/AuthContext";

const theme = createTheme();

export const NetworkPossibleConnections = () => {
  const { currentUser } = useAuth();

  const fetchPossibleConnections = async (user) => {
    if (user !== null && user !== undefined) {
      try {
        //get list of user connections of current user
        const networkDocSnap = await getDoc(doc(db, "network", user.email));
        const currentUserNetworkData = networkDocSnap.data();
        //console.log("currentUserNetworkData", currentUserNetworkData);

        const connectedUsersId = currentUserNetworkData?.connectedUsers;
        //console.log("connectedUsersId", connectedUsersId);

        //get list of users that the current user sent invitations to
        const sentInvitationsDocSnap = await getDoc(
          doc(db, "invitations", user.email)
        );
        const sentInvitationsData = sentInvitationsDocSnap.data();
        const sentInvitationsId = sentInvitationsData?.sentInvitations;
        //console.log("sentInvitationsId", sentInvitationsId);

        // get all users in userProfiles
        const usersRef = collection(db, "userProfiles");
        const data = await getDocs(usersRef);
        //console.log("data", data);

        const users = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const allUsers = users;

        //create a new array of users that isnt connected with the currentUser
        return allUsers.filter(
          (eachUser) =>
            !connectedUsersId.includes(eachUser.id) &&
            !sentInvitationsId.includes(eachUser.id) &&
            user.email !== eachUser.id
        );
      } catch (e) {
        console.log(e);
      }
    }
    return undefined;
  };

  const {
    isError,
    isSuccess,
    isLoading,
    data: nonConnectedUsersArr,
    error,
  } = useQuery(
    ["possibleConnections", currentUser],
    () => fetchPossibleConnections(currentUser),
    { staleTime: Infinity }
  );

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
            {nonConnectedUsersArr?.length > 0 &&
            nonConnectedUsersArr != null ? (
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
