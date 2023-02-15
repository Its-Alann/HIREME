import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import { Grid, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { app, db } from "../../Firebase/firebase";

const theme = createTheme();

const bobId = "billybob@gmail.com";
const aliID = "aliceykchen01@gmail.com";

const auth = getAuth();

const SendChat = ({ conversationID }) => {
  // const SendChat = ({ conversationID }) => {
  const [messageContent, setMessageContent] = useState("");

  let myUser = "";
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      myUser = user.email;
    } else {
      // User is signed out
      // ...
      console.log("user not found");
    }
  });

  const handleClick = async () => {
    // Format a new message
    const timestamp = Timestamp.now();
    if (myUser) {
      console.log(myUser);
    } else {
      console.log("Not exist current user");
    }
    const sender = myUser;
    const newMessage = {
      content: messageContent,
      timestamp,
      sender,
    };

    console.log(newMessage, newMessage.timestamp.toDate());

    // SENDS TO THE DB
    // ex id: "17k4dPDcymw3GcNjSCSG"
    await updateDoc(doc(db, "messages", conversationID), {
      messages: arrayUnion(newMessage),
    });

    //yuchen code works, but we are trying to make it search authors
    // const id = content.conversationID;
    // const docRef = doc(db, "messages", id);
    // const docSnapshot = await getDoc(docRef);
    // if (docSnapshot.exists()) {
    //   console.log("Found doc on first try");
    //   await updateDoc(docRef, { messages: arrayUnion(newMessage) });
    //   return;
    // }
  };

  return (
    <Grid container style={{ padding: "20px" }}>
      <Grid item xs={11}>
        <TextField
          id="outlined-basic-email"
          label="Type Something"
          fullWidth
          onChange={(e) => setMessageContent(e.target.value)}
          value={messageContent}
        />
      </Grid>
      <Grid item xs={1} align="right">
        <Fab color="secondary" aria-label="add">
          <Button
            type="button"
            onClick={() => {
              handleClick();
              setMessageContent("");
            }}
          >
            <SendIcon />
          </Button>
        </Fab>
      </Grid>
    </Grid>
  );
};

SendChat.propTypes = {
  conversationID: PropTypes.string,
};

export default SendChat;
