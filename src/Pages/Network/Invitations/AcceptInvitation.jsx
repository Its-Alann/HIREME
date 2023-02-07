import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../../../Components/Navbar/Navbar";

const theme = createTheme();

const AcceptInvitation = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>Accept Invitation</div>
    </Container>
  </ThemeProvider>
);

export default AcceptInvitation;
