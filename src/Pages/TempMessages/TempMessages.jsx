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
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../../Components/Navbar/Navbar";
import SendChatButton from "../../Components/SendChatButton/SendChatButton";
import "./TempMessages.css";
import MessageList from "../../Components/Messaging/ConversationList";
import ConnectionList from "../../Components/Messaging/ConnectionList";
import { app, auth } from "../../Firebase/firebase";

const theme = createTheme();
const aliID = "HMa7dZP4QoNZkpcl5Mpgi7vT5Vh1";

const GetConversation = async () => {
  const database = getFirestore(app);
  let docRef = doc(database, "messages", `${auth.currentUser.uid}-${aliID}`);
  let docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    console.log("Found doc on first try");
  } else {
    docRef = doc(database, "messages", `${aliID}-${auth.currentUser.uid}`);
    docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.log("Found doc on second try");
    } else {
      console.log("Doc not found");
    }
  }
  return docSnapshot.data();
};

const GetConnectionList = () => {
  console.log("Start get connection list");
  // Here we are suppose to go to the User Profile of current user & retrive its connections.
  const retrivedUID = [
    "HFm3FoBnAeW40fI04pXgCwsP9nk1",
    "IA2RAWWEsOZWFsYNNHdSaCBssuT2",
    "HMa7dZP4QoNZkpcl5Mpgi7vT5Vh1",
    "fZ54oR1iGTfwThreKpnuklsV5JC2",
    "toUEyDaacZSbEwyc9PFuUGqJR2m2",
    "uLDRf59LKoVKagD3aQJc4RiM8dV2",
    "16BYjV1dM4XZh4MY3pwfc1jxUK62",
    "8Th7kx7ZPKYzH4BOJqiaf8FZEBB3",
    "HBqPYplhjbbJeZ3THsAbMvT07sm1",
    "CqtAL3huXbQyo0ZAHNcRkvWbfBc2",
    "wGMNhwcMnybAzbzSqx1dtZfolVR2",
    "YIrMQaIg2eM1VqeS3rQK0cS0xOF3",
    "SE6fjg0zbKb4X6KAVrOa2d8TFWi1",
    "g7aTo5gtRCYjx3ggCJLOWnxVRFp2",
    "Rba8dhh49IXPFG1BSnlAGpAFTe93",
  ];
  console.log("End get connection list");
  return retrivedUID;
};

const TempMessages = () => {
  // State for writing new messages
  const [messageContent, setMessageContent] = useState("");

  // State for viewing existing messages
  const [conversation, setConversation] = useState();
  const [messages, setMessages] = useState([]);

  // State for viewing connections
  const [connectionList, setConnectionList] = useState([]);

  // Everytime conversation change
  React.useEffect(() => {
    if (conversation != null) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  // Once when the page renders
  React.useEffect(() => {
    setConnectionList(GetConnectionList());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Grid container>
        <Grid item xs={12}>
          <Button
            onClick={async () => {
              setConversation(await GetConversation());
            }}
          >
            SetConversation
          </Button>
        </Grid>
      </Grid>
      <Grid container component={Paper}>
        <Grid item id="connection-list" style={{ flex: 1 }}>
          <ConnectionList connections={connectionList} />
        </Grid>
        <Grid item style={{ flex: 3 }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5">Chat With Billy Bob</Typography>
            </Grid>
          </Grid>
          <MessageList messages={messages} />
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <SendChatButton messageContent={messageContent} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default TempMessages;
