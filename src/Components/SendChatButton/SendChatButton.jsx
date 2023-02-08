import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import { RestaurantRounded } from "@material-ui/icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import Navbar from "../Navbar/Navbar";
import { app } from "../../Firebase/firebase";

const theme = createTheme();
const bobId = "CqtAL3huXbQyo0ZAHNcRkvWbfBc2";
const aliID = "HMa7dZP4QoNZkpcl5Mpgi7vT5Vh1";
const database = getFirestore(app);
//const messagesRef = doc(database, 'messages', '')

const auth = getAuth();

const handleClick = async (content) => {
  // Format a new message
  // const content = "twitter<3";
  const timestamp = Date().toLocaleUpperCase();
  const sender = auth.currentUser ? auth.currentUser.uid : bobId;
  const newMessage = {
    content,
    timestamp,
    sender,
  };

  // In <messages> the documents' id is of format <user_1_ID>-<user_2_ID>
  //                                                         * here is dash
  // If a document with such id exist, perform an update.
  let docRef = doc(database, "messages", `${sender}-${aliID}`);
  let docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    console.log("Found doc on first try");
    await updateDoc(docRef, { messages: arrayUnion(newMessage) });
    return;
  }

  // The id could also be <user_2_ID>-<user_1_ID>
  docRef = doc(database, "messages", `${aliID}-${sender}`);
  docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    console.log("Found doc on second try");
    // We found the document
    // Inside the document, there is a list named "messages"
    // Append our new message to the list
    await updateDoc(docRef, { messages: arrayUnion(newMessage) });
    return;
  }

  // Other wise, we create a new document with the id of both users
  await setDoc(doc(database, "messages", `${sender}-${aliID}`), {
    authors: [sender, aliID],
    messages: [newMessage],
  });
  console.log("Not found, create new");
};

const SendChatButton = (messageContent) => (
  <Fab color="secondary" aria-label="add">
    <Button
      type="button"
      onClick={() => {
        handleClick(messageContent);
      }}
    >
      <SendIcon />
    </Button>
  </Fab>
);

export default SendChatButton;
