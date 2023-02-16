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
import "./Messaging.css";
import MessageList from "../../Components/Messaging/MessageList";
import { auth, db } from "../../Firebase/firebase";
import NewConvo from "../../Components/NewConvo/NewConvo";

const theme = createTheme();

const Messaging = () => {
  // State for writing messages
  const [messages, setMessages] = useState([]);

  // State for the current conversation to display
  const [convoId, setConvoId] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState([]);

  const [myUser, setMyUser] = useState("");

  // get all names of user's receivers
  const getAllReceivers = async () => {
    const messagesRef = collection(db, "messages");

    // Searches all converstations containing the currentUser
    const convosQuery = query(
      messagesRef,
      where("authors", "array-contains", myUser)
    );
    const allAuthors = [];
    const unSub = onSnapshot(convosQuery, (querySnapshot) => {
      querySnapshot.forEach((document) => {
        allAuthors.push(
          document.data().authors.filter((author) => author !== myUser)
        );
      });
      console.log("allAuthors", allAuthors);
    });

    const querySnapshot = await getDocs(collection(db, "userProfiles"));
    const allUsers = []; //original for array of strings

    querySnapshot.forEach((document) => {
      // If the user is a participant in the conversation
      //  then add the name of the participants
      const userID = document.id;
      console.log("userID", userID);
      allAuthors.forEach((el) => {
        console.log("el", el);
        if (el.includes(userID)) {
          allUsers.push({ email: userID, values: document.data().values });
        }
      });
    });

    setProfiles(allUsers);
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

  // wong to fix it
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
    console.log("thing id", querySnapshot.docs[0].id);
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
                  setConvoId(await getConversationId([el.email, myUser]));
                  setName(`${el.values.firstName} ${el.values.lastName}`);
                }}
              >
                <Typography
                  sx={{ textTransform: "lowercase" }}
                  variant="body1"
                >{`${el.values.firstName} ${el.values.lastName}`}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item style={{ flex: 3 }}>
          <NewConvo />
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5">Chat With {name}</Typography>
            </Grid>
          </Grid>
          <MessageList messages={messages} />
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={12} align="right">
              <SendChat conversationID={convoId} myUser={myUser} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Messaging;
