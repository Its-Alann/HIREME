/* eslint-disable no-shadow */
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
import PropTypes from "prop-types";
import { NetworkCards } from "../../../Components/Network/NetworkCards";
import { db, auth } from "../../../Firebase/firebase";
import image2 from "../../../Assets/images/390image2.svg";

const theme = createTheme();

export const ViewNetwork = ({
  allUserProfiles,
  networkConnections,
  currentUserEmail,
}) => {
  const [connectedUsersId, setConnectedUsersId] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    setConnectedUsersId(networkConnections);
    setCurrentUser(currentUserEmail);
  }, [networkConnections]);

  useEffect(() => {
    setAllUsers(allUserProfiles);
  }, [allUserProfiles]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xxl" sx={{ m: 2 }}>
          <CssBaseline />
          <Box justifyContent="center" alignItems="center" display="flex">
            {connectedUsersId?.length > 0 && connectedUsersId != null ? (
              <Grid
                container
                spacing={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {connectedUsersId.map((connectedUserID) => (
                  <Grid item>
                    <NetworkCards
                      allUserProfiles={allUsers}
                      connectedUserID={connectedUserID}
                      currentUser={currentUser}
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
                <Typography variant="h5" sx={{ ml: 1 }}>
                  No connections to show
                </Typography>
              </>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

ViewNetwork.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  networkConnections: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
};

export default ViewNetwork;
