import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@material-ui/core";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../../Components/Navbar/Navbar";
import SendChat from "../../Components/SendChat/SendChat";
import "./TempMessages.css";
import MessageList from "../../Components/Messaging/ConversationList";
import ConnectionList from "../../Components/Messaging/ConnectionList";
import { app, auth, db } from "../../Firebase/firebase";

const theme = createTheme();
const aliID = "HMa7dZP4QoNZkpcl5Mpgi7vT5Vh1";
//const user = "billybob@gmail.com";
// const user = auth.currentUser.email;

// const user = user1.email;
// console.log(user);
let conversationUser = "";

const TempMessages = () => {
  const [currentUser, setcurrentUser] = useState("");
  const [currentDocRef, setCurrentDocRef] = useState("");
  const [messages, setMessages] = useState([]);
  // State for writing new messages
  const [messageContent, setMessageContent] = useState("");

  // State for viewing existing messages
  const [conversation, setConversation] = useState();
  // aded this
  const [convoId, setConvoId] = useState("");

  // State for viewing connections
  const [connectionList, setConnectionList] = useState([]);

  const [dmList, setDmList] = useState([]);
  const [profiles, setProfiles] = useState([]);
  //const [emails, setEmails] = useState([]);
  const [name, setName] = useState([]);
  const [email, SetEmail] = useState("");

  let myUser = "";

  // const unSub = onSnapshot(doc(db, "messages", convoId), (document) => {
  //   setMessages(document.data().messages);
  // });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties

      setcurrentUser(user.email);
      myUser = user.email;
    } else {
      // User is signed out
      // ...
      console.log("user not found");
    }
  });

  const GetConversation = async (value) => {
    // const otherUser = "aliceykchen01@gmail.com"; //ali's id should be passed through props
    console.log("passed value", value);
    const otherUser = value;
    const querySnapshot = await getDocs(collection(db, "messages"));
    querySnapshot.forEach((d) => {
      // If the user is a participant in the conversation
      //  then add the rest of the participants
      if (
        d.data().authors.includes(myUser) &&
        d.data().authors.includes(otherUser)
      ) {
        console.log("d.data", d.data());
        console.log("d.data.id", d.data().id);
        console.log("d.id", d.id);
        //conversationUser = d.data();
        conversationUser = d;
        setCurrentDocRef(d.id);
        return conversationUser; //return this conversation
      }
      return 0;
    });
  };

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
      console.log(allAuthors);
      setDmList(allAuthors);
    });

    querySnapshot = await getDocs(collection(db, "userProfiles"));
    const allUsers = []; //original for array of strings
    // let allUsers = [] {
    //   emails: "",
    //   firstName: "",
    //   lastName: "",
    // };

    querySnapshot.forEach((document) => {
      // If the user is a participant in the conversation
      //  then add the name of the participants
      const userID = document.id;
      console.log(allAuthors);
      allAuthors.forEach((el) => {
        console.log(el[0] === userID);
        if (el[0] === userID) {
          allUsers.push(
            // emails: document.data().values.email,
            // firstName: document.data().values.firstName,
            // lastName: document.data().values.lastName

            document.data().values

            // `${document.data().values.firstName} ${
            //   document.data().values.lastName
            // }`
          );
          console.log("THE IDDDDD", document.id);
        }
        console.log("allUsers:/n", allUsers);
        setProfiles(allUsers);
      });
    });
  };
  // Everytime conversation change
  React.useEffect(() => {
    // setConversation(GetConversation());
    if (conversation != null) {
      setMessages(conversation.data().messages);
      setConvoId(conversation.id);
      console.log("this should be the messages", conversation.data().messages);
      console.log(
        "TIMESTIOMP",
        conversation.data().messages[0].timestamp.toDate()
      );
      console.log("this should be the document id", conversation.id);
    }
  }, [conversation]);

  // Once when the page renders
  React.useEffect(() => {
    // setConnectionList(GetConnectionList());
  }, []);

  useEffect(() => {
    // display automatically the names of the user's receivers
    getAllReceivers();
    console.log(profiles);
  }, []);

  React.useEffect(() => {
    console.log("convoId", convoId);
    let unSub;
    if (convoId) {
      unSub = onSnapshot(doc(db, "messages", convoId), (document) => {
        console.log("I WANNA ROCK WITH YOU", document.data().messages);
        setMessages(document.data().messages);
      });
    }
  }, [convoId]);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Grid container>
        <Grid item xs={12}>
          {/* <Button
            onClick={async () => {
              await GetConversation();
              setConversation(conversationUser);
            }}
          >
            SetConversation
          </Button> */}
        </Grid>
      </Grid>
      <Grid container component={Paper}>
        <Grid item id="connection-list" style={{ flex: 1 }}>
          <List>
            {profiles.map((el, i) => (
              <ListItem
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                button
                onClick={async () => {
                  await GetConversation(el.email);
                  setConversation(conversationUser);
                  setName(`${el.firstName} ${el.lastName}`);
                  SetEmail(el.email);
                  console.log("el******", el);
                }}
              >
                <Typography
                  sx={{ textTransform: "lowercase" }}
                  variant="body1"
                >{`${el.firstName} ${el.lastName}`}</Typography>
              </ListItem>
            ))}
          </List>

          {/* <ConnectionList connections={connectionList} /> */}
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
