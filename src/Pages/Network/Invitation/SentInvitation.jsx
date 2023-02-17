import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { SentInvitationCard } from "../../../Components/Network/SentInvitationCard";
import { db, auth } from "../../../Firebase/firebase";

const theme = createTheme();

export const SentInvitation = () => {
  const [sentRequestsUserID, setSentRequestsUserID] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const getSentRequestedUsers = async () => {
          // READ DATA
          try {
            const docSnap = await getDoc(doc(db, "invitations", user.email));
            const userData = docSnap.data();
            setSentRequestsUserID(userData.sentInvitations);
            //console.log(userData.sentRequests);
          } catch (err) {
            console.error(err);
          }
        };
        //console.log(sentRequestsUserID);
        getSentRequestedUsers();
      } else {
        //take you back to the homepage
        //console.log("2:", user);
      }
    });
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xl" sx={{ m: 2 }}>
          <CssBaseline />
          <Box justifyContent="center" alignItems="center" display="flex">
            {/*The array will contain all the connected users*/}
            <Grid
              container
              spacing={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {sentRequestsUserID.map((userID) => (
                <Grid item>
                  <SentInvitationCard
                    userID={userID}
                    currentUser={currentUser.email}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default SentInvitation;
