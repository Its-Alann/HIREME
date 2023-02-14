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
import { app, db } from "../../Firebase/firebase";

const theme = createTheme();
const bobId = "billybob@gmail.com";
const aliID = "aliceykchen01@gmail.com";
//const messagesRef = doc(database, 'messages', '')
// let conversationUser = "";

const auth = getAuth();

/*
props = {
  messageContent,
  conversationID, (the document to write to)
}
*/

const SendChat = (props) => {
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
    // const content = "twitter<3";
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
    // await updateDoc(doc(db, "messages", "17k4dPDcymw3GcNjSCSG"), {
    //   messages: arrayUnion(newMessage),
    // });

    //line 84 doesn't work, error "ya" type ????????
    /*
    const querySnapshot = await getDocs(collection(db, "messages"));
    querySnapshot.forEach(async (d) => {
      console.log("ref???", d);
      // If the user is a participant in the conversation
      //  then add the rest of the participants
      if (
        d.data().authors.includes(myUser) &&
        d.data().authors.includes(content.user)
      ) {
        console.log(newMessage);
        //conversationUser = d.data();
        await updateDoc(d, { messages: arrayUnion(newMessage) });
      }
      return 0;
    });
    */

    //yuchen code works, but we are trying to make it search authors

    // const docRef = doc(database, "messages", `${"u7McGqfpER62VLElKV6t"}`);
    // const docSnapshot = await getDoc(docRef);
    // if (docSnapshot.exists()) {
    //   console.log("Found doc on first try");
    //   await updateDoc(docRef, { messages: arrayUnion(newMessage) });
    //   return;
    // }

    //this is not neeeded
    // The id could also be <user_2_ID>-<user_1_ID>
    // docRef = doc(database, "messages", `${aliID}-${sender}`);
    // docSnapshot = await getDoc(docRef);
    // if (docSnapshot.exists()) {
    //   console.log("Found doc on second try");
    //   // We found the document
    //   // Inside the document, there is a list named "messages"
    //   // Append our new message to the list
    //   await updateDoc(docRef, { messages: arrayUnion(newMessage) });
    //   return;
    // }

    // // Other wise, we create a new document with the id of both users inside the "messages" collection
    // const newConversationRef = await addDoc(collection(database, "messages"), {
    //   authors: [], ///whos in the conversation
    //   messages: arrayUnion(newMessage),
    // });

    // await setDoc(doc(database, "messages", `${sender}-${aliID}`), {
    //   authors: [sender, aliID],
    //   messages: [newMessage],
    // });
  };

  return (
    <Grid container style={{ padding: "20px" }}>
      <Grid item xs={11}>
        <TextField
          id="outlined-basic-email"
          label="Type Something"
          fullWidth
          multiline
          onChange={(e) => setMessageContent(e.target.value)}
        />
      </Grid>
      <Grid xs={1} align="right">
        <Fab color="secondary" aria-label="add">
          <Button
            type="button"
            onClick={() => {
              handleClick();
            }}
          >
            <SendIcon />
          </Button>
        </Fab>
      </Grid>
    </Grid>
  );
};

export default SendChat;
