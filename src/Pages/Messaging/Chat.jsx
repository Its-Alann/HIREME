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
// get our sender s email
//const user = auth.currentUser.email;
//
const user = "HMa7dZP4QoNZkpcl5Mpgi7vT5Vh1";
console.log(user);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const messagesRefProfile = collection(db, "userProfiles");
  const messagesRef = collection(db, "messages");
  const receivers = [];

  const [userToPrint, setUserToPrint] = useState([]);

  useEffect(() => {
    // get receiver's email from messages collection

    const queryMessages = query(messagesRef);
    let unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id });
      });

      //console.log(msgs.length);

      //for (let i = 0; i < msgs.length; ) {
      //msgs.forEach((el, index, array) => {});
      setMessages(msgs[0].id);
      console.log(messages);

      if (messages.includes(user)) {
        const arrayOfIds = messages.split("-");
        console.log(arrayOfIds[1]);
        setUserToPrint(messages);
        console.log("The search string  was found in ");
      } else {
        console.log(messages);
        const arrayOfIds = messages.split("-");
        console.log(arrayOfIds[0]);

        if (arrayOfIds[0] === user) {
          setUserToPrint(arrayOfIds[1]);
        } else {
          //console.log(arrayOfIds[0]);
          setUserToPrint(arrayOfIds[0]);
          //console.log(userToPrint);
        }
        //
        console.log(userToPrint);
      }
      //i += 1;
      console.log(1);
      //}
    });
    console.log(userToPrint);
    // get receiver's name from userProfile collection
    const queryUser = query(messagesRefProfile);
    unsuscribe = onSnapshot(queryUser, (snapshot) => {
      const profs = [];
      snapshot.forEach((doc) => {
        profs.push({ ...doc.data(), id: doc.id });
      });
      console.log(profs[3].values.firstName);

      setProfiles(profs[3].values.firstName);
    });

    return () => unsuscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div>
        {receivers}
        {/* <p>hello {messages}</p>
        <p>hello {user}</p>
        <p>hello {userToPrint}</p> */}
        <p>{profiles}</p>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
