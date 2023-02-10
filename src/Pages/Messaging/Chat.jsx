import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import Divider from "@material-ui/core/Divider";
// import TextField from "@material-ui/core/TextField";
// import Typography from "@material-ui/core/Typography";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import Avatar from "@material-ui/core/Avatar";
// import Fab from "@material-ui/core/Fab";
// import SendIcon from "@material-ui/icons/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import Navbar from "../../Components/Navbar/Navbar";
import { db, auth } from "../../Firebase/firebase";

const theme = createTheme();
// get our sender s email
//const user = auth.currentUser.email;
//
const user = "HMa7dZP4QoNZkpcl5Mpgi7vT5Vh1";
const messagesRefProfile = collection(db, "userProfiles");
const messagesRef = collection(db, "messages");

const Chat = () => {
  const [dmList, setDmList] = useState([]);
  const [profiles, setProfiles] = useState([]);
  // const messagesRefProfile = collection(db, "userProfiles");

  const getAllReceivers = async () => {
    const querySnapshot = await getDocs(collection(db, "messages"));
    const allAuthors = [];
    querySnapshot.forEach((doc) => {
      // If the user is a participant in the conversation
      //  then add the rest of the participants
      if (doc.data().authors.includes(user)) {
        const recipients = doc
          .data()
          .authors.filter((author) => author !== user);

        allAuthors.push(recipients);
      }

      setDmList(allAuthors);
    });
  };

  const queryMessages = query(messagesRef);
  let unsuscribe = onSnapshot(queryMessages, (snapshot) => {
    const msgs = [];
    snapshot.forEach((doc) => {
      msgs.push({ ...doc.data(), id: doc.id });
    });
  });

  const queryUser = query(messagesRefProfile);
  unsuscribe = onSnapshot(queryUser, (snapshot) => {
    const profs = [];
    snapshot.forEach((doc) => {
      profs.push({ ...doc.data(), id: doc.id });
    });
    // const names = profs.map((el) => {
    //   // console.log(el.values);
    //   return el.values;
    // });
    // setProfiles(names);
  });

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div>
        <p>
          {" "}
          {dmList.map((el) => (
            <p> {el} </p>
          ))}{" "}
        </p>
        {/* <p>hello {messages}</p>
        <p>hello {user}</p>
        <p>hello {userToPrint}</p> */}
        <button type="button" onClick={getAllReceivers}>
          Cool
        </button>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
