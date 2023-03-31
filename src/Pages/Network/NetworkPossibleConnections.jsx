/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { db, auth } from "../../Firebase/firebase";
import { PossibleConnectionCard } from "../../Components/Network/PossibleConnectionCard";

const theme = createTheme();

export const NetworkPossibleConnections = ({
  nonConnectedUsersID,
  currentUserEmail,
}) => {
  const [nonConnectedUsersArr, setNonConnectedUsersArr] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    //console.log(nonConnectedUsersID);
    setNonConnectedUsersArr(nonConnectedUsersID);
    setCurrentUser(currentUserEmail);
  }, [nonConnectedUsersID]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xxl" sx={{ m: 2 }}>
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
                      currentUser={currentUser}
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

NetworkPossibleConnections.propTypes = {
  nonConnectedUsersID: PropTypes.arrayOf(PropTypes.Object).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
};

export default NetworkPossibleConnections;
