/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
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
import { Box, IconButton, Drawer } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Navbar from "../../Components/Navbar/Navbar";
import "./Messaging.css";
import SendChat from "../../Components/SendChat/SendChat";

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [alignment, setAlignment] = React.useState("left");

  const a1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 12, 12, 21, 424, 2];
  const a2 = [1, 2, 3, 4, 5];
  return (
    <ThemeProvider theme={theme}>
      <Box className="page" sx={{ height: "100vh" }}>
        <Navbar />
        <Box>
          <Grid
            container
            className="messaging-container"
            spacing={3}
            sx={{
              m: "auto",
              mt: 2,
              maxWidth: 1000,
              bgcolor: "red",
              height: `calc(95vh - ${theme.mixins.toolbar.minHeight}px - 16px)`,
              // overflow: "hidden",
            }}
          >
            <Grid
              item
              className="message-sidebar"
              xs
              sx={{
                border: "black solid 1px",
                bgcolor: "pink",
                borderRadius: 2,
                maxHeight: "100%",
                // overflow: "auto",
                p: 0,
              }}
            >
              <Grid>
                <Typography color="primary" variant="h4">
                  SIDE BAR
                </Typography>
              </Grid>
              <Grid
                className="convo-list"
                sx={{
                  overflow: "auto",
                  // maxHeight: "calc(100% - 100px)",
                  height: "85%",
                  bgcolor: "orange",
                }}
              >
                <List>
                  {a2.map((chat, i) => (
                    <ListItem
                      key={i}
                      button
                      selected={selectedIndex === i}
                      onClick={() => setSelectedIndex(i)}
                    >
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
              </Grid>
            </Grid>

            <Grid
              item
              className="message-view"
              xs={8}
              sx={{
                bgcolor: "hotpink",
                borderRadius: 2,
                ml: 2,
                p: 0,
                maxHeight: "100%",
              }}
            >
              {/* <Box sx={{ bgcolor: "white", borderRadius: 2, height: "100%" }}> */}
              <div className="message-view-banner">
                <Typography variant="h4">Chat With</Typography>
                <Avatar alt="sumn random" src="https://picsum.photos/200/300" />
              </div>
              <Grid
                sx={{
                  border: "black solid 1px",
                  bgcolor: "aqua",
                  borderRadius: 2,
                  height: "85%",
                  overflow: "auto",
                  p: 0,
                }}
              >
                <List>
                  {[1, 2, 3, 4, 5].map((message, i) => (
                    <ListItem key={i}>
                      <Grid container>
                        {/* <Grid item xs={12}>
                          <ListItemText secondary="name" align={alignment} />
                        </Grid> */}
                        <ListItemText
                          secondary="name"
                          align={alignment}
                          // sx={{ ml: 12 }}
                          style={{
                            marginLeft: "12px",
                            marginRight: "12px",
                            marginTop: "12px",
                          }}
                        />
                        <Grid
                          item
                          xs={12}
                          style={{
                            backgroundColor: "yellow",
                            borderRadius: "16px",
                          }}
                        >
                          <ListItemText
                            align={alignment}
                            primary={`message number ${message}`}
                          />
                        </Grid>
                        <ListItemText
                          // sx={{ p: 1 }}
                          style={{ marginLeft: "12px" }}
                          align={alignment}
                          secondary="2023-02-17-3:00PM"
                        />
                        {/* <Grid item xs={12}>
                          <ListItemText
                            align={alignment}
                            secondary="2023-02-17-3:00PM"
                          />
                        </Grid> */}
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <SendChat
                color="primary"
                sx={{ position: "fixed" }}
                // conversationID={convoId}
                // myUser={myUser}
              />

              {/* </Box> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default M;
