import React, { useState, useEffect } from "react";
// import { makeStyles } from "@mui/material/styles";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Avatar from "@mui/material/Avatar";
// import Fab from "@mui/material/Fab";
// import SendIcon from "@material-ui/icons/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import Navbar from "../../Components/Navbar/Navbar";
import { db, auth } from "../../Firebase/firebase";

const theme = createTheme();
// get our sender s email
//const user = auth.currentUser.email;
//
const user = "billybob@gmail.com";

const Chat = () => {
  const [dmList, setDmList] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // get all names of user's receivers
  const getAllReceivers = async () => {
    let querySnapshot = await getDocs(collection(db, "messages"));
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

    querySnapshot = await getDocs(collection(db, "userProfiles"));
    const allUsers = [];
    querySnapshot.forEach((doc) => {
      // If the user is a participant in the conversation
      //  then add the name of the participants
      const userID = doc.id; //currentuser
      allAuthors.forEach((el) => {
        if (el[0] !== userID) {
          allUsers.push(doc.data().values.firstName);
        }
        setProfiles(allUsers);
      });
    });
  };

  useEffect(() => {
    // display automatically the names of the user's receivers
    getAllReceivers();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div>
        {/* <p>
          {" "}
          {dmList.map((el) => (
            <p> {el} </p>
          ))}{" "}
        </p> */}
        <p>
          {" "}
          {profiles.map((el) => (
            <p> {el} </p>
          ))}{" "}
        </p>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
