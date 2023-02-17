import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  doc,
  getDocs,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Box, IconButton, Drawer } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../../Components/Navbar/Navbar";
import SendChat from "../../Components/SendChat/SendChat";
import "./Messaging.css";
import MessageList from "../../Components/Messaging/MessageList";
import { auth, db } from "../../Firebase/firebase";
import NewConvo from "../../Components/NewConvo/NewConvo";

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

const Messaging = () => {
  // State for writing messages
  const [messages, setMessages] = useState([]);

  // State for the current conversation to display
  const [convoId, setConvoId] = useState("");

  // an array with info for displaying the convo info
  const [chatProfiles, setChatProfiles] = useState([]);
  const [name, setName] = useState([]);

  const [myUser, setMyUser] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(-1);

  // get all names of user's receivers
  const getAllReceivers = async () => {
    setChatProfiles([]);
    const messagesRef = collection(db, "messages");

    // Searches all converstations containing the currentUser
    const convosQuery = query(
      messagesRef,
      where("authors", "array-contains", myUser)
    );

    const unSub = onSnapshot(convosQuery, async (querySnapshot) => {
      //list of author lists
      const allAuthorsList = [];
      querySnapshot.forEach((document) => {
        allAuthorsList.push(
          document.data().authors.filter((author) => author !== myUser)
        );
      });

      const allChatProfiles = await Promise.all(
        allAuthorsList.map(async (list) => {
          const nameList = await Promise.all(
            list.map(async (author) => {
              const docSnap = await getDoc(doc(db, "userProfiles", author));
              if (docSnap.exists()) {
                return `${docSnap.data().values.firstName} ${
                  docSnap.data().values.lastName
                }`;
              }
              return null;
            })
          );
          const names = nameList.filter(Boolean).join(", ");
          return { names, emails: list };
        })
      );
      /*
      {
        names: "Billy Bob, Yodie Gang"
        emails: ["billybob@gmail.com", "yodiegang@ful.com"]
      }   
      */
      setChatProfiles(allChatProfiles);
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMyUser(user.email);
        console.log("user.email", user.email);
        // getAllReceivers();
      } else {
        console.err("User must be signed in");
      }
    });
  }, []);

  // returns the ID of the currently selected conversation
  const getConversationId = async (authorsList) => {
    authorsList.sort();
    const messagesRef = collection(db, "messages");
    const convoQuery = query(messagesRef, where("authors", "==", authorsList));
    const querySnapshot = await getDocs(convoQuery);

    // probably redundant cause it should exist
    if (querySnapshot.empty) {
      const docRef = await getDocs(collection(db, "messages"), {
        authors: authorsList,
        messages: [],
      });
      return docRef.id;
    }
    return querySnapshot.docs[0].id;
  };

  React.useEffect(() => {
    let unSub;
    if (convoId) {
      unSub = onSnapshot(doc(db, "messages", convoId), (document) => {
        setMessages(document.data().messages);
      });
    }
  }, [convoId]);

  React.useEffect(() => {
    getAllReceivers();
  }, [myUser]);

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
              // bgcolor: "red",
              height: `calc(95vh - ${theme.mixins.toolbar.minHeight}px - 16px)`,
              // overflow: "hidden",
            }}
          >
            <Grid
              item
              className="message-sidebar"
              xs
              sx={{
                // border: "black solid 1px",
                bgcolor: "white",
                borderRadius: 2,
                maxHeight: "100%",
                // overflow: "auto",
                p: 0,
              }}
            >
              <Box component={Grid} sx={{ boxShadow: "0 4px 4px -4px gray" }}>
                <Typography color="primary" variant="h4">
                  Messaging
                </Typography>
              </Box>
              <Grid
                className="convo-list"
                sx={{
                  overflow: "auto",
                  // maxHeight: "calc(100% - 100px)",
                  height: "85%",
                  // bgcolor: "orange",
                }}
              >
                <List>
                  {chatProfiles.map((chat, i) => (
                    <ListItem
                      className="sidebar-item"
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      button
                      selected={selectedIndex === i}
                      onClick={async () => {
                        setConvoId(
                          await getConversationId([...chat.emails, myUser])
                        );
                        setName(chat.names);
                        setSelectedIndex(i);
                      }}
                    >
                      <Typography
                        sx={{ textTransform: "lowercase" }}
                        variant="body1"
                      >
                        {chat.names}
                      </Typography>
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
                bgcolor: "white",
                borderRadius: 2,
                ml: 2,
                p: 0,
                maxHeight: "100%",
              }}
            >
              <div className="message-view-banner">
                <Typography variant="h4">{name}</Typography>
                <Avatar alt="sumn random" src="https://picsum.photos/200/300" />
              </div>

              <Box
                component={Grid}
                sx={{
                  // border: "black solid 1px",
                  // bgcolor: "aqua",
                  height: "85%",
                  overflow: "auto",
                  p: 0,
                  boxShadow: "inset 0 0 -4px gray",
                }}
                boxShadow="0 8px 6px -6px black"
              >
                <MessageList messages={messages} />
              </Box>
              {/* <Grid container style={{ padding: "20px" }}>
                <Grid item xs={12} align="right"> */}
              <SendChat
                color="primary"
                conversationID={convoId}
                myUser={myUser}
              />
              {/* </Grid>
              </Grid> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Messaging;
