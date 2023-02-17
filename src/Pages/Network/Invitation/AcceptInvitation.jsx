import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { AcceptInvitationCard } from "../../../Components/Network/AcceptInvitationCard";
import { db, auth } from "../../../Firebase/firebase";

const theme = createTheme();

export const AcceptInvitation = () => {
  const [acceptInvitations, setAcceptInvitations] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const getAcceptedInvitationUsers = async () => {
          // READ DATA
          try {
            const docSnap = await getDoc(doc(db, "invitations", user.email));
            const userData = docSnap.data();
            setAcceptInvitations(userData.requestUsers);
            //console.log(userData.requestUsers);
          } catch (err) {
            console.error(err);
          }
        };
        getAcceptedInvitationUsers();
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
              {acceptInvitations.map((acceptInvitationUserID) => (
                <Grid item>
                  <AcceptInvitationCard
                    requestedUserID={acceptInvitationUserID}
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

export default AcceptInvitation;
