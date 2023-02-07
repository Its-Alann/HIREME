import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../../Components/Navbar/Navbar";
import ViewNetworkCards from "../../Components/Network/ViewNetworkCards";

const theme = createTheme();

const ViewNetwork = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>ViewNetork</div>
      <ViewNetworkCards />
    </Container>
  </ThemeProvider>
);

export default ViewNetwork;
