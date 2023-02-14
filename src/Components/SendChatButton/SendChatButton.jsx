import React from "react";
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
} from "firebase/firestore";
import Button from "@mui/material/Button";
import { RestaurantRounded } from "@material-ui/icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import Navbar from "../Navbar/Navbar";
import { app, db } from "../../Firebase/firebase";

const theme = createTheme();
const bobId = "billybob@gmail.com";
const aliID = "aliceykchen01@gmail.com";
const database = getFirestore(app);
//const messagesRef = doc(database, 'messages', '')
let conversationUser = "";

const auth = getAuth();

/*
props = {
  messageContent,
  conversationID, (the document to write to)
}
*/

const handleClick = async (content) => {
  console.log(content);
  // Format a new message
  // const content = "twitter<3";
  const timestamp = Date().toLocaleUpperCase();
  if (auth.currentUser) {
    console.log(auth.currentUser.email);
  } else {
    console.log("Not exist current user");
  }
  const sender = auth.currentUser ? auth.currentUser.email : bobId;
  const newMessage = {
    content: content.messageContent,
    timestamp,
    sender,
  };

  //wong's code
  // const handleClick = async (content) => {
  // const timestamp = Date().toLocaleUpperCase();

  // const sender = auth.currentUser ? auth.currentUser.email : bobId;

  // const sender = auth.currentUser.email;
  // // const sender = billybob@gmail.com; //for testing
  // const newMessage = {
  //   content: props.messageContent,
  //   timestamp,
  //   sender,
  // };

  // console.log("currentUser", auth.currentUser.email);
  // console.log("content", props.messageContent);
  // console.log("newMessage", newMessage);

  // In <messages> the documents' id is of format <user_1_ID>-<user_2_ID>
  //                                                         * here is dash

  // If a document with such id exist, perform an update.

  const querySnapshot = await getDocs(collection(db, "messages"));
  querySnapshot.forEach((d) => {
    // If the user is a participant in the conversation
    //  then add the rest of the participants
    if (
      d.data().authors.includes(auth.CurrentUser.email) &&
      d.data().authors.includes(content.user)
    ) {
      console.log(d.data());
      conversationUser = d.data();
      return conversationUser; //return this conversation
    }
    return 0;
  });

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

  // // Other wise, we create a new document with the id of both users inside the "messages" collection
  // const newConversationRef = await addDoc(collection(database, "messages"), {
  //   authors: [], ///whos in the conversation
  //   messages: arrayUnion(newMessage),
  // });

  // await setDoc(doc(database, "messages", `${sender}-${aliID}`), {
  //   authors: [sender, aliID],
  //   messages: [newMessage],
  // });
  console.log("Not found, create new");
};

const SendChatButton = (messageContent) => (
  <Fab
    color="secondary"
    aria-label="add"
    onClick={() => {
      handleClick(messageContent);
    }}
  >
    <SendIcon />
  </Fab>
);

// wong's code
// const SendChatButton = (props) => (
//   <Fab color="secondary" aria-label="add">
//     <Button
//       type="button"
//       onClick={() => {
//         handleClick(props);
//       }}
//     >
//       <SendIcon />
//     </Button>
//   </Fab>
// );

export default SendChatButton;
