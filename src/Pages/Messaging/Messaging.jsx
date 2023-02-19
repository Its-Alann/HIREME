import React, { useState, useEffect, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@mui/material/Unstable_Grid2";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Box, IconButton, Stack } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import useMediaQuery from "@mui/material/useMediaQuery";
import Navbar from "../../Components/Navbar/Navbar";
import SendChat from "../../Components/SendChat/SendChat";
import "./Messaging.css";
import MessageList from "../../Components/Messaging/MessageList";
import { auth, db } from "../../Firebase/firebase";
import NewConvo from "../../Components/NewConvo/NewConvo";

const theme = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    secondary: { main: "#CAF0F8" },
    background: { main: "#EAEAEA" },
    gray: { main: "#D9D9D9" },
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

  //tracks the convo in the sidebar
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // true when on mobile
  const mediaMobile = useMediaQuery("only screen and (max-width: 600px)");

  // ref to dummy div under messageLIst
  const dummy = useRef();

  const messageViewRef = useRef();

  // get all names of user's receivers
  const getAllReceivers = async () => {
    setChatProfiles([]);
    const messagesRef = collection(db, "messages");

    // Searches all converstations containing the currentUser
    const convosQuery = query(
      messagesRef,
      where("authors", "array-contains", myUser)
    );

    // set listener to convos involving the user
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

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behaviour: "smooth" });
  };

  //set a listener to on the conversation document
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

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
              className="message-sidebar"
              xs
              sx={{
                // border: "black solid 1px",
                bgcolor: "white",
                borderRadius: 2,
                maxHeight: "100%",
                // overflow: "auto",
                p: 0,
                display:
                  mediaMobile && selectedIndex > -1 ? "none" : "inline-block",
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
                  height: "auto",
                  bgcolor: "white",
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
                        scrollToBottom();
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
              ref={messageViewRef}
              className="message-view"
              sm={8}
              xs={12}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                ml: mediaMobile ? 0 : 2,
                p: 0,
                maxHeight: "100%",
                display: mediaMobile && selectedIndex < 0 ? "none" : null,
                // scroll: "auto",
                // scrollX: "hidden",
              }}
            >
              <Stack sx={{ maxHeight: "100%" }}>
                <div
                  className="message-view-banner"
                  style={{ maxHeight: "64px" }}
                >
                  {mediaMobile && (
                    <IconButton
                      aria-label="back"
                      onClick={() => {
                        setSelectedIndex(-1);
                      }}
                    >
                      <ChevronLeftIcon sx={{ color: "white" }} />
                    </IconButton>
                  )}

                  <Typography variant="h4" noWrap>
                    {name}
                  </Typography>
                  <Avatar
                    alt="sumn random"
                    src="https://picsum.photos/200/300"
                  />
                </div>

                <Box
                  id="message-chats"
                  sx={{
                    // border: "black solid 1px",
                    bgcolor: "white",
                    // height: "calc(100% - 64px - 56px)",
                    overflow: "auto",
                    p: 0,
                    overflowX: "hidden",
                  }}
                >
                  <MessageList messages={messages} />
                  <div ref={dummy} />
                </Box>

                {selectedIndex > -1 && (
                  <Box
                    sx={{
                      bgcolor: "gray.main",
                      alignItems: "center",
                      justifyItems: "center",
                      // height: 56,
                      p: 0,
                      borderRadius: "0 0 8px 8px",
                      borderTop: "1px solid gray",
                    }}
                  >
                    <SendChat
                      conversationID={convoId}
                      myUser={myUser}
                      selectedIndex={selectedIndex}
                    />
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Messaging;
