/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Typography } from "@mui/material";
import { NetworkCards } from "../../../Components/Network/NetworkCards";
import { db, auth } from "../../../Firebase/firebase";

const theme = createTheme();

export const ViewNetwork = () => {
  const [connectedUsersId, setConnectedUsersId] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //get connected user IDs
        const getConnectedUserIDs = async () => {
          // READ DATA
          try {
            const docSnap = await getDoc(doc(db, "network", user.email));
            const userData = docSnap.data();
            setConnectedUsersId(userData.connectedUsers);
          } catch (err) {
            console.log("err:", err);
          }
        };

        getConnectedUserIDs();
      } else {
        //take you back to the homepage
        //console.log(user);
      }
    });
  }, []);

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
                    <NetworkCards connectedUserID={connectedUserID} />
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

export default ViewNetwork;
