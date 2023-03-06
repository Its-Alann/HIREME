import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Typography,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  Box,
  IconButton,
  Stack,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  doc,
  addDoc,
  getDocs,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { onAuthStateChanged } from "firebase/auth";
import AddCommentIcon from "@mui/icons-material/AddComment";
import SendChat from "../../Components/SendChat/SendChat";
// import "./Messaging.css";
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

  // tracks when we use the new convo button
  const [newConvo, setNewConvo] = useState(false);

  //to autoscroll
  const messageViewRef = useRef();
  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behaviour: "smooth" });
  };

  const getOtherAuthors = async (list) => {
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
    console.log("nascar", names);
    return { names, emails: list };
  };

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
        allAuthorsList.map(getOtherAuthors)
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

  // returns the ID of the currently selected conversation
  const getConversationId = async (authorsList) => {
    authorsList.sort();
    const messagesRef = collection(db, "messages");
    const convoQuery = query(messagesRef, where("authors", "==", authorsList));
    const querySnapshot = await getDocs(convoQuery);

    // probably redundant cause it should exist
    if (querySnapshot.empty) {
      const docRef = await addDoc(collection(db, "messages"), {
        authors: authorsList,
        messages: [],
      });
      console.log(
        "findConversation: no existing conversation found, creating new one between",
        authorsList,
        "new id:",
        docRef.id
      );
      return docRef.id;
    }
    console.log(
      "Existing conversations found between",
      authorsList,
      "id:",
      querySnapshot.docs[0].id
    );
    return querySnapshot.docs[0].id;
  };

  const selectConvo = async (conversationId, names, index) => {
    setConvoId(conversationId);
    setName(names);
    setSelectedIndex(index);
    scrollToBottom();
  };

  // auth listener on load
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMyUser(user.email);
        console.log("user.email", user.email);
        // getAllReceivers();
      } else {
        console.log("User must be signed in");
      }
    });
  }, []);

  //can make this an onclick
  useEffect(() => {
    if (newConvo) {
      setSelectedIndex(-1);
      setMessages([]);
      setConvoId("");
      setName("New Convo");
    }
  }, [newConvo]);

  //set a listener to on the conversation document
  useEffect(() => {
    let unSub;
    if (convoId) {
      setNewConvo(false);
      unSub = onSnapshot(doc(db, "messages", convoId), (document) => {
        setMessages(document.data().messages);
      });
    }
  }, [convoId]);

  useEffect(() => {
    getAllReceivers();
  }, [myUser]);

  //if the conversations changes, scroll to bottom
  useEffect(() => {
    //wont scroll to bottom if there are no chats selected
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Box className="page">
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
              <Box
                sx={{ display: "flex", p: 1, justifyContent: "space-between" }}
              >
                <Typography color="primary" variant="h4">
                  Messaging
                </Typography>
                <IconButton
                  data-cy="startNewConvo"
                  onClick={() => setNewConvo(!newConvo)}
                >
                  <AddCommentIcon />
                </IconButton>
              </Box>

              <Grid
                className="convo-list"
                sx={{
                  overflow: "auto",
                  // maxHeight: "calc(100% - 100px)",
                  height: "auto",
                  bgcolor: "white",
                  p: 0,
                }}
              >
                <List>
                  {chatProfiles.map((chat, i) => (
                    <ListItemButton
                      className="sidebar-item"
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      selected={selectedIndex === i}
                      onClick={async () => {
                        const conversationID = await getConversationId([
                          ...chat.emails,
                          myUser,
                        ]);
                        await selectConvo(conversationID, chat.names, i);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt="sumn random"
                          src="https://picsum.photos/200/300"
                        />
                      </ListItemAvatar>
                      <Typography
                        sx={{ textTransform: "lowercase" }}
                        variant="body1"
                      >
                        {chat.names}
                      </Typography>
                    </ListItemButton>
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
              <Stack sx={{ height: "100%" }}>
                <div
                  className="message-view-banner"
                  style={{
                    maxHeight: "64px",
                    backgroundColor: "#2b2f90",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "8px 8px 0 0",
                    padding: "12px",
                  }}
                  // sx={{ backgroundColor }}
                >
                  {mediaMobile && (
                    <IconButton
                      aria-label="back"
                      id="ChevronIcon"
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
                {newConvo && (
                  <NewConvo
                    selectConvo={selectConvo}
                    getConversationId={getConversationId}
                    getOtherAuthors={getOtherAuthors}
                  />
                )}
                <Box
                  id="message-chats"
                  sx={{
                    // border: "black solid 1px",
                    bgcolor: "white",
                    height: "100%",
                    overflow: "auto",
                    p: 0,
                    overflowX: "hidden",
                    borderRadius: "0 0 8px 8px",
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
                      id="sendChat"
                      data-cy="sendChat"
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
