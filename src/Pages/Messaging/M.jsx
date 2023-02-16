/* eslint-disable react/no-array-index-key */
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
} from "@material-ui/core";
import Box from "@mui/material/Box";
import Navbar from "../../Components/Navbar/Navbar";
import "./Messaging.css";

const theme = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    background: { main: "#EAEAEA" },
    gray: { main: "#757575" },
  },
  typography: {
    fontFamily: ["Proxima Nova"],
  },
});

const M = () => {
  console.log("snooxe");
  return (
    <Box className="page" sx={{ height: "100vh" }}>
      <ThemeProvider theme={theme}>
        <Navbar />

        <Grid
          container
          className="messaging-container"
          spacing={2}
          sx={{
            m: "auto",
            maxWidth: 1000,
            // height: "100%",
            height: `calc(90vh - ${theme.mixins.toolbar.minHeight}px)`,
          }}
        >
          <Grid className="message-sidebar" xs={4}>
            <Box sx={{ bgcolor: "white", borderRadius: 2, height: "100%" }}>
              <Typography color="primary" variant="h4">
                SIDE BAR
              </Typography>
              <List>
                {[1, 2, 3, 4, 5].map((chat, i) => (
                  <ListItem key={i} button>
                    <ListItemAvatar>
                      <Avatar
                        alt="sumn random"
                        src="https://picsum.photos/200/300"
                      />
                    </ListItemAvatar>
                    <ListItemText primary={`Person ${chat}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid className="message-content" xs={8}>
            <Box sx={{ bgcolor: "green", borderRadius: 2, height: "100%" }}>
              MESSAGE CONTENT
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Box>
  );
};

export default M;
