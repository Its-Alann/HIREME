/* eslint-disable no-shadow */
import React, { useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { CircularProgress, Typography } from "@mui/material";
import { QueryClient, useQuery } from "react-query";
import { Error } from "@mui/icons-material";
import { NetworkCards } from "../../../Components/Network/NetworkCards";
import { db, auth } from "../../../Firebase/firebase";
import { useAuth } from "../../../context/AuthContext";

const theme = createTheme();

export const ViewNetwork = () => {
  const { currentUser } = useAuth();

  const fetchNetworks = async (user) => {
    if (user) {
      //get connected user IDs
      try {
        const docSnap = await getDoc(doc(db, "network", user.email));
        const userData = docSnap.data();
        console.log("ViewNetwork", userData?.connectedUsers);
        return userData?.connectedUsers;
      } catch (err) {
        console.log("err:", err);
      }
    }
    return undefined;
  };

  const {
    isError,
    isSuccess,
    isLoading,
    data: connectedUsersId,
    error,
  } = useQuery(["connections", currentUser], () => fetchNetworks(currentUser), {
    staleTime: Infinity,
  });

  // If you absolutely need to cache the mutated data you can do the below. But
  // most of the time you won't need to use useMemo at all.

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
                      connectedUserID={connectedUserID}
                      currentUser={auth.currentUser.email}
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

export default ViewNetwork;
