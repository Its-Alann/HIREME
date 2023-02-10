import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { collection } from "firebase/firestore";
import Navbar from "../../../Components/Navbar/Navbar";
import NetworkCards from "../../../Components/Network/NetworkCards";
import { db } from "../../../Firebase/firebase";

const theme = createTheme();
const test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const usersRef = collection(db, "userProfiles");

const ViewNetwork = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Container component="main" maxWidth="xl" sx={{ m: 2 }}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom>
        My Network
      </Typography>
      <Box justifyContent="center" alignItems="center" minHeight="60vh">
        {/*The array will contain all the connected users*/}
        <Grid container spacing={3}>
          {Array.from(usersRef).map((_, index) => (
            <Grid item>
              <NetworkCards />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  </ThemeProvider>
);

export default ViewNetwork;
