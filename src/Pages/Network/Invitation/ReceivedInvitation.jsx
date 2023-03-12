import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Typography } from "@mui/material";
import { useQuery } from "react-query";
import { ReceivedInvitationCard } from "../../../Components/Network/ReceivedInvitationCard";
import { db, auth } from "../../../Firebase/firebase";
import { useAuth } from "../../../context/AuthContext";

const theme = createTheme();

export const ReceivedInvitation = () => {
  const { currentUser } = useAuth();

  const fetchReceivedInvitations = async (user) => {
    if (user) {
      // READ DATA
      try {
        const docSnap = await getDoc(doc(db, "invitations", user.email));
        const userData = docSnap.data();
        console.log("ReceivedInvitation", userData.receivedInvitations);
        return userData.receivedInvitations;
      } catch (err) {
        console.log(err);
      }
      return undefined;
    }
    return undefined;
  };

  const {
    isError,
    isSuccess,
    isLoading,
    data: receivedInvitations,
    error,
  } = useQuery(
    ["ReceivedInvitation", currentUser],
    () => fetchReceivedInvitations(currentUser),
    { staleTime: Infinity }
  );

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xxl" sx={{ m: 2 }}>
          <CssBaseline />
          <Box justifyContent="center" alignItems="center" display="flex">
            {/*The array will contain all the connected users*/}
            {receivedInvitations?.length > 0 && receivedInvitations != null ? (
              <Grid
                container
                spacing={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {receivedInvitations.map((requestedUserID) => (
                  <Grid item>
                    <ReceivedInvitationCard
                      receivedInvitationUserID={requestedUserID}
                      currentUser={currentUser.email}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No received invitations yet :/</Typography>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default ReceivedInvitation;
