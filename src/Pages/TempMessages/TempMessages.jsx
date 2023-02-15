import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
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
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../../Components/Navbar/Navbar";
import SendChat from "../../Components/SendChat/SendChat";
import "./TempMessages.css";
import MessageList from "../../Components/Messaging/MessageList";
import { auth, db } from "../../Firebase/firebase";

const theme = createTheme();

const TempMessages = () => {
  // State for writing messages
  const [messages, setMessages] = useState([]);

  // State for viewing existing messages
  const [conversation, setConversation] = useState();
  // aded this
  const [convoId, setConvoId] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState([]);

  const [myUser, setMyUser] = useState("");

  // get all names of user's receivers
  const getAllReceivers = async () => {
    let querySnapshot = await getDocs(collection(db, "messages"));
    const allAuthors = [];
    querySnapshot.forEach((document) => {
      // If the user is a participant in the conversation
      //  then add the rest of the participants
      if (document.data().authors.includes(myUser)) {
        const recipients = document
          .data()
          .authors.filter((author) => author !== myUser);
        allAuthors.push(recipients);
      }
    });

    querySnapshot = await getDocs(collection(db, "userProfiles"));
    const allUsers = []; //original for array of strings

    querySnapshot.forEach((document) => {
      // If the user is a participant in the conversation
      //  then add the name of the participants
      const userID = document.id;
      allAuthors.forEach((el) => {
        if (el[0] === userID) {
          allUsers.push(document.data().values);
        }
        setProfiles(allUsers);
      });
    });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setMyUser(user.email);
      getAllReceivers();
    } else {
      console.err("User must be signed in");
    }
  });

  // wong to fix it
  const getConversation = async (authorsList) => {
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
      setConversation(docRef);
    } else {
      setConversation(querySnapshot.docs[0]);
    }
  };

  // Everytime conversation change
  React.useEffect(() => {
    if (conversation != null) {
      setMessages(conversation.data().messages);
      setConvoId(conversation.id);
    }
  }, [conversation]);

  React.useEffect(() => {
    let unSub;
    if (convoId) {
      unSub = onSnapshot(doc(db, "messages", convoId), (document) => {
        setMessages(document.data().messages);
      });
    }
  }, [convoId]);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Grid container component={Paper}>
        <Grid item id="connection-list" style={{ flex: 1 }}>
          <List>
            {profiles.map((el, i) => (
              <ListItem
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                button
                onClick={async () => {
                  await getConversation([el.email, myUser]);
                  setName(`${el.firstName} ${el.lastName}`);
                }}
              >
                <Typography
                  sx={{ textTransform: "lowercase" }}
                  variant="body1"
                >{`${el.firstName} ${el.lastName}`}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item style={{ flex: 3 }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5">Chat With {name}</Typography>
            </Grid>
          </Grid>
          <MessageList messages={messages} />
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={12} align="right">
              <SendChat conversationID={convoId} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default TempMessages;
