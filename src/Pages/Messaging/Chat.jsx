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
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Navbar from "../../Components/Navbar/Navbar";
import SendChatButton from "../../Components/SendChatButton/SendChatButton";
import { db, auth } from "../../Firebase/firebase";

const theme = createTheme();

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const messagesRefProfile = collection(db, "userProfiles");
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    // Get messages from Firestore
    const queryMessages = query(messagesRef);
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id });
      });
      console.log(msgs);
      // console.log(msgs[2].values.firstName);
      // console.log(msgs[0].messages[1].content.messageContent);

      setMessages(msgs[0].messages[1].content.messageContent);
      // setMessages(msgs[0].messages[1].content.messageContent);
    });

    return () => unsuscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div>
        <p>hello {messages}</p>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
