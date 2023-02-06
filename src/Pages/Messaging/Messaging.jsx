import { CssBaseline, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import Navbar from "../../Components/Navbar/Navbar";

const theme = createTheme();

const Messaging = () => {
  console.log("Hello World");
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
      </Container>
    </ThemeProvider>
  );
};

export default Messaging;
