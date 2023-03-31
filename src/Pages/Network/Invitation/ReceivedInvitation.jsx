import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Typography } from "@mui/material";
import { ReceivedInvitationCard } from "../../../Components/Network/ReceivedInvitationCard";
import { db, auth } from "../../../Firebase/firebase";
import image2 from "../../../Assets/images/390image2.svg";

const theme = createTheme();

export const ReceivedInvitation = () => {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setCurrentUser(user);
  //       const getReceivedInvitationUsers = async () => {
  //         // READ DATA
  //         try {
  //           const docSnap = await getDoc(doc(db, "invitations", user.email));
  //           const userData = docSnap.data();
  //           setReceivedInvitations(userData.receivedInvitations);
  //           console.log(receivedInvitations);
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       };
  //       getReceivedInvitationUsers();
  //     } else {
  //       //take you back to the homepage
  //       //console.log("2:", user);
  //     }
  //   });
  // }, []);

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
              <>
                <Box
                  component="img"
                  justifyContent="center"
                  sx={{
                    width: 0.3,
                    height: 0.3,
                  }}
                  src={image2}
                  // alt="Trees"
                />
                <Stack alignItems="center" sx={{ ml: 1 }}>
                  <Typography variant="h5">You have not received</Typography>
                  <Typography variant="h5">any invitations</Typography>
                </Stack>
              </>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default ReceivedInvitation;
