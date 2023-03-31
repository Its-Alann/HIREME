import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { SentInvitationCard } from "../../../Components/Network/SentInvitationCard";
import { db, auth } from "../../../Firebase/firebase";
import image2 from "../../../Assets/images/390image2.svg";

const theme = createTheme();

export const SentInvitation = ({
  allUserProfiles,
  sentInvitationsID,
  currentUserEmail,
}) => {
  const [sentRequestsUserID, setSentRequestsUserID] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    setSentRequestsUserID(sentInvitationsID);
    setCurrentUser(currentUserEmail);
  }, [sentInvitationsID]);

  useEffect(() => {
    setAllUsers(allUserProfiles);
  }, [allUserProfiles]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xxl" sx={{ m: 2 }}>
          <CssBaseline />
          <Box justifyContent="center" alignItems="center" display="flex">
            {sentRequestsUserID?.length > 0 && sentRequestsUserID != null ? (
              <Grid
                container
                spacing={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {sentRequestsUserID.map((userID) => (
                  <Grid item data-cy="invitationsGrid">
                    <SentInvitationCard
                      allUserProfiles={allUsers}
                      userID={userID}
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
                  <Typography variant="h5">You have not sent</Typography>
                  <Typography variant="h5">any invitations</Typography>
                </Stack>
              </>
            )}
            {/*The array will contain all the connected users*/}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

SentInvitation.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  sentInvitationsID: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
};

export default SentInvitation;
